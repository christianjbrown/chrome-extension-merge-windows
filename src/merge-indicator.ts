import type { Look } from "./looks";

// Shows a look on the button. Which look belongs to which outcome is decided
// by the caller, so a new state is a new look and not a new method here.
export interface MergeIndicator {
  show(look: Look): Promise<void>;
}
