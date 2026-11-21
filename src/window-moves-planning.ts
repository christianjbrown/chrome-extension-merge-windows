import type { BrowserTab } from "./browser-windows";
import type { MergeStep } from "./merge-steps";
import type { PlanStrategy } from "./plan-strategy";
import type { RunStrategy } from "./run-strategy";
import type { RunSplitter, TabRun } from "./run-splitter";

// Brings each window's tabs across run by run, window by window. The kinds of
// run step are listed in main.ts.
export class WindowMovesPlanning implements PlanStrategy {
  constructor(
    private readonly splitter: RunSplitter,
    private readonly kinds: RunStrategy[],
  ) {}

  plan(windows: BrowserTab[][]): MergeStep[] {
    return windows.flatMap((tabs) =>
      this.splitter.runs(tabs).flatMap((run) => this.stepsFor(run)),
    );
  }

  private stepsFor(run: TabRun): MergeStep[] {
    return this.kinds.flatMap((kind) => kind.stepsFor(run));
  }
}
