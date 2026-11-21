// What the toolbar button shows.
export interface Look {
  badge: string;
  colour: string;
  title: string;
}

// How the button looks once a merge has failed, which depends on what went
// wrong.
export interface FailureLook {
  look(error: unknown): Look;
}
