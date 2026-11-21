import { NORMAL_WINDOW, type BrowserWindow } from "./browser-windows";
import type { MergeTargets } from "./merge-targets";

const POPUP_TARGET_MESSAGE = "Merge from an ordinary window, not a popup";

// Only an ordinary window takes tabs, and only from windows on its own side of
// incognito, since Chrome will not move a tab between an incognito window and
// an ordinary one. Minimised windows and popups give theirs like any other.
export class OrdinaryTargets implements MergeTargets {
  donorsFor(windows: BrowserWindow[], targetId: number): BrowserWindow[] {
    const target = windows.find((window) => window.id === targetId);
    if (target?.type !== NORMAL_WINDOW) {
      throw new Error(POPUP_TARGET_MESSAGE);
    }
    return windows.filter(
      (window) =>
        window.id !== targetId && window.incognito === target.incognito,
    );
  }
}
