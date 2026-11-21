import { schemeFor, type ColourScheme } from "./colour-scheme";

// The part of a MediaQueryList this needs.
export interface SchemeQuery {
  readonly matches: boolean;
}

export interface SchemeSink {
  report(scheme: ColourScheme): void;
}

// Runs the work again and again, the way setInterval does.
export type Repeat = (work: () => void, everyMs: number) => void;

// Looks at the colour scheme now and then, and passes it on. A service worker
// has no matchMedia, so a document has to look.
//
// It looks on a timer because an offscreen document never paints, and Chrome
// only delivers a media query's change event when a frame is painted.
export class SchemeWatcher {
  constructor(
    private readonly dark: SchemeQuery,
    private readonly sink: SchemeSink,
    private readonly repeat: Repeat,
    private readonly everyMs: number,
  ) {}

  start(): void {
    this.look();
    this.repeat(() => {
      this.look();
    }, this.everyMs);
  }

  private look(): void {
    this.sink.report(schemeFor(this.dark.matches));
  }
}
