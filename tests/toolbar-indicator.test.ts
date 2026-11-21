import { ToolbarIndicator } from "../src/toolbar-indicator";

function action() {
  return {
    setBadgeText: vi.fn().mockResolvedValue(undefined),
    setBadgeBackgroundColor: vi.fn().mockResolvedValue(undefined),
    setTitle: vi.fn().mockResolvedValue(undefined),
  };
}

describe("ToolbarIndicator", () => {
  it("puts the look's badge, colour and title on the button", async () => {
    const toolbar = action();

    await new ToolbarIndicator(toolbar).show({
      badge: "f",
      colour: "#222",
      title: "failed",
    });

    expect(toolbar.setBadgeText).toHaveBeenCalledWith({ text: "f" });
    expect(toolbar.setBadgeBackgroundColor).toHaveBeenCalledWith({
      color: "#222",
    });
    expect(toolbar.setTitle).toHaveBeenCalledWith({ title: "failed" });
  });
});
