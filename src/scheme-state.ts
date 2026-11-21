import { DARK, type ColourScheme } from "./colour-scheme";

// What is known about the colour of Chrome's toolbar.
//
// Chrome has its own Light and Dark setting, which can differ from the
// device's. The offscreen document only ever sees the device's, and only a
// page in a tab sees Chrome's, so both are kept.
export interface SchemeState {
  // What the device is in, as the offscreen document last saw it.
  device: ColourScheme;
  // What Chrome is set to, once a tab has shown that it differs from the device.
  chrome: ColourScheme | null;
}

// Matches the icon the manifest starts with.
export const UNKNOWN_SCHEME: SchemeState = { device: DARK, chrome: null };
