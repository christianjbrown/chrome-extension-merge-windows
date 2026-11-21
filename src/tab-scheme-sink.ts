import type { ColourScheme } from "./colour-scheme";

// Hears the colour scheme a page in a tab showed, which is Chrome's own.
export interface TabSchemeSink {
  tabShows(scheme: ColourScheme): Promise<void>;
}
