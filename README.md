# Merge Windows 🪟

One button in your Chrome toolbar. Click it and every other Chrome window folds into the one you're looking at. Minimised ones, popups, that window you forgot about on the other desktop: all of it. No options page, no settings, no menu. Click, done.

## What you get 🧲

- **Every window**, including minimised ones and popup windows (the little chromeless ones that sign-in flows and web apps love to spawn).
- **Tabs stay in order.** Windows come across one after another, and each window's tabs keep the order they had.
- **Tab groups survive.** A group moves over whole, with its name, its colour and whether it was collapsed. 🎨
- **Pinned tabs stay pinned**, and line up with the pinned tabs you already had.
- **Incognito stays incognito.** Click in an ordinary window and the incognito ones are left alone, and the other way round. Chrome won't mix them anyway.
- **Empty windows vanish** once their last tab has moved.
- **Alt+Shift+M** does the same as clicking, for keyboard people.

## Install it 🔧

You need [Node.js](https://nodejs.org) 22 or newer, and Chrome 126 or newer.

1. Grab the code and build it:

   ```bash
   git clone https://github.com/christianjbrown/chrome-extension-merge-windows.git
   cd chrome-extension-merge-windows
   npm ci
   npm run build
   ```

   That makes a `dist` folder, which is the actual extension.

2. Open `chrome://extensions` in Chrome.
3. Flip on **Developer mode** (top right).
4. Click **Load unpacked** and pick the `dist` folder.
5. Click the puzzle piece 🧩 in the toolbar and hit the pin next to **Christian's Merge Windows**.

### Updating 🔄

```bash
git pull
npm ci
npm run build
```

Then hit the reload arrow on the Christian's Merge Windows card in `chrome://extensions`.

## Good to know 🤓

- **It merges into the window you clicked in.** Whatever's in there stays put, and everything else lands after it.
- **Incognito windows** only get merged if you've turned on **Allow in Incognito** for the extension in `chrome://extensions`, and then only into another incognito window.
- **App windows** (installed web apps running in their own window) and DevTools are left alone. They aren't really browser windows.
- **A red `!` on the button** means something went wrong. Hover over it and the tooltip says what.
- **Want a different shortcut?** Change it at `chrome://extensions/shortcuts`.
- **It asks for one permission, `tabGroups`,** so it can move groups whole. It never reads your pages, URLs or tab titles.

## Hacking on it 🛠️

It's TypeScript, bundled with esbuild, tested with Vitest.

```bash
npm test          # the unit tests
npm run ci        # everything CI checks: format, lint, types, unused code, 100% coverage, build
```

`npm run ci` has to pass before a push leaves your machine (the pre-push hook runs it), and coverage has to stay at 100% for lines, branches, functions and statements, or it fails.

How it fits together, all in `src`:

- **`main.ts`** wires the pieces to Chrome. Nothing else touches `chrome` directly.
- **`merge-controller.ts`** handles a click: merge, then clear the badge or show what went wrong.
- **`window-merger.ts`** fetches every normal and popup window, picks out the ones to merge, and runs the plan.
- **`merge-planner.ts`** works out the moves: runs of loose tabs in one go, groups whole, then re-pin the pinned ones.
- **`chrome-merge-steps.ts`** turns those moves into `chrome.tabs` and `chrome.tabGroups` calls.

Every class gets its collaborators through its constructor, behind an interface, so each one is tested on its own with fakes.
