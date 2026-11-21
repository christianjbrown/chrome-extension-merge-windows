// One thing to do to the window being merged into. Steps run in order.
export interface MergeStep {
  run(windowId: number): Promise<void>;
}

// The kinds of step a plan can ask for, and what each one needs to know.
export interface StepDetails {
  moveTabs: { tabIds: number[] };
  moveGroup: { groupId: number };
  pin: { tabIds: number[] };
}

export type StepKind = keyof StepDetails;

export const STEP_KIND = {
  moveTabs: "moveTabs",
  moveGroup: "moveGroup",
  pin: "pin",
} as const satisfies { [K in StepKind]: K };

// Makes the step a plan asks for.
export interface MergeSteps {
  make<K extends StepKind>(kind: K, details: StepDetails[K]): MergeStep;
}

// How to make each kind of step. A new kind of step is a new entry in
// StepDetails and a new builder here, given in main.ts.
export type StepBuilders = {
  [K in StepKind]: (details: StepDetails[K]) => MergeStep;
};
