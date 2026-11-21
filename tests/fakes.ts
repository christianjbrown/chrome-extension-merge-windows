import type { MergeStep } from "../src/merge-steps";
import { GroupPlanning } from "../src/group-planning";
import { LooseTabsPlanning } from "../src/loose-tabs-planning";
import { PinPlanning } from "../src/pin-planning";
import type { PlanStrategy } from "../src/plan-strategy";
import { GroupRuns } from "../src/tab-runs";
import { WindowMovesPlanning } from "../src/window-moves-planning";

const step = (name: string): MergeStep & { name: string } => ({
  name,
  run: () => Promise.resolve(),
});

// The planning main.ts lists, with steps that say what they are, so a plan can
// be compared with toEqual.
export const recordingPlanning = (): PlanStrategy[] => [
  new WindowMovesPlanning(new GroupRuns(), [
    new LooseTabsPlanning({
      build: ({ tabIds }) => step(`tabs ${tabIds.join(",")}`),
    }),
    new GroupPlanning({
      build: ({ groupId }) => step(`group ${String(groupId)}`),
    }),
  ]),
  new PinPlanning({ build: ({ tabIds }) => step(`pin ${tabIds.join(",")}`) }),
];

export function names(steps: MergeStep[]): string[] {
  return steps.map((step) => (step as MergeStep & { name: string }).name);
}
