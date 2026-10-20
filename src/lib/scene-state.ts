import { useReducer } from "react";
import { stepPatches, substepPatches, type ScenePatch } from "../data/scenes";

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
