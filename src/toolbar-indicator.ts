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

export class ToolbarIndicator implements MergeIndicator {
  constructor(private readonly action: ToolbarAction) {}

  showIdle(): Promise<void> {
    return this.show({
      badge: "",
      colour: GREY,
      title: "Merge every window into this one",
    });
  }

  showError(message: string): Promise<void> {
    return this.show({
      badge: "!",
      colour: RED,
      title: `Merge failed: ${message}`,
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
