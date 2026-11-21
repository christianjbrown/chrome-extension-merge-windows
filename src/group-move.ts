// Moves a tab group to the end of the window, with chrome.tabGroups. Moving the
// group rather than its tabs keeps its name, colour and collapsed state.
// Moving the tabs one by one would leave them ungrouped.
import { AT_THE_END, type MoveProperties } from "./chrome-move";
import type { MergeStep, StepBuilder } from "./merge-steps";

export interface GroupMoveDetails {
  groupId: number;
}

export interface GroupMover {
  move(groupId: number, properties: MoveProperties): Promise<unknown>;
}

export class GroupMove implements MergeStep {
  constructor(
    private readonly groups: GroupMover,
    private readonly groupId: number,
  ) {}

  async run(windowId: number): Promise<void> {
    await this.groups.move(this.groupId, { windowId, index: AT_THE_END });
  }
}

export class GroupMoveBuilder implements StepBuilder<GroupMoveDetails> {
  constructor(private readonly groups: GroupMover) {}

  build({ groupId }: GroupMoveDetails): MergeStep {
    return new GroupMove(this.groups, groupId);
  }
}
