import type { BrowserTab } from "./browser-windows";

// The ids of the tabs, skipping any Chrome gave none.
export function tabIds(tabs: BrowserTab[]): number[] {
  return tabs.flatMap((tab) => (tab.id === undefined ? [] : [tab.id]));
}
