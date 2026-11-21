import type { BrowserTab, BrowserWindow } from "./browser-windows";
import type { MergePlanner } from "./merge-planner";
import type { GroupMoveDetails } from "./group-move";
import type { MergeStep, StepBuilder } from "./merge-steps";
import type { PinDetails } from "./pin";
import type { TabsMoveDetails } from "./tabs-move";

// chrome.tabGroups.TAB_GROUP_ID_NONE, which a service worker could read, but
// the planner would then depend on chrome.
const NO_GROUP = -1;

// The kinds of step a plan is made of, each built in main.ts. Each kind's
// details live with its own builder.
export interface PlanSteps {
  moveTabs: StepBuilder<TabsMoveDetails>;
  moveGroup: StepBuilder<GroupMoveDetails>;
  pin: StepBuilder<PinDetails>;
}

// Works out the moves that bring every tab across in the order the windows and
// their tabs are in now, groups intact, pinned tabs still pinned.
export class TabOrderPlanner implements MergePlanner {
  constructor(private readonly steps: PlanSteps) {}

  plan(windows: BrowserWindow[]): MergeStep[] {
    const tabs = windows.map((window) => window.tabs ?? []);
    const pinned = tabs
      .flat()
      .filter((tab) => tab.pinned)
      .flatMap((tab) => (tab.id === undefined ? [] : [tab.id]));
    return [
      ...tabs.flatMap((windowTabs) => this.planWindow(windowTabs)),
      ...(pinned.length > 0 ? [this.steps.pin.build({ tabIds: pinned })] : []),
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
        steps.push(this.steps.moveTabs.build({ tabIds: loose }));
        loose = [];
      }
    };
    for (const tab of tabs) {
      if (tab.groupId === NO_GROUP) {
        if (tab.id !== undefined) loose.push(tab.id);
      } else if (!groups.has(tab.groupId)) {
        flush();
        groups.add(tab.groupId);
        steps.push(this.steps.moveGroup.build({ groupId: tab.groupId }));
      }
    }
    flush();
    return steps;
  }
}
