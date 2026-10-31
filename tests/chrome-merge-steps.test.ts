import { ChromeMergeSteps } from "../src/chrome-merge-steps";

function chrome() {
  const tabs = {
    move: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockResolvedValue({}),
  };
  const groups = { move: vi.fn().mockResolvedValue({}) };
  return { tabs, groups, steps: new ChromeMergeSteps(tabs, groups) };
}

describe("ChromeMergeSteps", () => {
  it("moves tabs to the end of the window", async () => {
    const { tabs, steps } = chrome();

    await steps.moveTabs([1, 2]).run(9);

    expect(tabs.move).toHaveBeenCalledWith([1, 2], { windowId: 9, index: -1 });
  });

  it("moves a group to the end of the window", async () => {
    const { groups, steps } = chrome();

    await steps.moveGroup(7).run(9);

    expect(groups.move).toHaveBeenCalledWith(7, { windowId: 9, index: -1 });
  });

  it("pins tabs one at a time, in order", async () => {
    const { tabs, steps } = chrome();

    await steps.pin([3, 1]).run(9);

    expect(tabs.update.mock.calls).toEqual([
      [3, { pinned: true }],
      [1, { pinned: true }],
    ]);
  });
});
