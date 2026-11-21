import { MERGEABLE_WINDOW_TYPES } from "../src/browser-windows";
import { OFFSCREEN_PAGE } from "../src/scheme-document";
import { UNKNOWN_SCHEME } from "../src/scheme-state";
import { ToolbarIcon } from "../src/toolbar-icon";
import { IDLE_TITLE } from "../src/merge-looks";
import build from "../scripts/build.mjs?raw";
import offscreenPage from "../static/offscreen.html?raw";
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

  it("starts on the idle title the toolbar indicator restores", () => {
    expect(manifest.action.default_title).toBe(IDLE_TITLE);
  });

  // The icon paths are built in code and written out here, so they must agree.
  it("names the same icons as the toolbar icon shows for the starting scheme", async () => {
    const setIcon = vi.fn().mockResolvedValue(undefined);

    await new ToolbarIcon({ setIcon }).show(UNKNOWN_SCHEME.device);

    expect(setIcon).toHaveBeenCalledWith({
      path: manifest.action.default_icon,
    });
    expect(manifest.icons).toEqual(manifest.action.default_icon);
  });

  // The names the code and the build agree on.
  it("is built from the entries the code and the static page name", () => {
    // The import below is the file the constant has to name.
    expect(OFFSCREEN_PAGE).toBe("offscreen.html");
    expect(manifest.background.service_worker).toBe("background.js");
    expect(build).toContain("background: ");
    expect(offscreenPage).toContain('src="offscreen.js"');
    expect(build).toContain("offscreen: ");
  });

  it("is the one source of the oldest Chrome the build targets", () => {
    expect(build).toContain("manifest.minimum_chrome_version");
  });

  it("asks Chrome for the window kinds it merges", () => {
    expect(MERGEABLE_WINDOW_TYPES).toEqual(["normal", "popup"]);
  });
});
