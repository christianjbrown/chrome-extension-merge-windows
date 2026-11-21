import type {
  MergeStep,
  MergeSteps,
  StepBuilders,
  StepDetails,
  StepKind,
} from "./merge-steps";

// Makes each step with the builder registered for its kind.
export class StepRegistry implements MergeSteps {
  constructor(private readonly builders: StepBuilders) {}

  make<K extends StepKind>(kind: K, details: StepDetails[K]): MergeStep {
    const build: (details: StepDetails[K]) => MergeStep = this.builders[kind];
    return build(details);
  }
}
