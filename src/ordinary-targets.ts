import { NORMAL_WINDOW, type BrowserWindow } from "./browser-windows";
import type { MergeTargets } from "./merge-targets";

const POPUP_TARGET_MESSAGE = "Merge from an ordinary window, not a popup";

// Window ids are unique, so this finds the target only if it is ordinary.
const ordinaryWithId =
  (id: number) =>
  (window: BrowserWindow): boolean =>
    window.id === id && window.type === NORMAL_WINDOW;

// Only an ordinary window takes tabs, and only from windows on its own side of
// incognito, since Chrome will not move a tab between an incognito window and
// an ordinary one. Minimised windows and popups give theirs like any other.
export class OrdinaryTargets implements MergeTargets {
  donorsFor(windows: BrowserWindow[], targetId: number): BrowserWindow[] {
    const target = windows.find(ordinaryWithId(targetId));
    if (target === undefined) {
      throw new Error(POPUP_TARGET_MESSAGE);
    }
    return windows.filter(
      (window) =>
        window.id !== targetId && window.incognito === target.incognito,
    );
  }
}
