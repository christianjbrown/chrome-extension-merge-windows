import { isColourScheme } from "./colour-scheme";
import { isRecord } from "./is-record";
import type { ColourScheme } from "./colour-scheme";
import type { SchemeState } from "./scheme-state";

// Reads a saved state back, taking anything that is not a colour scheme for
// unknown rather than trusting it.
export function readSchemeState(
  stored: unknown,
  unknown: SchemeState,
): SchemeState {
  return isRecord(stored) ? readFields(stored, unknown) : unknown;
}

function readFields(
  { device, chrome }: Record<string, unknown>,
  unknown: SchemeState,
): SchemeState {
  return {
    device: schemeOr(device, unknown.device),
    chrome: schemeOr(chrome, null),
  };
}

function schemeOr<Fallback>(
  value: unknown,
  fallback: Fallback,
): ColourScheme | Fallback {
  return isColourScheme(value) ? value : fallback;
}
