import type { SchemeState } from "./scheme-state";

// Somewhere the scheme state outlives the service worker.
export interface SchemeMemory {
  load(): Promise<SchemeState>;
  save(state: SchemeState): Promise<void>;
}
