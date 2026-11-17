import manifest from "../static/manifest.json";

describe("manifest", () => {
  // Moving a group whole, rather than its tabs one at a time, is what keeps
  // its name and colour, and chrome.tabGroups needs this permission.
  it("asks for tabGroups", () => {
    expect(manifest.permissions).toContain("tabGroups");
  });

  // offscreen opens the hidden document that reads the device's colour scheme
  // for the toolbar icon. activeTab and scripting read the colour scheme Chrome
  // itself is in from the tab the button is clicked in, and nothing else there.
  // storage remembers that scheme.
  it("asks for offscreen, activeTab, scripting and storage", () => {
    expect(manifest.permissions).toEqual(
      expect.arrayContaining([
        "offscreen",
        "activeTab",
        "scripting",
        "storage",
      ]),
    );
  });

  // Nothing here reads a URL or a title, so no host permissions and nothing more.
  it("asks for nothing else", () => {
    expect(manifest.permissions).toEqual([
      "tabGroups",
      "offscreen",
      "activeTab",
      "scripting",
      "storage",
    ]);
    expect(manifest).not.toHaveProperty("host_permissions");
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
