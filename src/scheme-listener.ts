import type { DeviceScheme } from "./device-scheme";
import { isSchemeMessage, type SchemeMessage } from "./scheme-message";

// Whoever sent a runtime message: only the id matters here.
export interface MessageSender {
  id?: string | undefined;
}

// Passes on the device colour scheme when the extension's own offscreen document reports a
// colour scheme. Anything from another sender, or of another shape, is ignored.
export class SchemeListener {
  constructor(
    private readonly device: DeviceScheme,
    private readonly ownId: string,
  ) {}

  handle(message: unknown, sender: MessageSender): void {
    if (this.fromOwnDocument(message, sender)) {
      void this.device.deviceIs(message.scheme);
    }
  }

  private fromOwnDocument(
    message: unknown,
    sender: MessageSender,
  ): message is SchemeMessage {
    return sender.id === this.ownId && isSchemeMessage(message);
  }
}
