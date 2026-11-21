import type { BrowserWindow } from "./browser-windows";
import type { MergeStep } from "./merge-steps";

// Works out the steps that bring the given windows' tabs across.
export interface MergePlanner {
  plan(windows: BrowserWindow[]): MergeStep[];
}
