import type { BrowserWindow } from "../src/browser-windows";
import type { MergeStep } from "../src/merge-steps";
import { WindowMerger } from "../src/window-merger";

function merger(windows: BrowserWindow[]) {
  const ran: string[] = [];
  const step = (name: string): MergeStep => ({
    run: (windowId) => {
      ran.push(`${name} into ${String(windowId)}`);
      return Promise.resolve();
    },
  });
  const source = { getAll: vi.fn().mockResolvedValue(windows) };
  const planner = {
    plan: vi.fn((donors: BrowserWindow[]) =>
      donors.map((donor) => step(`window ${String(donor.id)}`)),
    ),
  };
  return { ran, source, planner, merger: new WindowMerger(source, planner) };
}

const normal = (id: number, incognito = false) => ({
  id,
  type: "normal",
  incognito,
});

describe("WindowMerger", () => {
  it("asks for every normal and popup window with its tabs", async () => {
    const { source, merger: subject } = merger([normal(1)]);

    await subject.mergeInto(1);

    expect(source.getAll).toHaveBeenCalledWith({
      populate: true,
      windowTypes: ["normal", "popup"],
    });
  });

  it("runs the plan for every other window, in order, into the clicked one", async () => {
    const { ran, merger: subject } = merger([
      normal(2),
      normal(1),
      { id: 3, type: "popup", incognito: false },
    ]);

    await subject.mergeInto(1);

    expect(ran).toEqual(["window 2 into 1", "window 3 into 1"]);
  });

  it("keeps incognito windows and ordinary ones apart", async () => {
    const { ran, merger: subject } = merger([
      normal(1, true),
      normal(2),
      normal(3, true),
    ]);

    await subject.mergeInto(1);

    expect(ran).toEqual(["window 3 into 1"]);
  });

  it.each([[[{ id: 1, type: "popup", incognito: false }]], [[normal(2)]]])(
    "refuses to merge into a popup or a window it cannot find",
    async (all) => {
      const { planner, merger: subject } = merger(all);

      await expect(subject.mergeInto(1)).rejects.toThrow(
        "Merge from an ordinary window, not a popup",
      );
      expect(planner.plan).not.toHaveBeenCalled();
    },
  );
});
