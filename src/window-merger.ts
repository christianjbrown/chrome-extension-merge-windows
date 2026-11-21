import { MERGEABLE_WINDOW_TYPES, type WindowSource } from "./browser-windows";
import type { Merger } from "./merger";
import type { MergePlanner } from "./merge-planner";
import type { MergeTargets } from "./merge-targets";

// Pulls the tabs of every window that may give them into the given one.
// Chrome closes each window once it is empty.
export class WindowMerger implements Merger {
  constructor(
    private readonly windows: WindowSource,
    private readonly targets: MergeTargets,
    private readonly planner: MergePlanner,
  ) {}

  async mergeInto(windowId: number): Promise<void> {
    const all = await this.windows.getAll({
      populate: true,
      windowTypes: [...MERGEABLE_WINDOW_TYPES],
    });
    const donors = this.targets.donorsFor(all, windowId);
    for (const step of this.planner.plan(donors)) {
      await step.run(windowId);
    }
  }
}
