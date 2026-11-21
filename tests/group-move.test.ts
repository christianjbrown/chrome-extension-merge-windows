import { GroupMove, GroupMoveBuilder } from "../src/group-move";

const fakeGroups = () => ({ move: vi.fn().mockResolvedValue({}) });

describe("GroupMove", () => {
  it("moves a group to the end of the window", async () => {
    const groups = fakeGroups();

    await new GroupMove(groups, 7).run(9);

    expect(groups.move).toHaveBeenCalledWith(7, { windowId: 9, index: -1 });
  });

  it("is built from the group a plan names", async () => {
    const groups = fakeGroups();

    await new GroupMoveBuilder(groups).build({ groupId: 3 }).run(9);

    expect(groups.move).toHaveBeenCalledWith(3, { windowId: 9, index: -1 });
  });
});
