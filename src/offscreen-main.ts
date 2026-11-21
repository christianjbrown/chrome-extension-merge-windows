// The offscreen document: watches Chrome's colour scheme for the service worker.
import { DARK_SCHEME_QUERY } from "./colour-scheme";
import { OFFSCREEN_CONFIG } from "./offscreen-config";
import { SchemeReporter } from "./scheme-reporter";
import { SchemeWatcher } from "./scheme-watcher";

new SchemeWatcher(
  window.matchMedia(DARK_SCHEME_QUERY),
  new SchemeReporter(chrome.runtime),
  (work, everyMs) => {
    window.setInterval(work, everyMs);
  },
  OFFSCREEN_CONFIG.schemeCheckMs,
).start();
