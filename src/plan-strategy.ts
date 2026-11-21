import type { BrowserTab } from "./browser-windows";
import type { MergeStep } from "./merge-steps";

// One kind of planning. Given every other window's tabs, in window order, it
// returns the steps it wants, or none when it does not apply.
export interface PlanStrategy {
  plan(windows: BrowserTab[][]): MergeStep[];
}
