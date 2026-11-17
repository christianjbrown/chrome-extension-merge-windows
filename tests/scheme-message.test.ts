import { isSchemeMessage } from "../src/scheme-message";

const scheme = (name: unknown) => ({
  target: "background",
  type: "scheme",
  scheme: name,
});

describe("isSchemeMessage", () => {
  it.each(["light", "dark"])("accepts the %s scheme", (name) => {
    expect(isSchemeMessage(scheme(name))).toBe(true);
  });

  it.each([
    ["an unknown scheme", scheme("sepia")],
    ["another target", { ...scheme("dark"), target: "page" }],
    ["another type", { ...scheme("dark"), type: "other" }],
    ["null", null],
    ["a string", "dark"],
  ])("rejects %s", (_name, message) => {
    expect(isSchemeMessage(message)).toBe(false);
  });
});
