import { MergeController } from "../src/merge-controller";

const idle = { badge: "", colour: "grey", title: "idle" };

const failed = {
  look: (error: unknown) => ({
    badge: "!",
    colour: "red",
    title: String(error),
  }),
};

function controller(mergeInto = vi.fn().mockResolvedValue(undefined)) {
  const indicator = { show: vi.fn().mockResolvedValue(undefined) };
  return {
    mergeInto,
    indicator,
    controller: new MergeController({ mergeInto }, indicator, idle, failed),
  };
}

describe("MergeController", () => {
  it("merges into the clicked tab's window and clears the badge", async () => {
    const { mergeInto, indicator, controller: subject } = controller();

    await subject.merge({ windowId: 5 });

    expect(mergeInto).toHaveBeenCalledWith(5);
    expect(indicator.show).toHaveBeenCalledExactlyOnceWith(idle);
  });

  it.each([new Error("nope"), "nope"])(
    "shows what went wrong: %s",
    async (failure) => {
      const { indicator, controller: subject } = controller(
        vi.fn().mockRejectedValue(failure),
      );

      await subject.merge({ windowId: 5 });

      expect(indicator.show).toHaveBeenCalledExactlyOnceWith(
        failed.look(failure),
      );
    },
  );

  it("refuses a tab with no window", async () => {
    const { mergeInto, indicator, controller: subject } = controller();

    await subject.merge({});

    expect(mergeInto).not.toHaveBeenCalled();
    expect(indicator.show).toHaveBeenCalledExactlyOnceWith(
      failed.look(new Error("This window cannot take other windows' tabs")),
    );
  });

  it("ignores a second click while the first is still merging", async () => {
    let finish: () => void = () => undefined;
    const { mergeInto, controller: subject } = controller();
    mergeInto.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );

    const first = subject.merge({ windowId: 5 });
    await subject.merge({ windowId: 5 });
    finish();
    await first;
    await subject.merge({ windowId: 5 });

    expect(mergeInto).toHaveBeenCalledTimes(2);
  });
});
