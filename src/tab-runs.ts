import type { BrowserTab } from "./browser-windows";

// chrome.tabGroups.TAB_GROUP_ID_NONE, which a service worker could read, but
// planning would then depend on chrome.
export const NO_GROUP = -1;

// Tabs next to each other in one window that share a group, or share having
// none.
export interface TabRun {
  groupId: number;
  tabs: BrowserTab[];
}

// Splits a window's tabs into runs. A group appears once, where its first tab
// is, and the ungrouped tabs either side of a repeat join up.
export function tabRuns(tabs: BrowserTab[]): TabRun[] {
  return joinNeighbours(joinNeighbours(tabs.map(runOf)).filter(firstOfGroup));
}

const runOf = (tab: BrowserTab): TabRun => ({
  groupId: tab.groupId,
  tabs: [tab],
});

function joinNeighbours(runs: TabRun[]): TabRun[] {
  return runs.reduce<TabRun[]>(append, []);
}

// Adds a run after the others, folding it into the last one if they share a
// group.
function append(runs: TabRun[], run: TabRun): TabRun[] {
  const last = runs.at(-1);
  return sameGroup(last, run)
    ? [
        ...runs.slice(0, -1),
        { groupId: run.groupId, tabs: [...last.tabs, ...run.tabs] },
      ]
    : [...runs, run];
}

function sameGroup(last: TabRun | undefined, run: TabRun): last is TabRun {
  return last?.groupId === run.groupId;
}

function firstOfGroup(run: TabRun, index: number, runs: TabRun[]): boolean {
  return (
    run.groupId === NO_GROUP ||
    runs.findIndex((other) => other.groupId === run.groupId) === index
  );
}
