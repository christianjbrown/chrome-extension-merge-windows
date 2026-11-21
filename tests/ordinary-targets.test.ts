import { OrdinaryTargets } from "../src/ordinary-targets";

const normal = (id: number, incognito = false) => ({
  id,
  type: "normal",
  incognito,
});

const donors = (windows: ReturnType<typeof normal>[], targetId: number) =>
  new OrdinaryTargets().donorsFor(windows, targetId).map((window) => window.id);

describe("OrdinaryTargets", () => {
  it("takes every other window, popups included, in order", () => {
    expect(
      donors([normal(2), normal(1), { ...normal(3), type: "popup" }], 1),
    ).toEqual([2, 3]);
  });

  it("keeps incognito windows and ordinary ones apart", () => {
    expect(donors([normal(1, true), normal(2), normal(3, true)], 1)).toEqual([
      3,
    ]);
  });

  it.each([[[{ ...normal(1), type: "popup" }]], [[normal(2)]]])(
    "refuses to merge into a popup or a window it cannot find",
    (all) => {
      expect(() => donors(all, 1)).toThrow(
        "Merge from an ordinary window, not a popup",
      );
    },
  );
});
