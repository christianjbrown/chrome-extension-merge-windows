// One thing to do to the window being merged into. Steps run in order.
export interface MergeStep {
  run(windowId: number): Promise<void>;
}

export interface MergeSteps {
  moveTabs(tabIds: number[]): MergeStep;
  moveGroup(groupId: number): MergeStep;
  pin(tabIds: number[]): MergeStep;
}
