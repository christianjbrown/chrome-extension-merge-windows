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
  // Every window but the target gives its tabs.
  const targets = {
    donorsFor: vi.fn((all: BrowserWindow[], targetId: number) =>
      all.filter((window) => window.id !== targetId),
    ),
  };
  const planner = {
    plan: vi.fn((donors: BrowserWindow[]) =>
      donors.map((donor) => step(`window ${String(donor.id)}`)),
    ),
  };
  return {
    ran,
    source,
    targets,
    planner,
    merger: new WindowMerger(source, targets, planner),
  };
}

const window = (id: number) => ({ id, type: "normal", incognito: false });

describe("WindowMerger", () => {
  it("asks for every normal and popup window with its tabs", async () => {
    const { source, merger: subject } = merger([window(1)]);

    await subject.mergeInto(1);

    expect(source.getAll).toHaveBeenCalledWith({
      populate: true,
      windowTypes: ["normal", "popup"],
    });
  });

  it("runs the plan for the donors, in order, into the clicked one", async () => {
    const all = [window(2), window(1), window(3)];
    const { ran, targets, merger: subject } = merger(all);

    await subject.mergeInto(1);

    expect(targets.donorsFor).toHaveBeenCalledWith(all, 1);
    expect(ran).toEqual(["window 2 into 1", "window 3 into 1"]);
  });

  it("plans nothing when the window cannot take tabs", async () => {
    const { targets, planner, merger: subject } = merger([window(1)]);
    targets.donorsFor.mockImplementation(() => {
      throw new Error("No");
    });

    await expect(subject.mergeInto(1)).rejects.toThrow("No");
    expect(planner.plan).not.toHaveBeenCalled();
  });
});
