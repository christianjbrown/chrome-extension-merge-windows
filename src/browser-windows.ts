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
  windowTypes: ("normal" | "popup")[];
}

export interface WindowSource {
  getAll(query: WindowQuery): Promise<BrowserWindow[]>;
}
