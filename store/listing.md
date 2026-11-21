# Chrome Web Store listing

Everything the developer dashboard asks for, ready to paste. The images are in this folder.

## Package

Run `npm run package` and upload the `extension.zip` it makes. Bump `version` in `static/manifest.json` before uploading an update.

## Store listing

- **Name:** Christian's Merge Windows and Tabs (read from the manifest)
- **Summary:** One click pulls the tabs from every other window, minimised and popup ones too, into the window you are in. (read from the manifest)
- **Category:** Make Chrome Yours > Functionality & UI
- **Language:** English (United Kingdom)
- **Store icon:** `icon-128.png`
- **Screenshot:** `screenshot-1280x800.png`
- **Small promo tile:** `promo-440x280.png`
- **Homepage URL:** https://github.com/christianjbrown/chrome-extension-merge-windows
- **Support URL:** https://github.com/christianjbrown/chrome-extension-merge-windows/issues

**Description**

```text
One button in your toolbar. Click it and every other Chrome window folds into the one you're looking at: minimised ones, popups, and the one you forgot about on another desktop.

• Tabs keep their order, window after window.
• Tab groups move over whole, with their name, colour and whether they were collapsed.
• Pinned tabs stay pinned.
• Incognito stays incognito. Ordinary and incognito windows are never mixed.
• Empty windows close once their last tab has moved.

No settings, no tracking, nothing sent anywhere. It never reads the pages in your tabs, it only moves them.
```

## Privacy practices

**Single purpose**

```text
Move the tabs from all other Chrome windows into the current window.
```

**Permission justifications**

**tabGroups**

```text
Reads the tab groups in the other windows and recreates them, with their name, colour and collapsed state, in the window the tabs move to.
```

**offscreen**

```text
Opens a hidden document that reads whether the device is in its light or dark colour scheme, so the toolbar icon can be drawn to match. A service worker cannot read that itself. The document reads nothing else.
```

**activeTab**

```text
Lets the extension into the one tab the user clicks the button in, and only when they click. It is used to read that tab's light or dark setting, which follows Chrome's own, and nothing else in the tab is read.
```

**scripting**

```text
Runs one line in the tab the user clicked the button in, to ask whether it is in a light or dark colour scheme. Chrome can be set to Light or Dark separately from the device, and only a page in a tab shows which. Nothing else is read.
```

**storage**

```text
Remembers which colour scheme the toolbar is in, so the icon matches it after Chrome restarts. Chrome can be set to Light or Dark separately from the device, and the extension only learns that from the tab the user clicks its button in. Nothing else is stored.
```

**Remote code:** No, I am not using remote code.

**Data usage:** tick none of the data types, then tick all three certifications.

**Privacy policy URL:** https://github.com/christianjbrown/chrome-extension-merge-windows/blob/main/PRIVACY.md

## Distribution

Free, public, all regions.
