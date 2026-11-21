import type { Look } from "./looks";
import type { MergeIndicator } from "./merge-indicator";

export interface ToolbarAction {
  setBadgeText(details: { text: string }): Promise<void>;
  setBadgeBackgroundColor(details: { color: string }): Promise<void>;
  setTitle(details: { title: string }): Promise<void>;
}

export class ToolbarIndicator implements MergeIndicator {
  constructor(private readonly action: ToolbarAction) {}

  async show(look: Look): Promise<void> {
    await Promise.all([
      this.action.setBadgeText({ text: look.badge }),
      this.action.setBadgeBackgroundColor({ color: look.colour }),
      this.action.setTitle({ title: look.title }),
    ]);
  }
}
