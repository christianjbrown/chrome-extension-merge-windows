// Moves a run of ungrouped tabs to the end of the window, with chrome.tabs.
import { AT_THE_END, type MoveProperties } from "./chrome-move";
import type { MergeStep, StepBuilder } from "./merge-steps";

export interface TabsMoveDetails {
  tabIds: number[];
}

export interface TabMover {
  move(tabIds: number[], properties: MoveProperties): Promise<unknown>;
}

export class TabsMove implements MergeStep {
  constructor(
    private readonly tabs: TabMover,
    private readonly tabIds: number[],
  ) {}

  async run(windowId: number): Promise<void> {
    await this.tabs.move(this.tabIds, { windowId, index: AT_THE_END });
  }
}

export class TabsMoveBuilder implements StepBuilder<TabsMoveDetails> {
  constructor(private readonly tabs: TabMover) {}

  build({ tabIds }: TabsMoveDetails): MergeStep {
    return new TabsMove(this.tabs, tabIds);
  }
}
