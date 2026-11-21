import { SchemeWatcher } from "../src/scheme-watcher";

const EVERY_MS = 250;

function start(dark: boolean) {
  const query = { matches: dark };
  const sink = { report: vi.fn() };
  const ticks: (() => void)[] = [];
  const repeat = vi.fn((work: () => void) => {
    ticks.push(work);
  });
  new SchemeWatcher(query, sink, repeat, EVERY_MS).start();
  return {
    query,
    sink,
    repeat,
    tick: () => {
      ticks.forEach((work) => {
        work();
      });
    },
  };
}

describe("SchemeWatcher", () => {
  it.each([
    [true, "dark"],
    [false, "light"],
  ])("passes on a dark preference of %s as %s at once", (dark, scheme) => {
    const { sink } = start(dark);

    expect(sink.report).toHaveBeenCalledExactlyOnceWith(scheme);
  });

  it("looks again as often as it is told", () => {
    const { repeat } = start(true);

    expect(repeat).toHaveBeenCalledExactlyOnceWith(
      expect.any(Function),
      EVERY_MS,
    );
  });

  it("passes on what it sees each time it looks", () => {
    const { query, sink, tick } = start(false);

    query.matches = true;
    tick();

    expect(sink.report).toHaveBeenLastCalledWith("dark");
  });
});
