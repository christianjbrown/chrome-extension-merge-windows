import type { ColourScheme } from "./colour-scheme";
import { isSchemeMessage } from "./scheme-message";

export interface SchemeIcon {
  show(scheme: ColourScheme): Promise<void>;
}

// Whoever sent a runtime message: only the id matters here.
export interface MessageSender {
  id?: string | undefined;
}

// Repaints the button when the extension's own offscreen document reports a
// colour scheme. Anything from another sender, or of another shape, is ignored.
export class SchemeListener {
  constructor(
    private readonly icon: SchemeIcon,
    private readonly ownId: string,
  ) {}

  handle(message: unknown, sender: MessageSender): void {
    if (sender.id !== this.ownId || !isSchemeMessage(message)) {
      return;
    }
    void this.icon.show(message.scheme);
  }
}
