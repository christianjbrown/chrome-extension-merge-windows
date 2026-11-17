import { SchemeListener } from "../src/scheme-listener";

const message = { target: "background", type: "scheme", scheme: "dark" };

describe("SchemeListener", () => {
  it("shows the reported scheme when the extension itself sent it", () => {
    const icon = { show: vi.fn().mockResolvedValue(undefined) };

    new SchemeListener(icon, "ext").handle(message, { id: "ext" });

    expect(icon.show).toHaveBeenCalledExactlyOnceWith("dark");
  });

  it("ignores a message from another sender", () => {
    const icon = { show: vi.fn().mockResolvedValue(undefined) };

    new SchemeListener(icon, "ext").handle(message, { id: "intruder" });

    expect(icon.show).not.toHaveBeenCalled();
  });

  it("ignores a message of the wrong shape", () => {
    const icon = { show: vi.fn().mockResolvedValue(undefined) };

    new SchemeListener(icon, "ext").handle({ type: "scheme" }, { id: "ext" });

    expect(icon.show).not.toHaveBeenCalled();
  });
});
