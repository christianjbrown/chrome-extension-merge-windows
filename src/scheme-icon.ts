import type { ColourScheme } from "./colour-scheme";

// The toolbar icon, drawn for a colour scheme.
export interface SchemeIcon {
  show(scheme: ColourScheme): Promise<void>;
}
