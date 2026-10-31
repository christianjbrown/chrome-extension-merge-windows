import { TabOrderPlanner } from "../src/merge-planner";
import { RecordingSteps, names } from "./fakes";

const tab = (id: number | undefined, groupId = -1, pinned = false) => ({
  id,
  groupId,
  pinned,
});

const plan = (...windows: { tabs?: ReturnType<typeof tab>[] }[]) =>
  names(
    new TabOrderPlanner(new RecordingSteps()).plan(
      windows.map((window) => ({ incognito: false, ...window })),
    ),
  );

describe("TabOrderPlanner", () => {
  it("moves each window's ungrouped tabs across in one go, window by window", () => {
    expect(plan({ tabs: [tab(1), tab(2)] }, { tabs: [tab(3)] })).toEqual([
      "tabs 1,2",
      "tabs 3",
    ]);
  });

  it("moves a group whole, in its place among the loose tabs", () => {
    expect(
      plan({ tabs: [tab(1), tab(2, 7), tab(3, 7), tab(4), tab(5, 8)] }),
    ).toEqual(["tabs 1", "group 7", "tabs 4", "group 8"]);
  });

  it("pins the pinned tabs again once everything is across", () => {
    expect(
      plan({ tabs: [tab(1, -1, true), tab(2)] }, { tabs: [tab(3, -1, true)] }),
    ).toEqual(["tabs 1,2", "tabs 3", "pin 1,3"]);
  });

  it("skips tabs Chrome gave no id", () => {
    expect(plan({ tabs: [tab(undefined, -1, true), tab(2)] })).toEqual([
      "tabs 2",
    ]);
  });

  it("has nothing to do when there are no other windows, or they have no tabs", () => {
    expect(plan()).toEqual([]);
    expect(plan({})).toEqual([]);
  });
});
