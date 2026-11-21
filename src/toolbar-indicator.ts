import type { MergeIndicator } from "./merge-indicator";

export interface ToolbarAction {
  setBadgeText(details: { text: string }): Promise<void>;
  setBadgeBackgroundColor(details: { color: string }): Promise<void>;
  setTitle(details: { title: string }): Promise<void>;
}

interface Look {
  badge: string;
  colour: string;
  title: string;
}

const RED = "#dc2626";
const GREY = "#5a5a60";

// Matches the action's default_title in the manifest, and a test pins it.
export const IDLE_TITLE = "Merge every window into this one";
const FAILED_TITLE_PREFIX = "Merge failed: ";
const NO_BADGE = "";
const ERROR_BADGE = "!";

export class ToolbarIndicator implements MergeIndicator {
  constructor(private readonly action: ToolbarAction) {}

  showIdle(): Promise<void> {
    return this.show({
      badge: NO_BADGE,
      colour: GREY,
      title: IDLE_TITLE,
    });
  }

  showError(message: string): Promise<void> {
    return this.show({
      badge: ERROR_BADGE,
      colour: RED,
      title: `${FAILED_TITLE_PREFIX}${message}`,
    });
  }

  private async show(look: Look): Promise<void> {
    await Promise.all([
      this.action.setBadgeText({ text: look.badge }),
      this.action.setBadgeBackgroundColor({ color: look.colour }),
      this.action.setTitle({ title: look.title }),
    ]);
  }
}
