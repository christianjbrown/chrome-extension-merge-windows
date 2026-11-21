import type { MergeStep, StepBuilder } from "./merge-steps";
import type { RunStrategy } from "./run-strategy";
import { tabIds } from "./tab-ids";
import { NO_GROUP, type TabRun } from "./run-splitter";
import type { TabsMoveDetails } from "./tabs-move";

// A run of ungrouped tabs goes across in one move.
export class LooseTabsPlanning implements RunStrategy {
  constructor(private readonly moveTabs: StepBuilder<TabsMoveDetails>) {}

  stepsFor(run: TabRun): MergeStep[] {
    return run.groupId === NO_GROUP ? this.moveAll(tabIds(run.tabs)) : [];
  }

  // Nothing to move when Chrome gave none of the tabs an id.
  private moveAll(ids: number[]): MergeStep[] {
    return ids.length > 0 ? [this.moveTabs.build({ tabIds: ids })] : [];
  }
}
