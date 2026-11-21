import { SchemeReporter } from "../src/scheme-reporter";

const report = (scheme: string) => ({
  target: "background",
  type: "scheme",
  scheme,
});

describe("SchemeReporter", () => {
  it("reports a scheme it has not reported yet", () => {
    const sendMessage = vi.fn().mockResolvedValue(1);

    new SchemeReporter({ sendMessage }).report("dark");

    expect(sendMessage).toHaveBeenCalledExactlyOnceWith(report("dark"));
  });

  it("says nothing while the scheme stays the same", () => {
    const sendMessage = vi.fn().mockResolvedValue(1);
    const reporter = new SchemeReporter({ sendMessage });

    reporter.report("dark");
    reporter.report("dark");

    expect(sendMessage).toHaveBeenCalledTimes(1);
  });

  it("reports again when the scheme changes", () => {
    const sendMessage = vi.fn().mockResolvedValue(1);
    const reporter = new SchemeReporter({ sendMessage });

    reporter.report("light");
    reporter.report("dark");

    expect(sendMessage).toHaveBeenLastCalledWith(report("dark"));
  });

  it("sends a report again when the last one did not arrive", async () => {
    const sendMessage = vi
      .fn()
      .mockRejectedValueOnce(new Error("No receiver"))
      .mockResolvedValue(undefined);
    const reporter = new SchemeReporter({ sendMessage });

    await vi.waitFor(() => {
      reporter.report("dark");
      expect(sendMessage).toHaveBeenCalledTimes(2);
    });
    expect(sendMessage).toHaveBeenLastCalledWith(report("dark"));
  });
});
