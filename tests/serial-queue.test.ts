import { SerialQueue } from "../src/serial-queue";

describe("SerialQueue", () => {
  it("runs work one piece at a time, in the order it was asked for", async () => {
    const queue = new SerialQueue();
    const order: string[] = [];
    let release: () => void = () => undefined;
    const first = queue.run(
      () =>
        new Promise<void>((resolve) => {
          order.push("first starts");
          release = resolve;
        }),
    );
    const second = queue.run(() => {
      order.push("second starts");
      return Promise.resolve("second");
    });
    await Promise.resolve();
    expect(order).toEqual(["first starts"]);

    release();
    await first;

    await expect(second).resolves.toBe("second");
    expect(order).toEqual(["first starts", "second starts"]);
  });

  it("rejects for the work that failed and carries on with the next", async () => {
    const queue = new SerialQueue();

    await expect(
      queue.run(() => Promise.reject(new Error("no"))),
    ).rejects.toThrow("no");
    await expect(queue.run(() => Promise.resolve(2))).resolves.toBe(2);
  });
});
