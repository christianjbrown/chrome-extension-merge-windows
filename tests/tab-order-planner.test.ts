import { TabOrderPlanner } from "../src/tab-order-planner";
import { names, recordingPlanning } from "./fakes";

const tab = (id: number | undefined, groupId = -1, pinned = false) => ({
  id,
  groupId,
  pinned,
});

const plan = (...windows: { tabs?: ReturnType<typeof tab>[] }[]) =>
  names(
    new TabOrderPlanner(recordingPlanning()).plan(
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

  it("leaves out a run of tabs Chrome gave no ids", () => {
    expect(
      plan({ tabs: [tab(undefined), tab(2, 7), tab(undefined), tab(3)] }),
    ).toEqual(["group 7", "tabs 3"]);
  });

  it("moves a group once, joining the loose tabs either side of a stray tab of it", () => {
    expect(
      plan({ tabs: [tab(1), tab(2, 7), tab(3), tab(4, 7), tab(5), tab(6, 8)] }),
    ).toEqual(["tabs 1", "group 7", "tabs 3,5", "group 8"]);
  });

  it("runs only the kinds of planning it is given", () => {
    expect(
      new TabOrderPlanner([]).plan([{ incognito: false, tabs: [tab(1)] }]),
    ).toEqual([]);
  });

  it("has nothing to do when there are no other windows, or they have no tabs", () => {
    expect(plan()).toEqual([]);
    expect(plan({})).toEqual([]);
  });
});
