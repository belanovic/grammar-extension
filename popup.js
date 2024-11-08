

document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementsByClassName('btn')[0];
    btn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "checkSpelling", tabId: tabs[0].id });
        });
    })
}) 