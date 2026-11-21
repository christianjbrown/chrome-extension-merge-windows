import type { MergeStep } from "../src/merge-steps";
import type { PlanSteps } from "../src/tab-order-planner";

const step = (name: string): MergeStep & { name: string } => ({
  name,
  run: () => Promise.resolve(),
});

// Steps that say what they are, so a plan can be compared with toEqual.
export const recordingSteps = (): PlanSteps => ({
  moveTabs: { build: ({ tabIds }) => step(`tabs ${tabIds.join(",")}`) },
  moveGroup: { build: ({ groupId }) => step(`group ${String(groupId)}`) },
  pin: { build: ({ tabIds }) => step(`pin ${tabIds.join(",")}`) },
});

export function names(steps: MergeStep[]): string[] {
  return steps.map((step) => (step as MergeStep & { name: string }).name);
}
