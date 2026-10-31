import type { BrowserTab, BrowserWindow } from "./browser-windows";
import type { MergeStep, MergeSteps } from "./merge-steps";

export interface MergePlanner {
  plan(windows: BrowserWindow[]): MergeStep[];
}

// chrome.tabGroups.TAB_GROUP_ID_NONE, which a service worker could read, but
// the planner would then depend on chrome.
const NO_GROUP = -1;

// Works out the moves that bring every tab across in the order the windows and
// their tabs are in now, groups intact, pinned tabs still pinned.
export class TabOrderPlanner implements MergePlanner {
  constructor(private readonly steps: MergeSteps) {}

  plan(windows: BrowserWindow[]): MergeStep[] {
    const tabs = windows.map((window) => window.tabs ?? []);
    const pinned = tabs
      .flat()
      .filter((tab) => tab.pinned)
      .flatMap((tab) => (tab.id === undefined ? [] : [tab.id]));
    return [
      ...tabs.flatMap((windowTabs) => this.planWindow(windowTabs)),
      ...(pinned.length > 0 ? [this.steps.pin(pinned)] : []),
    ];
  }

  // Runs of ungrouped tabs go across in one move each, and a group goes across
  // whole where its first tab is.
  private planWindow(tabs: BrowserTab[]): MergeStep[] {
    const steps: MergeStep[] = [];
    const groups = new Set<number>();
    let loose: number[] = [];
    const flush = () => {
      if (loose.length > 0) {
        steps.push(this.steps.moveTabs(loose));
        loose = [];
      }
    };
    for (const tab of tabs) {
      if (tab.groupId === NO_GROUP) {
        if (tab.id !== undefined) loose.push(tab.id);
      } else if (!groups.has(tab.groupId)) {
        flush();
        groups.add(tab.groupId);
        steps.push(this.steps.moveGroup(tab.groupId));
      }
    }
    flush();
    return steps;
  }
}
