import { SchemeListener } from "../src/scheme-listener";

const message = { target: "background", type: "scheme", scheme: "dark" };

describe("SchemeListener", () => {
  it("passes on the reported scheme when the extension itself sent it", () => {
    const device = { deviceIs: vi.fn().mockResolvedValue(undefined) };

    new SchemeListener(device, "ext").handle(message, { id: "ext" });

    expect(device.deviceIs).toHaveBeenCalledExactlyOnceWith("dark");
  });

  it("ignores a message from another sender", () => {
    const device = { deviceIs: vi.fn().mockResolvedValue(undefined) };

    new SchemeListener(device, "ext").handle(message, { id: "intruder" });

    expect(device.deviceIs).not.toHaveBeenCalled();
  });

  it("ignores a message of the wrong shape", () => {
    const device = { deviceIs: vi.fn().mockResolvedValue(undefined) };

    new SchemeListener(device, "ext").handle({ type: "scheme" }, { id: "ext" });

    expect(device.deviceIs).not.toHaveBeenCalled();
  });
});
