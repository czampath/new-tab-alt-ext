// Set default URL when extension is first installed
const ALLOWED_PROTOCOLS = new Set([
    'https:',
    'http:',
    'file:',
    'ftp:',
    'urn:',
    'chrome-extension:',
    'chrome:'
]);

function isValidCustomUrl(url) {
    if (!url) {
        return false;
    }

    try {
        const parsedUrl = new URL(url);
        return ALLOWED_PROTOCOLS.has(parsedUrl.protocol);
    } catch {
        return false;
    }
}

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Set default custom URL on first install
        chrome.storage.sync.set({
            customUrl: 'https://czampath.github.io/new-tab-alt/',
            redirectRules: []
        });
    }
});

// Listen for new tab creation and update URL immediately
chrome.tabs.onCreated.addListener((tab) => {
    // Only handle new tabs (no URL set yet)
    if (tab.pendingUrl === 'chrome://newtab/' || tab.url === 'chrome://newtab/') {
        chrome.storage.sync.get(['customUrl'], (result) => {
            const customUrl = result.customUrl ? result.customUrl.trim() : '';
            
            if (customUrl) {
                if (isValidCustomUrl(customUrl)) {
                    // Update tab URL immediately
                    chrome.tabs.update(tab.id, { url: customUrl });
                }
            }
        });
    }
});

// Listen for navigation events to apply URL redirects
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    // Only handle main frame navigations (not iframes)
    if (details.frameId === 0) {
        chrome.storage.sync.get(['redirectRules'], (result) => {
            const redirectRules = result.redirectRules || [];
            
            // Check if the URL matches any redirect rule
            for (const rule of redirectRules) {
                if (rule.from && rule.to) {
                    // Check for exact match or wildcard match
                    if (urlMatches(details.url, rule.from) && isValidCustomUrl(rule.to) && details.url !== rule.to) {
                        // Redirect to the target URL
                        chrome.tabs.update(details.tabId, { url: rule.to });
                        break;
                    }
                }
            }
        });
    }
});

// Helper function to check if URL matches pattern
function urlMatches(url, pattern) {
    // Exact match
    if (url === pattern) {
        return true;
    }
    
    // Wildcard match (supports * at end)
    if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        return url.startsWith(prefix);
    }
    
    return false;
}
