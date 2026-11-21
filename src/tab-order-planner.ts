import type { BrowserWindow } from "./browser-windows";
import type { MergePlanner } from "./merge-planner";
import type { MergeStep } from "./merge-steps";
import type { PlanStrategy } from "./plan-strategy";

// Works out the moves that bring every tab across in the order the windows and
// their tabs are in now. Each kind of planning, listed in main.ts, adds its
// steps after the ones before it.
export class TabOrderPlanner implements MergePlanner {
  constructor(private readonly strategies: PlanStrategy[]) {}

  plan(windows: BrowserWindow[]): MergeStep[] {
    const tabs = windows.map((window) => window.tabs ?? []);
    return this.strategies.flatMap((strategy) => strategy.plan(tabs));
  }
}
