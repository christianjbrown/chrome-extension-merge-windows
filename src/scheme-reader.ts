import type { ColourScheme } from "./colour-scheme";

// Reads the colour scheme a tab shows, if the tab can be asked.
export interface SchemeReader {
  read(tabId: number): Promise<ColourScheme | undefined>;
}
