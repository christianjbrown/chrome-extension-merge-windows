import { TabsMove, TabsMoveBuilder } from "../src/tabs-move";

const fakeTabs = () => ({ move: vi.fn().mockResolvedValue([]) });

describe("TabsMove", () => {
  it("moves tabs to the end of the window", async () => {
    const tabs = fakeTabs();

    await new TabsMove(tabs, [1, 2]).run(9);

    expect(tabs.move).toHaveBeenCalledWith([1, 2], { windowId: 9, index: -1 });
  });

  it("is built from the tabs a plan names", async () => {
    const tabs = fakeTabs();

    await new TabsMoveBuilder(tabs).build({ tabIds: [4] }).run(9);

    expect(tabs.move).toHaveBeenCalledWith([4], { windowId: 9, index: -1 });
  });
});
