import { useReducer } from "react";
import {
  stepPatches,
  substepPatches,
  sceneFiles,
  type ScenePatch,
} from "../data/scenes";

export type SceneState = Required<ScenePatch> & { step: number; sub: number };
type Action =
  | { type: "patch"; patch: ScenePatch }
  | { type: "route"; step: number; todo: boolean }
  | { type: "substep"; sub: number };
const initial: SceneState = {
  step: 0,
  sub: 0,
  view: "agent",
  width: 1280,
  version: "v1",
  file: "index.html",
  focus: "",
  change: 0,
  briefRow: -1,
};
export function sceneReducer(state: SceneState, action: Action): SceneState {
  if (action.type === "patch") return { ...state, ...action.patch };
  if (action.type === "route")
    return {
      ...initial,
      step: action.step,
      file: action.todo ? "server/db.js" : "index.html",
      ...stepPatches[action.step],
    };
  return {
    ...state,
    focus: "",
    ...Object.assign(
      {},
      ...substepPatches[state.step].slice(0, action.sub + 1),
    ),
    sub: action.sub,
  };
}
export function useSceneState() {
  return useReducer(sceneReducer, initial);
}
export function sceneMilestones(
  state: SceneState,
  checkedExampleCount: number,
  totalChecks: number,
) {
  return [
    state.step > 0,
    state.step > 2 || (state.step === 2 && state.sub >= 1),
    state.step > 2 || (state.step === 2 && state.sub >= 2),
    state.step === 4 && checkedExampleCount === totalChecks,
  ];
}
// These are derived, not independently mutable state: rewinding cannot leave
// a stale file marker, commit or verification badge behind.
export function sceneArtifacts(
  state: SceneState,
  todo: boolean,
  inspected: number,
  total: number,
) {
  const { step, sub } = state;
  const files = todo
    ? [...sceneFiles.todo, ...sceneFiles.todoRetained].map((name, index) => ({
        name,
        status:
          index >= sceneFiles.todo.length
            ? ""
            : step === 1
              ? "将修改"
              : (step === 2 && sub >= 1 && sub < 3) || (step === 3 && sub >= 2)
                ? "M"
                : "",
      }))
    : sceneFiles.homepage
        .filter(
          (_, index) => index === 0 || step >= 3 || (step === 2 && sub >= 1),
        )
        .map((name) => ({
          name,
          status: name === "index.html" && step === 2 && sub < 3 ? "新建" : "",
        }));
  return {
    files,
    status: sceneMilestones(state, inspected, total),
    commits:
      step === 4 && sub >= 2
        ? ["v1", "v2"]
        : step > 2 || (step === 2 && sub >= 3)
          ? ["v1"]
          : [],
    highlight: {
      file: state.file,
      region: state.focus,
      requirement: state.briefRow,
      diff: state.change,
    },
  };
}
