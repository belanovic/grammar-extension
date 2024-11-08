

document.addEventListener("DOMContentLoaded", function() {
    const btnSpelling = document.getElementsByClassName('spelling')[0];
    const btnFacts = document.getElementsByClassName('facts')[0];
    
    btnSpelling.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "checkSpelling", tabId: tabs[0].id });
        });
    })
    btnFacts.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "checkFacts", tabId: tabs[0].id });
        });
    })
}) 