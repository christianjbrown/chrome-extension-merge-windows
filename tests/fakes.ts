import type { MergeStep, MergeSteps } from "../src/merge-steps";

// Steps that say what they are, so a plan can be compared with toEqual.
export class RecordingSteps implements MergeSteps {
  moveTabs(tabIds: number[]): MergeStep {
    return this.step(`tabs ${tabIds.join(",")}`);
  }

  moveGroup(groupId: number): MergeStep {
    return this.step(`group ${String(groupId)}`);
  }

  pin(tabIds: number[]): MergeStep {
    return this.step(`pin ${tabIds.join(",")}`);
  }

  private step(name: string): MergeStep & { name: string } {
    return { name, run: () => Promise.resolve() };
  }
}

export function names(steps: MergeStep[]): string[] {
  return steps.map((step) => (step as MergeStep & { name: string }).name);
}
