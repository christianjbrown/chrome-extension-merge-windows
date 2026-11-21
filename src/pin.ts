// A pinned tab arrives unpinned in its new window, so it is pinned again.
// Chrome then slots it in at the end of the pinned ones.
import type { MergeStep, StepBuilder } from "./merge-steps";

export interface PinDetails {
  tabIds: number[];
}

export interface TabPinner {
  update(tabId: number, properties: { pinned: boolean }): Promise<unknown>;
}

export class Pin implements MergeStep {
  constructor(
    private readonly tabs: TabPinner,
    private readonly tabIds: number[],
  ) {}

  async run(): Promise<void> {
    for (const tabId of this.tabIds) {
      await this.tabs.update(tabId, { pinned: true });
    }
  }
}

export class PinBuilder implements StepBuilder<PinDetails> {
  constructor(private readonly tabs: TabPinner) {}

  build({ tabIds }: PinDetails): MergeStep {
    return new Pin(this.tabs, tabIds);
  }
}
