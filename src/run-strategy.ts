import type { MergeStep } from "./merge-steps";
import type { TabRun } from "./tab-runs";

// One kind of step for a run of tabs. It returns the steps it wants, or none
// when the run is not its kind.
export interface RunStrategy {
  stepsFor(run: TabRun): MergeStep[];
}
