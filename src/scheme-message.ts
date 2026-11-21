import { isColourScheme, type ColourScheme } from "./colour-scheme";
import { isRecord } from "./is-record";

// Who a runtime message is for, and which kind it is.
export const BACKGROUND_TARGET = "background";
export const SCHEME_MESSAGE_TYPE = "scheme";

// What the offscreen document tells the service worker.
export interface SchemeMessage {
  target: typeof BACKGROUND_TARGET;
  type: typeof SCHEME_MESSAGE_TYPE;
  scheme: ColourScheme;
}

export const schemeMessage = (scheme: ColourScheme): SchemeMessage => ({
  target: BACKGROUND_TARGET,
  type: SCHEME_MESSAGE_TYPE,
  scheme,
});

export function isSchemeMessage(message: unknown): message is SchemeMessage {
  return isRecord(message) && carriesScheme(message);
}

function carriesScheme(message: Record<string, unknown>): boolean {
  return isForBackground(message) && isColourScheme(message.scheme);
}

function isForBackground(message: Record<string, unknown>): boolean {
  return (
    message.target === BACKGROUND_TARGET && message.type === SCHEME_MESSAGE_TYPE
  );
}
