import type { ColourScheme } from "./colour-scheme";
import type { SchemeState } from "./scheme-state";

// How each report moves the state on, and which scheme the toolbar is in.
export interface SchemePolicy {
  afterDevice(state: SchemeState, device: ColourScheme): SchemeState;
  afterTab(state: SchemeState, tab: ColourScheme): SchemeState;
  toolbarScheme(state: SchemeState): ColourScheme;
}
