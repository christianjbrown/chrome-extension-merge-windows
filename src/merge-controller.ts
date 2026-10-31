import { errorMessage } from "./error-message";
import type { MergeIndicator } from "./merge-indicator";
import type { Merger } from "./window-merger";

export interface ClickedTab {
  windowId?: number | undefined;
}

// One click, one merge, and the button says if it went wrong.
export class MergeController {
  private busy = false;

  constructor(
    private readonly merger: Merger,
    private readonly indicator: MergeIndicator,
  ) {}

  async merge(tab: ClickedTab): Promise<void> {
    // A second click while the first is still moving tabs does nothing.
    if (this.busy) {
      return;
    }
    this.busy = true;
    try {
      if (tab.windowId === undefined) {
        throw new Error("This window cannot take other windows' tabs");
      }
      await this.merger.mergeInto(tab.windowId);
      await this.indicator.showIdle();
    } catch (error) {
      await this.indicator.showError(errorMessage(error));
    } finally {
      this.busy = false;
    }
  }
}
