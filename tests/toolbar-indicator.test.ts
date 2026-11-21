import { MERGE_LOOKS } from "../src/merge-looks";
import { ToolbarIndicator } from "../src/toolbar-indicator";

function action() {
  return {
    setBadgeText: vi.fn().mockResolvedValue(undefined),
    setBadgeBackgroundColor: vi.fn().mockResolvedValue(undefined),
    setTitle: vi.fn().mockResolvedValue(undefined),
  };
}

const looks = {
  idle: { badge: "i", colour: "#111", title: "idle" },
  failed: (error: unknown) => ({
    badge: "f",
    colour: "#222",
    title: `failed ${String(error)}`,
  }),
};

describe("ToolbarIndicator", () => {
  it.each([
    {
      show: (indicator: ToolbarIndicator) => indicator.showIdle(),
      text: "i",
      color: "#111",
      title: "idle",
    },
    {
      show: (indicator: ToolbarIndicator) => indicator.showError("no luck"),
      text: "f",
      color: "#222",
      title: "failed no luck",
    },
  ])("shows $title", async ({ show, text, color, title }) => {
    const toolbar = action();

    await show(new ToolbarIndicator(toolbar, looks));

    expect(toolbar.setBadgeText).toHaveBeenCalledWith({ text });
    expect(toolbar.setBadgeBackgroundColor).toHaveBeenCalledWith({ color });
    expect(toolbar.setTitle).toHaveBeenCalledWith({ title });
  });

  it("can take the extension's own looks", async () => {
    const toolbar = action();

    await new ToolbarIndicator(toolbar, MERGE_LOOKS).showIdle();

    expect(toolbar.setBadgeText).toHaveBeenCalledWith({ text: "" });
  });
});
