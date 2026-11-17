// The service worker: builds the object graph and connects it to Chrome's events.
import { ChromeMergeSteps } from "./chrome-merge-steps";
import { MergeController } from "./merge-controller";
import { TabOrderPlanner } from "./merge-planner";
import { SchemeDocument } from "./scheme-document";
import { SchemeListener } from "./scheme-listener";
import { ToolbarIcon } from "./toolbar-icon";
import { ToolbarIndicator } from "./toolbar-indicator";
import { WindowMerger } from "./window-merger";

const controller = new MergeController(
  new WindowMerger(
    chrome.windows,
    new TabOrderPlanner(new ChromeMergeSteps(chrome.tabs, chrome.tabGroups)),
  ),
  new ToolbarIndicator(chrome.action),
);
const schemeDocument = new SchemeDocument(
  chrome.offscreen,
  chrome.runtime,
  "offscreen.html",
);
const schemeListener = new SchemeListener(
  new ToolbarIcon(chrome.action),
  chrome.runtime.id,
);

chrome.action.onClicked.addListener((tab) => {
  void controller.merge(tab);
});
chrome.runtime.onMessage.addListener((message, sender) => {
  schemeListener.handle(message, sender);
});
// Chrome starts with no offscreen document, and nothing else wakes the service
// worker then.
chrome.runtime.onStartup.addListener(() => {
  void schemeDocument.open();
});
void schemeDocument.open();
