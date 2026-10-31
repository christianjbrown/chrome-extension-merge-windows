// Drives the service worker's wiring through a fake chrome, end to end.
type Listener = (...args: unknown[]) => unknown;

function fakeChrome() {
  const listeners: Listener[] = [];
  return {
    action: {
      onClicked: {
        addListener: (listener: Listener) => listeners.push(listener),
        fire: (...args: unknown[]) => {
          listeners.forEach((listener) => listener(...args));
        },
      },
      setBadgeText: vi.fn().mockResolvedValue(undefined),
      setBadgeBackgroundColor: vi.fn().mockResolvedValue(undefined),
      setTitle: vi.fn().mockResolvedValue(undefined),
    },
    windows: {
      getAll: vi.fn().mockResolvedValue([
        {
          id: 1,
          type: "normal",
          incognito: false,
          tabs: [{ id: 10, groupId: -1, pinned: false }],
        },
        {
          id: 2,
          type: "normal",
          state: "minimized",
          incognito: false,
          tabs: [
            { id: 20, groupId: -1, pinned: true },
            { id: 21, groupId: 4, pinned: false },
          ],
        },
        {
          id: 3,
          type: "popup",
          incognito: false,
          tabs: [{ id: 30, groupId: -1, pinned: false }],
        },
      ]),
    },
    tabs: {
      move: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
    },
    tabGroups: { move: vi.fn().mockResolvedValue({}) },
  };
}

async function load() {
  vi.resetModules();
  const chrome = fakeChrome();
  vi.stubGlobal("chrome", chrome);
  await import("../src/main");
  return chrome;
}

describe("service worker", () => {
  it("pulls every other window, minimised and popup ones too, into the clicked one", async () => {
    const chrome = await load();

    chrome.action.onClicked.fire({ id: 10, windowId: 1 });

    await vi.waitFor(() => {
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "" });
    });
    expect(chrome.tabs.move.mock.calls).toEqual([
      [[20], { windowId: 1, index: -1 }],
      [[30], { windowId: 1, index: -1 }],
    ]);
    expect(chrome.tabGroups.move).toHaveBeenCalledWith(4, {
      windowId: 1,
      index: -1,
    });
    expect(chrome.tabs.update).toHaveBeenCalledWith(20, { pinned: true });
  });

  it("shows an error badge when Chrome refuses a move", async () => {
    const chrome = await load();
    chrome.tabs.move.mockRejectedValueOnce(new Error("Tabs cannot be edited"));

    chrome.action.onClicked.fire({ id: 10, windowId: 1 });

    await vi.waitFor(() => {
      expect(chrome.action.setTitle).toHaveBeenCalledWith({
        title: "Merge failed: Tabs cannot be edited",
      });
    });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "!" });
  });
});
