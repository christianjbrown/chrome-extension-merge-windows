import { COLOUR_SCHEMES, type ColourScheme } from "./colour-scheme";

// What the offscreen document tells the service worker.
export interface SchemeMessage {
  target: "background";
  type: "scheme";
  scheme: ColourScheme;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function isSchemeMessage(message: unknown): message is SchemeMessage {
  return (
    isRecord(message) &&
    message.target === "background" &&
    message.type === "scheme" &&
    (COLOUR_SCHEMES as readonly unknown[]).includes(message.scheme)
  );
}
