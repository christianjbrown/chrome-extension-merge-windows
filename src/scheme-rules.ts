import type { ColourScheme } from "./colour-scheme";
import type { SchemePolicy } from "./scheme-policy";
import type { SchemeState } from "./scheme-state";

export const toolbarScheme = (state: SchemeState): ColourScheme =>
  state.chrome ?? state.device;

export const afterDevice = (
  state: SchemeState,
  device: ColourScheme,
): SchemeState => ({ ...state, device });

// A tab that disagrees with the device means Chrome has its own setting, and
// that is remembered. A tab that agrees with the device only clears a setting
// it contradicts: one it matches may still be there, and would be lost the next
// time the device changes.
export function afterTab(state: SchemeState, tab: ColourScheme): SchemeState {
  if (tab !== state.device) {
    return { ...state, chrome: tab };
  }
  return { ...state, chrome: state.chrome === tab ? tab : null };
}

// Chrome's own setting, once a tab has shown it, wins over the device's.
export const SCHEME_POLICY: SchemePolicy = {
  afterDevice,
  afterTab,
  toolbarScheme,
};
