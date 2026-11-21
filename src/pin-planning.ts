import type { BrowserTab } from "./browser-windows";
import type { MergeStep, StepBuilder } from "./merge-steps";
import type { PinDetails } from "./pin";
import type { PlanStrategy } from "./plan-strategy";
import { tabIds } from "./tab-ids";

// Pins the pinned tabs again, in one step, when there are any.
export class PinPlanning implements PlanStrategy {
  constructor(private readonly pin: StepBuilder<PinDetails>) {}

  plan(windows: BrowserTab[][]): MergeStep[] {
    const pinned = tabIds(windows.flat().filter(isPinned));
    return pinned.length > 0 ? [this.pin.build({ tabIds: pinned })] : [];
  }
}

const isPinned = (tab: BrowserTab): boolean => tab.pinned;
