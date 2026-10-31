import type { MergeStep, MergeSteps } from "./merge-steps";

interface MoveProperties {
  windowId: number;
  index: number;
}

export interface TabMover {
  move(tabIds: number[], properties: MoveProperties): Promise<unknown>;
  update(tabId: number, properties: { pinned: boolean }): Promise<unknown>;
}

export interface GroupMover {
  move(groupId: number, properties: MoveProperties): Promise<unknown>;
}

// Index -1 is Chrome's "at the end".
const AT_THE_END = -1;

class TabsMove implements MergeStep {
  constructor(
    private readonly tabs: TabMover,
    private readonly tabIds: number[],
  ) {}

  async run(windowId: number): Promise<void> {
    await this.tabs.move(this.tabIds, { windowId, index: AT_THE_END });
  }
}

// Moving the group rather than its tabs keeps its name, colour and collapsed
// state. Moving the tabs one by one would leave them ungrouped.
class GroupMove implements MergeStep {
  constructor(
    private readonly groups: GroupMover,
    private readonly groupId: number,
  ) {}

  async run(windowId: number): Promise<void> {
    await this.groups.move(this.groupId, { windowId, index: AT_THE_END });
  }
}

// A pinned tab arrives unpinned in its new window, so it is pinned again.
// Chrome then slots it in at the end of the pinned ones.
class Pin implements MergeStep {
  constructor(
    private readonly tabs: TabMover,
    private readonly tabIds: number[],
  ) {}

  async run(): Promise<void> {
    for (const tabId of this.tabIds) {
      await this.tabs.update(tabId, { pinned: true });
    }
  }
}

export class ChromeMergeSteps implements MergeSteps {
  constructor(
    private readonly tabs: TabMover,
    private readonly groups: GroupMover,
  ) {}

  moveTabs(tabIds: number[]): MergeStep {
    return new TabsMove(this.tabs, tabIds);
  }

  moveGroup(groupId: number): MergeStep {
    return new GroupMove(this.groups, groupId);
  }

  pin(tabIds: number[]): MergeStep {
    return new Pin(this.tabs, tabIds);
  }
}
