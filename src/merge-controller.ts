import type { MergeIndicator } from "./merge-indicator";
import type { Merger } from "./merger";

export interface ClickedTab {
  windowId?: number | undefined;
}

const NO_WINDOW_MESSAGE = "This window cannot take other windows' tabs";

// The window the tab was clicked in, which Chrome leaves out for some tabs.
function windowOf(tab: ClickedTab): number {
  if (tab.windowId === undefined) {
    throw new Error(NO_WINDOW_MESSAGE);
  }
  return tab.windowId;
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
    await this.mergeOnce(tab);
  }

  private async mergeOnce(tab: ClickedTab): Promise<void> {
    this.busy = true;
    try {
      await this.merger.mergeInto(windowOf(tab));
      await this.indicator.showIdle();
    } catch (error) {
      await this.indicator.showError(error);
    } finally {
      this.busy = false;
    }
  }
}
