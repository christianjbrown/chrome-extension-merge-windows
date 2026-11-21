// What chrome.tabs.move and chrome.tabGroups.move are told about where to go.
export interface MoveProperties {
  windowId: number;
  index: number;
}

// Index -1 is Chrome's "at the end".
export const AT_THE_END = -1;
