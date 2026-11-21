import {
  MERGEABLE_WINDOW_TYPES,
  NORMAL_WINDOW,
  type BrowserWindow,
  type WindowSource,
} from "./browser-windows";
import type { MergePlanner } from "./merge-planner";

export interface Merger {
  mergeInto(windowId: number): Promise<void>;
}

const POPUP_TARGET_MESSAGE = "Merge from an ordinary window, not a popup";

// Pulls the tabs of every other window into the given one. Minimised windows
// and popups are included. Chrome closes each window once it is empty.
export class WindowMerger implements Merger {
  constructor(
    private readonly windows: WindowSource,
    private readonly planner: MergePlanner,
  ) {}

  async mergeInto(windowId: number): Promise<void> {
    const all = await this.windows.getAll({
      populate: true,
      windowTypes: [...MERGEABLE_WINDOW_TYPES],
    });
    const target = this.targetIn(all, windowId);
    // Chrome will not move a tab between an incognito window and an ordinary
    // one, so each kind only ever merges with its own.
    const donors = all.filter(
      (window) =>
        window.id !== windowId && window.incognito === target.incognito,
    );
    for (const step of this.planner.plan(donors)) {
      await step.run(windowId);
    }
  }

  private targetIn(all: BrowserWindow[], windowId: number): BrowserWindow {
    const target = all.find((window) => window.id === windowId);
    if (target?.type !== NORMAL_WINDOW) {
      throw new Error(POPUP_TARGET_MESSAGE);
    }
    return target;
  }
}
