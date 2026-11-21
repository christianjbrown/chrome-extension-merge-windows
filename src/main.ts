// The service worker: builds the object graph and connects it to Chrome's events.
import { ClickScheme } from "./click-scheme";
import { GroupMove, Pin, TabsMove } from "./chrome-merge-steps";
import { MergeController } from "./merge-controller";
import { MERGE_LOOKS } from "./merge-looks";
import { TabOrderPlanner } from "./merge-planner";
import { OFFSCREEN_PAGE, SchemeDocument } from "./scheme-document";
import { SchemeListener } from "./scheme-listener";
import { SCHEME_POLICY, UNKNOWN_SCHEME } from "./scheme-state";
import { SchemeStore } from "./scheme-store";
import { StepRegistry } from "./step-registry";
import { TabScheme } from "./tab-scheme";
import { ToolbarIcon } from "./toolbar-icon";
import { ToolbarIndicator } from "./toolbar-indicator";
import { ToolbarScheme } from "./toolbar-scheme";
import { WindowMerger } from "./window-merger";

const controller = new MergeController(
  new WindowMerger(
    chrome.windows,
    new TabOrderPlanner(
      new StepRegistry({
        moveTabs: ({ tabIds }) => new TabsMove(chrome.tabs, tabIds),
        moveGroup: ({ groupId }) => new GroupMove(chrome.tabGroups, groupId),
        pin: ({ tabIds }) => new Pin(chrome.tabs, tabIds),
      }),
    ),
  ),
  new ToolbarIndicator(chrome.action, MERGE_LOOKS),
);
const toolbarScheme = new ToolbarScheme(
  new SchemeStore(chrome.storage.local, UNKNOWN_SCHEME),
  new ToolbarIcon(chrome.action),
  SCHEME_POLICY,
);
const clickScheme = new ClickScheme(
  new TabScheme(chrome.scripting),
  toolbarScheme,
);
const schemeDocument = new SchemeDocument(
  chrome.offscreen,
  chrome.runtime,
  OFFSCREEN_PAGE,
);
const schemeListener = new SchemeListener(toolbarScheme, chrome.runtime.id);

chrome.action.onClicked.addListener((tab) => {
  // Independent on purpose: merging moves tabs between windows, and the scheme
  // read must neither wait for that nor be able to break it.
  void controller.merge(tab);
  void clickScheme.clicked(tab);
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
