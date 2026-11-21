import type { ColourScheme } from "./colour-scheme";

// Hears the colour scheme the device is in.
export interface DeviceScheme {
  deviceIs(scheme: ColourScheme): Promise<void>;
}
