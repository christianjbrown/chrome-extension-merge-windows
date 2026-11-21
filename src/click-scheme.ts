import type { SchemeReader } from "./scheme-reader";
import type { TabSchemeSink } from "./tab-scheme-sink";

// A click on the button lets the extension into that tab, which is the one
// chance to see the colour scheme Chrome itself is in.
export class ClickScheme {
  constructor(
    private readonly reader: SchemeReader,
    private readonly sink: TabSchemeSink,
  ) {}

  async clicked(tab: { id?: number | undefined }): Promise<void> {
    if (tab.id === undefined) {
      return;
    }
    await this.readFrom(tab.id);
  }

  // Some tabs cannot be read, and then there is nothing to pass on.
  private async readFrom(tabId: number): Promise<void> {
    const scheme = await this.reader.read(tabId);
    if (scheme !== undefined) {
      await this.sink.tabShows(scheme);
    }
  }
}
