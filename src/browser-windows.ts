// The kinds of window the extension asks Chrome for.
export const NORMAL_WINDOW = "normal";
const POPUP_WINDOW = "popup";
export const MERGEABLE_WINDOW_TYPES = [NORMAL_WINDOW, POPUP_WINDOW] as const;

type MergeableWindowType = (typeof MERGEABLE_WINDOW_TYPES)[number];

export interface BrowserTab {
  id?: number | undefined;
  pinned: boolean;
  groupId: number;
}

export interface BrowserWindow {
  id?: number | undefined;
  type?: string | undefined;
  incognito: boolean;
  tabs?: BrowserTab[] | undefined;
}

interface WindowQuery {
  populate: boolean;
  windowTypes: MergeableWindowType[];
}

export interface WindowSource {
  getAll(query: WindowQuery): Promise<BrowserWindow[]>;
}
