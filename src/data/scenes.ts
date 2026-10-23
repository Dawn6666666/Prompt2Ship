// Scene patches are cumulative. Jumping to a substep produces the same scene
// as visiting each earlier substep, without changing the reader's self-checks.
export type ScenePatch = Partial<{
  view: string;
  width: number;
  version: "v1" | "v2";
  file: string;
  focus: string;
  change: number;
  briefRow: number;
}>;
export const stepPatches: ScenePatch[] = [
  { view: "agent" },
  { view: "code", briefRow: 2 },
  { view: "agent", width: 1280, version: "v1" },
  { view: "preview", width: 1280, version: "v1", briefRow: 3 },
  { view: "code", version: "v2", briefRow: 3 },
];
export const substepPatches: ScenePatch[][] = [
  [{}, {}, {}, {}],
  [{}, {}, {}],
  [
    { view: "agent" },
    { view: "code" },
    { view: "terminal" },
    { view: "terminal" },
  ],
  [
    { view: "preview", width: 1280, version: "v1" },
    { view: "preview", width: 375 },
    { view: "diff", version: "v2" },
    { view: "preview" },
  ],
  [{}, {}, {}],
];
export const sceneFiles = {
  homepage: ["需求单.md", "index.html"],
  todo: [
    "server/db.js",
    "server/routes/todos.js",
    "client/src/components/TodoForm.jsx",
    "client/src/components/TodoItem.jsx",
  ],
  todoRetained: ["client/src/api/todos.js", "client/src/App.jsx"],
};
