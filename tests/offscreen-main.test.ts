import { DARK_SCHEME_QUERY } from "../src/colour-scheme";

// Drives the offscreen document's wiring through a fake window and chrome.
describe("offscreen document", () => {
  it("tells the service worker the colour scheme, and keeps looking", async () => {
    vi.resetModules();
    const sendMessage = vi.fn().mockResolvedValue(undefined);
    const query = { matches: true };
    const matchMedia = vi.fn().mockReturnValue(query);
    const setInterval = vi.fn();
    vi.stubGlobal("chrome", { runtime: { sendMessage } });
    vi.stubGlobal("window", { matchMedia, setInterval });

    await import("../src/offscreen-main");

    expect(matchMedia).toHaveBeenCalledWith(DARK_SCHEME_QUERY);
    expect(sendMessage).toHaveBeenCalledWith({
      target: "background",
      type: "scheme",
      scheme: "dark",
    });
    const [look] = setInterval.mock.calls[0] as [() => void, number];
    query.matches = false;
    look();
    expect(sendMessage).toHaveBeenLastCalledWith({
      target: "background",
      type: "scheme",
      scheme: "light",
    });
  });
});
