import manifest from "../static/manifest.json";

describe("manifest", () => {
  // Moving a group whole, rather than its tabs one at a time, is what keeps
  // its name and colour, and chrome.tabGroups needs this permission.
  it("asks for tabGroups", () => {
    expect(manifest.permissions).toContain("tabGroups");
  });

  // Nothing here reads a page, a URL or a title, so nothing more is asked for.
  it("asks for nothing else", () => {
    expect(manifest.permissions).toEqual(["tabGroups"]);
  });
});
