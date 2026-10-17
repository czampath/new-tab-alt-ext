// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['customUrl', 'redirectRules'], (result) => {
        // Set default URL if not already set
        const customUrl = result.customUrl !== undefined ? result.customUrl : 'https://bytedeck.dev';
        document.getElementById('customUrl').value = customUrl;
        
        // Load redirect rules
        const redirectRules = result.redirectRules || [];
        renderRedirectList(redirectRules);
    });
});

// Render redirect rules list
function renderRedirectList(rules) {
    const container = document.getElementById('redirectList');
    container.innerHTML = '';
    
    rules.forEach((rule, index) => {
        const item = document.createElement('div');
        item.className = 'redirect-item';

        const fromInput = document.createElement('input');
        fromInput.type = 'text';
        fromInput.placeholder = 'From URL (e.g., https://example.com)';
        fromInput.value = rule.from || '';
        fromInput.dataset.index = String(index);
        fromInput.dataset.field = 'from';

        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        arrow.textContent = '\u2192';

        const toInput = document.createElement('input');
        toInput.type = 'text';
        toInput.placeholder = 'To URL (e.g., https://newsite.com)';
        toInput.value = rule.to || '';
        toInput.dataset.index = String(index);
        toInput.dataset.field = 'to';

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-btn';
        removeButton.dataset.index = String(index);
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', (e) => {
            const button = e.currentTarget;
            const removeIndex = Number.parseInt(button.dataset.index, 10);
            removeRedirectRule(removeIndex);
        });

        item.appendChild(fromInput);
        item.appendChild(arrow);
        item.appendChild(toInput);
        item.appendChild(removeButton);
        container.appendChild(item);
    });
}

// Add new redirect rule
document.getElementById('addRedirectBtn').addEventListener('click', () => {
    chrome.storage.sync.get(['redirectRules'], (result) => {
        const rules = result.redirectRules || [];
        rules.push({ from: '', to: '' });
        chrome.storage.sync.set({ redirectRules: rules }, () => {
            renderRedirectList(rules);
        });
    });
});

// Remove redirect rule
function removeRedirectRule(index) {
    chrome.storage.sync.get(['redirectRules'], (result) => {
        const rules = result.redirectRules || [];
        rules.splice(index, 1);
        chrome.storage.sync.set({ redirectRules: rules }, () => {
            renderRedirectList(rules);
            showStatus('Redirect rule removed', 'success');
        });
    });
}

// Save settings
document.getElementById('saveBtn').addEventListener('click', () => {
    const customUrl = document.getElementById('customUrl').value.trim();
    
    // Collect redirect rules from inputs
    const redirectInputs = document.querySelectorAll('#redirectList input');
    const redirectRules = [];
    const ruleMap = {};
    
    redirectInputs.forEach(input => {
        const index = Number.parseInt(input.dataset.index, 10);
        const field = input.dataset.field;
        
        if (!ruleMap[index]) {
            ruleMap[index] = {};
        }
        ruleMap[index][field] = input.value.trim();
    });
    
    // Convert map to array, filter out empty rules
    Object.values(ruleMap).forEach(rule => {
        if (rule.from && rule.to) {
            redirectRules.push(rule);
        }
    });
    
    chrome.storage.sync.set({ customUrl, redirectRules }, () => {
        renderRedirectList(redirectRules);
        showStatus('Settings saved successfully!', 'success');
    });
});

// Reset to default
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('customUrl').value = '';
    chrome.storage.sync.set({ customUrl: '', redirectRules: [] }, () => {
        renderRedirectList([]);
        showStatus('Reset to default settings', 'success');
    });
});

// Show status message
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type} show`;
    
    setTimeout(() => {
        status.classList.remove('show');
    }, 3000);
}
