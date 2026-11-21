// Brings the tabs of other windows into the given one.
export interface Merger {
  mergeInto(windowId: number): Promise<void>;
}
