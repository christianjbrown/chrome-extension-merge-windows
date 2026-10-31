import { ToolbarIndicator } from "../src/toolbar-indicator";

function action() {
  return {
    setBadgeText: vi.fn().mockResolvedValue(undefined),
    setBadgeBackgroundColor: vi.fn().mockResolvedValue(undefined),
    setTitle: vi.fn().mockResolvedValue(undefined),
  };
}

describe("ToolbarIndicator", () => {
  it.each([
    {
      show: (indicator: ToolbarIndicator) => indicator.showIdle(),
      text: "",
      color: "#5a5a60",
      title: "Merge every window into this one",
    },
    {
      show: (indicator: ToolbarIndicator) => indicator.showError("no luck"),
      text: "!",
      color: "#dc2626",
      title: "Merge failed: no luck",
    },
  ])("shows $title", async ({ show, text, color, title }) => {
    const toolbar = action();

    await show(new ToolbarIndicator(toolbar));

    expect(toolbar.setBadgeText).toHaveBeenCalledWith({ text });
    expect(toolbar.setBadgeBackgroundColor).toHaveBeenCalledWith({ color });
    expect(toolbar.setTitle).toHaveBeenCalledWith({ title });
  });
});
