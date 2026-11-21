import type { ColourScheme } from "./colour-scheme";
import { schemeMessage, type SchemeMessage } from "./scheme-message";

export interface MessageChannel {
  sendMessage(message: SchemeMessage): Promise<unknown>;
}

// Tells the service worker which colour scheme Chrome is in, but only when it
// is not what it last said.
export class SchemeReporter {
  private reported: ColourScheme | undefined;

  constructor(private readonly channel: MessageChannel) {}

  // Nobody waits for an answer: the service worker repaints the button. A
  // report that did not arrive is forgotten, so the next look sends it again.
  report(scheme: ColourScheme): void {
    if (scheme === this.reported) {
      return;
    }
    this.reported = scheme;
    this.channel.sendMessage(schemeMessage(scheme)).catch(() => {
      this.reported = undefined;
    });
  }
}
