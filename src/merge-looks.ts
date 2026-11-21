import { errorMessage } from "./error-message";

// What the toolbar button shows.
export interface Look {
  badge: string;
  colour: string;
  title: string;
}

// The looks the button takes on: waiting for a click, and a merge that failed.
export interface MergeLooks {
  idle: Look;
  failed(error: unknown): Look;
}

const RED = "#dc2626";
const GREY = "#5a5a60";

// Matches the action's default_title in the manifest, and a test pins it.
export const IDLE_TITLE = "Merge every window into this one";
const FAILED_TITLE_PREFIX = "Merge failed: ";
const NO_BADGE = "";
const ERROR_BADGE = "!";

export const MERGE_LOOKS: MergeLooks = {
  idle: { badge: NO_BADGE, colour: GREY, title: IDLE_TITLE },
  failed: (error) => ({
    badge: ERROR_BADGE,
    colour: RED,
    title: `${FAILED_TITLE_PREFIX}${errorMessage(error)}`,
  }),
};
