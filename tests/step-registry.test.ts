import type { MergeStep } from "../src/merge-steps";
import { StepRegistry } from "../src/step-registry";

describe("StepRegistry", () => {
  it("makes each kind of step with the builder registered for it", () => {
    const made: MergeStep = { run: () => Promise.resolve() };
    const builders = {
      moveTabs: vi.fn(() => made),
      moveGroup: vi.fn(() => made),
      pin: vi.fn(() => made),
    };

    const step = new StepRegistry(builders).make("moveGroup", { groupId: 7 });

    expect(step).toBe(made);
    expect(builders.moveGroup).toHaveBeenCalledWith({ groupId: 7 });
    expect(builders.moveTabs).not.toHaveBeenCalled();
    expect(builders.pin).not.toHaveBeenCalled();
  });
});
