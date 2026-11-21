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

// Splits a window's tabs into the runs that move together.
export interface RunSplitter {
  runs(tabs: BrowserTab[]): TabRun[];
}
