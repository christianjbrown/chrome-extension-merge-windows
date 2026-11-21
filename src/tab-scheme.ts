import { schemeFor, type ColourScheme } from "./colour-scheme";
import type { SchemeReader } from "./scheme-reader";

export interface ScriptRunner {
  executeScript(injection: {
    target: { tabId: number };
    func: () => boolean;
  }): Promise<{ result?: unknown }[]>;
}

// Runs inside the tab, so it can use nothing from this file: Chrome sends the
// function's own text across, and the query has to be written out in it. A
// test pins it to DARK_SCHEME_QUERY.
export function tabPrefersDark(): boolean {
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

// The top frame's answer, if the script ran there.
function schemeIn([frame]: { result?: unknown }[]): ColourScheme | undefined {
  return schemeOf(frame?.result);
}

function schemeOf(result: unknown): ColourScheme | undefined {
  return typeof result === "boolean" ? schemeFor(result) : undefined;
}

// Reads the colour scheme from a page in a tab, which follows Chrome's own
// Light and Dark setting. Only works in a tab the extension has been let into.
export class TabScheme implements SchemeReader {
  constructor(private readonly scripting: ScriptRunner) {}

  // Chrome's own pages, and tabs that have closed, cannot be asked.
  async read(tabId: number): Promise<ColourScheme | undefined> {
    try {
      const frames = await this.scripting.executeScript({
        target: { tabId },
        func: tabPrefersDark,
      });
      return schemeIn(frames);
    } catch {
      return undefined;
    }
  }
}
