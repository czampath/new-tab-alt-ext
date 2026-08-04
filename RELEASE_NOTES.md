# Release Notes

## v1.1 - Security Hardening

This release focuses on security improvements while preserving existing behavior and user workflows.

**Security Fixes:**
- Hardened URL validation by switching from string prefix checks to parser-based protocol validation.
- Enforced redirect destination validation before applying redirect rules.
- Added a guard to avoid redundant self-redirect updates in navigation handling.
- Removed DOM injection sinks in the options page by replacing dynamic HTML string rendering with safe DOM node construction.
- Removed DOM injection sinks in the new tab invalid-URL view by replacing dynamic HTML string rendering with safe element APIs.
- Replaced inline click handler usage in the invalid-URL view with event listener binding.

**What Did Not Change:**
- Custom new-tab URL behavior remains the same.
- Redirect rule behavior (including wildcard suffix matching with `*`) remains the same.
- Supported protocol set remains the same as v1.0.

---

## v1.0 - Initial Release

**Initial release of the Chrome extension for new-tab-alt**

## What's Included

🎉 **New Tab Override**
- Override Chrome's default new tab page with your custom URL
- Preset to https://czampath.github.io/new-tab-alt/ by default
- Support for all URL types: https://, http://, file://, chrome://, chrome-extension://

🔀 **URL Redirects**
- Automatically redirect specific URLs to different destinations
- Add unlimited redirect rules
- Wildcard support (e.g., `https://example.com/*`)

⚙️ **Easy Configuration**
- Clean, modern settings interface
- Quick access to options via right-click menu
- Instant redirect with minimal flash/loading

## Installation

1. Download `chrome-extension.zip` from this release
2. Extract to a folder on your computer
3. Open Chrome → `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" → Select the extracted folder
6. Right-click extension icon → "Options" to configure

## Requirements

- Chrome browser (or Chromium-based browsers)
- Manifest V3 compatible

---

Perfect for bypassing organization-enforced new tab policies and customizing your browsing experience!
