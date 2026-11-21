import type { GroupMoveDetails } from "./group-move";
import type { MergeStep, StepBuilder } from "./merge-steps";
import type { RunStrategy } from "./run-strategy";
import { NO_GROUP, type TabRun } from "./tab-runs";

// A group goes across whole, which keeps it a group.
export class GroupPlanning implements RunStrategy {
  constructor(private readonly moveGroup: StepBuilder<GroupMoveDetails>) {}

  stepsFor(run: TabRun): MergeStep[] {
    return run.groupId === NO_GROUP
      ? []
      : [this.moveGroup.build({ groupId: run.groupId })];
  }
}
