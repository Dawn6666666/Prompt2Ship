import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const require = createRequire(import.meta.url);
const cache = new Map();
async function moduleUrl(url) {
  if (cache.has(url.href)) return cache.get(url.href);
  let source = ts.transpileModule(await readFile(url, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText;
  for (const match of [...source.matchAll(/from ["']([^"']+)["']/g)]) {
    const specifier = match[1];
    const resolved = specifier.startsWith(".")
      ? await moduleUrl(new URL(`${specifier}.ts`, url))
      : pathToFileURL(require.resolve(specifier)).href;
    source = source.replace(match[0], `from ${JSON.stringify(resolved)}`);
  }
  const result = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
  cache.set(url.href, result);
  return result;
}
const state = await import(
  await moduleUrl(new URL("../src/lib/scene-state.ts", import.meta.url))
);
const acceptance = await import(
  await moduleUrl(new URL("../src/data/acceptance.ts", import.meta.url))
);

test("scene routes reset generated state, substeps are reversible, and verification requires inspecting every example", () => {
  const route = (step) =>
    state.sceneReducer({}, { type: "route", step, todo: false });
  const created = state.sceneReducer(route(2), { type: "substep", sub: 2 });
  assert.deepEqual(state.sceneMilestones(created, 0, 6), [
    true,
    true,
    true,
    false,
  ]);
  assert.deepEqual(state.sceneMilestones(route(2), 0, 6), [
    true,
    false,
    false,
    false,
  ]);
  const modified = state.sceneReducer(route(3), { type: "substep", sub: 2 });
  assert.equal(route(3).width, 1280);
  assert.equal(
    state.sceneReducer(route(3), { type: "substep", sub: 1 }).width,
    375,
  );
  assert.equal(modified.version, "v2");
  assert.equal(
    state.sceneReducer(modified, { type: "substep", sub: 0 }).version,
    "v1",
  );
  assert.equal(state.sceneMilestones(route(4), 5, 6)[3], false);
  assert.equal(state.sceneMilestones(route(4), 6, 6)[3], true);
  assert.equal(
    state
      .sceneArtifacts(route(2), true, 0, 6)
      .files.some((file) => file.status === "M"),
    false,
  );
  assert.deepEqual(state.sceneArtifacts(created, false, 0, 6).commits, []);
  const planned = state.sceneArtifacts(route(1), true, 0, 6).files;
  assert.equal(planned.length, 6);
  assert.equal(planned.filter((file) => file.status === "将修改").length, 4);
  assert.deepEqual(
    state.sceneArtifacts(
      state.sceneReducer(route(4), { type: "substep", sub: 2 }),
      false,
      6,
      6,
    ).commits,
    ["v1", "v2"],
  );
});

test("every acceptance check has a requirement origin and an observable target", () => {
  for (const todo of [false, true]) {
    const spec = acceptance.requirementSpec(todo),
      checks = acceptance.acceptanceChecks(todo);
    assert.equal(spec.length, 5);
    assert.equal(checks.length, 6);
    assert.equal(new Set(checks.map((item) => item.id)).size, 6);
    for (const check of checks) {
      assert.ok(spec[check.row].checks.includes(check));
      assert.ok(check.how.length > 10);
      assert.ok(
        ["preview", "code", "evidence", "scope"].includes(check.target),
      );
      if (todo) assert.ok(check.evidenceNames.length);
    }
  }
});
