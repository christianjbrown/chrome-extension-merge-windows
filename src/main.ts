// The service worker: builds the object graph and connects it to Chrome's events.
import { ChromeMergeSteps } from "./chrome-merge-steps";
import { MergeController } from "./merge-controller";
import { TabOrderPlanner } from "./merge-planner";
import { ToolbarIndicator } from "./toolbar-indicator";
import { WindowMerger } from "./window-merger";

const controller = new MergeController(
  new WindowMerger(
    chrome.windows,
    new TabOrderPlanner(new ChromeMergeSteps(chrome.tabs, chrome.tabGroups)),
  ),
  new ToolbarIndicator(chrome.action),
);

chrome.action.onClicked.addListener((tab) => {
  void controller.merge(tab);
});
