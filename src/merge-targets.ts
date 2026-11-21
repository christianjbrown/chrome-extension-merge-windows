import type { BrowserWindow } from "./browser-windows";

// Which windows may give their tabs to the one being merged into. Throws when
// that window cannot take them at all.
export interface MergeTargets {
  donorsFor(windows: BrowserWindow[], targetId: number): BrowserWindow[];
}
