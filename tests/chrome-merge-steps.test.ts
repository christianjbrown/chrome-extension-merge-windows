import { GroupMove, Pin, TabsMove } from "../src/chrome-merge-steps";

function chrome() {
  const tabs = {
    move: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockResolvedValue({}),
  };
  const groups = { move: vi.fn().mockResolvedValue({}) };
  return { tabs, groups };
}

describe("Chrome merge steps", () => {
  it("moves tabs to the end of the window", async () => {
    const { tabs } = chrome();

    await new TabsMove(tabs, [1, 2]).run(9);

    expect(tabs.move).toHaveBeenCalledWith([1, 2], { windowId: 9, index: -1 });
  });

  it("moves a group to the end of the window", async () => {
    const { groups } = chrome();

    await new GroupMove(groups, 7).run(9);

    expect(groups.move).toHaveBeenCalledWith(7, { windowId: 9, index: -1 });
  });

  it("pins tabs one at a time, in order", async () => {
    const { tabs } = chrome();

    await new Pin(tabs, [3, 1]).run();

    expect(tabs.update.mock.calls).toEqual([
      [3, { pinned: true }],
      [1, { pinned: true }],
    ]);
  });
});
