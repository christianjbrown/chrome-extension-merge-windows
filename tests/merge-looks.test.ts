import { MERGE_LOOKS } from "../src/merge-looks";

describe("merge looks", () => {
  it("is plain and grey while it waits for a click", () => {
    expect(MERGE_LOOKS.idle).toEqual({
      badge: "",
      colour: "#5a5a60",
      title: "Merge every window into this one",
    });
  });

  it.each([
    [new Error("no luck"), "no luck"],
    ["no luck", "no luck"],
  ])("is a red exclamation mark when %s", (error, message) => {
    expect(MERGE_LOOKS.failed(error)).toEqual({
      badge: "!",
      colour: "#dc2626",
      title: `Merge failed: ${message}`,
    });
  });
});
