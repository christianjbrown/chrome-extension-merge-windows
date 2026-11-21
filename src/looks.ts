// What the toolbar button shows.
export interface Look {
  badge: string;
  colour: string;
  title: string;
}

// The looks the button takes on: waiting for a click, and a merge that failed.
export interface MergeLooks {
  idle: Look;
  failed(error: unknown): Look;
}
