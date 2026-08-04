// Check for custom URL and redirect
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

function renderInvalidUrlView(customUrl) {
    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'center';
    wrapper.style.padding = '40px';

    const heading = document.createElement('h2');
    heading.style.marginBottom = '20px';
    heading.textContent = 'Invalid URL';

    const message = document.createElement('p');
    message.style.marginBottom = '20px';
    message.textContent = 'The custom URL you set is not valid.';

    const invalidUrlText = document.createElement('p');
    invalidUrlText.style.marginBottom = '30px';
    invalidUrlText.style.fontFamily = "'Courier New', monospace";
    invalidUrlText.style.background = 'rgba(255,255,255,0.2)';
    invalidUrlText.style.padding = '15px';
    invalidUrlText.style.borderRadius = '8px';
    invalidUrlText.textContent = customUrl;

    const hint = document.createElement('p');
    hint.style.marginBottom = '20px';
    hint.textContent = 'URLs must start with: https://, http://, file://, chrome://, etc.';

    const openSettingsButton = document.createElement('button');
    openSettingsButton.style.padding = '12px 24px';
    openSettingsButton.style.background = 'white';
    openSettingsButton.style.color = '#667eea';
    openSettingsButton.style.border = 'none';
    openSettingsButton.style.borderRadius = '8px';
    openSettingsButton.style.fontSize = '14px';
    openSettingsButton.style.fontWeight = '600';
    openSettingsButton.style.cursor = 'pointer';
    openSettingsButton.textContent = 'Open Settings';
    openSettingsButton.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });

    wrapper.appendChild(heading);
    wrapper.appendChild(message);
    wrapper.appendChild(invalidUrlText);
    wrapper.appendChild(hint);
    wrapper.appendChild(openSettingsButton);

    document.body.innerHTML = '';
    document.body.appendChild(wrapper);
}

chrome.storage.sync.get(['customUrl'], (result) => {
    const customUrl = result.customUrl ? result.customUrl.trim() : '';
    
    if (customUrl) {
        // Validate URL format
        if (isValidCustomUrl(customUrl)) {
            // Redirect to custom URL
            window.location.replace(customUrl);
        } else {
            // Invalid URL - show error
            renderInvalidUrlView(customUrl);
        }
    } else {
        // No custom URL - redirect to default Chrome new tab
        window.location.replace('chrome://newtab');
    }
});
