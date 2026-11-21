import { isColourScheme } from "./colour-scheme";
import { isRecord } from "./is-record";
import type { SchemeState } from "./scheme-state";

// Reads a saved state back, taking anything that is not a colour scheme for
// unknown rather than trusting it.
export function readSchemeState(
  stored: unknown,
  unknown: SchemeState,
): SchemeState {
  if (!isRecord(stored)) {
    return unknown;
  }
  const { device, chrome } = stored;
  return {
    device: isColourScheme(device) ? device : unknown.device,
    chrome: isColourScheme(chrome) ? chrome : null,
  };
}
