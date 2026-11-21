// One thing to do to the window being merged into. Steps run in order.
export interface MergeStep {
  run(windowId: number): Promise<void>;
}

// Makes one kind of step from what that kind needs to know. Each kind declares
// its own details next to its builder, so a new kind edits nothing here.
export interface StepBuilder<Details> {
  build(details: Details): MergeStep;
}
