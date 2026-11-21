import type { BrowserTab } from "./browser-windows";
import type { MergeStep } from "./merge-steps";
import type { PlanStrategy } from "./plan-strategy";
import type { RunStrategy } from "./run-strategy";
import { tabRuns, type TabRun } from "./tab-runs";

// Brings each window's tabs across run by run, window by window. The kinds of
// run step are listed in main.ts.
export class WindowMovesPlanning implements PlanStrategy {
  constructor(private readonly kinds: RunStrategy[]) {}

  plan(windows: BrowserTab[][]): MergeStep[] {
    return windows.flatMap((tabs) =>
      tabRuns(tabs).flatMap((run) => this.stepsFor(run)),
    );
  }

  private stepsFor(run: TabRun): MergeStep[] {
    return this.kinds.flatMap((kind) => kind.stepsFor(run));
  }
}
