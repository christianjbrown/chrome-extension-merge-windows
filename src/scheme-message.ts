import { isColourScheme, type ColourScheme } from "./colour-scheme";

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function isSchemeMessage(message: unknown): message is SchemeMessage {
  return (
    isRecord(message) &&
    message.target === BACKGROUND_TARGET &&
    message.type === SCHEME_MESSAGE_TYPE &&
    isColourScheme(message.scheme)
  );
}
