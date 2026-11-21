import { readSchemeState } from "../src/read-scheme-state";
import { UNKNOWN_SCHEME } from "../src/scheme-state";

describe("readSchemeState", () => {
  it("reads what was saved", () => {
    expect(
      readSchemeState({ device: "light", chrome: "dark" }, UNKNOWN_SCHEME),
    ).toEqual({
      device: "light",
      chrome: "dark",
    });
  });

  it.each([undefined, null, "dark"])(
    "starts from the fallback when %s was saved",
    (stored) => {
      expect(readSchemeState(stored, UNKNOWN_SCHEME)).toBe(UNKNOWN_SCHEME);
    },
  );

  it("ignores saved values that are not colour schemes", () => {
    expect(
      readSchemeState({ device: "sepia", chrome: 4 }, UNKNOWN_SCHEME),
    ).toEqual({
      device: "dark",
      chrome: null,
    });
  });
});
