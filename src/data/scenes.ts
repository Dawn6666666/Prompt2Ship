// Scene patches are cumulative. Jumping to a substep produces the same scene
// as visiting each earlier substep, without changing the reader's self-checks.
export type ScenePatch = Partial<{
  view: string;
  width: number;
  version: "v1" | "v2";
  file: string;
  focus: string;
  change: number;
}>;
export const stepPatches: ScenePatch[] = [
  { view: "agent" },
  { view: "code" },
  { view: "agent", width: 1280, version: "v1" },
  { view: "preview", width: 375, version: "v1" },
  { view: "code", version: "v2" },
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
    { view: "preview", version: "v1" },
    { view: "preview" },
    { view: "diff", version: "v2" },
    { view: "preview" },
  ],
  [{}, {}, {}],
];
