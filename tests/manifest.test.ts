import manifest from "../static/manifest.json";

describe("manifest", () => {
  // Moving a group whole, rather than its tabs one at a time, is what keeps
  // its name and colour, and chrome.tabGroups needs this permission.
  it("asks for tabGroups", () => {
    expect(manifest.permissions).toContain("tabGroups");
  });

  // offscreen opens the hidden document that reads Chrome's colour scheme for
  // the toolbar icon.
  it("asks for offscreen", () => {
    expect(manifest.permissions).toContain("offscreen");
  });

  // Nothing here reads a page, a URL or a title, so nothing more is asked for.
  it("asks for nothing else", () => {
    expect(manifest.permissions).toEqual(["tabGroups", "offscreen"]);
  });

  it("starts with the icon for a dark toolbar until the scheme is known", () => {
    expect(manifest.action.default_icon["16"]).toBe(
      "icons/on-dark/icon-16.png",
    );
  });

  // Clicking the button is the only way in, on purpose.
  it("has no keyboard shortcut", () => {
    expect(manifest).not.toHaveProperty("commands");
  });
});
