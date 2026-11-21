import type { ColourScheme } from "./colour-scheme";

// Hears each look at the colour scheme.
export interface SchemeSink {
  report(scheme: ColourScheme): void;
}
