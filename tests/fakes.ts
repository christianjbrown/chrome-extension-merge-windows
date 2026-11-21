import type { MergeStep, MergeSteps, StepBuilders } from "../src/merge-steps";
import { StepRegistry } from "../src/step-registry";

const step = (name: string): MergeStep & { name: string } => ({
  name,
  run: () => Promise.resolve(),
});

// Steps that say what they are, so a plan can be compared with toEqual.
const recording: StepBuilders = {
  moveTabs: ({ tabIds }) => step(`tabs ${tabIds.join(",")}`),
  moveGroup: ({ groupId }) => step(`group ${String(groupId)}`),
  pin: ({ tabIds }) => step(`pin ${tabIds.join(",")}`),
};

export const recordingSteps = (): MergeSteps => new StepRegistry(recording);

export function names(steps: MergeStep[]): string[] {
  return steps.map((step) => (step as MergeStep & { name: string }).name);
}
