import { Pin, PinBuilder } from "../src/pin";

const fakeTabs = () => ({ update: vi.fn().mockResolvedValue({}) });

describe("Pin", () => {
  it("pins tabs one at a time, in order", async () => {
    const tabs = fakeTabs();

    await new Pin(tabs, [3, 1]).run();

    expect(tabs.update.mock.calls).toEqual([
      [3, { pinned: true }],
      [1, { pinned: true }],
    ]);
  });

  it("is built from the tabs a plan names", async () => {
    const tabs = fakeTabs();

    await new PinBuilder(tabs).build({ tabIds: [5] }).run(9);

    expect(tabs.update).toHaveBeenCalledWith(5, { pinned: true });
  });
});
