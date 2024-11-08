

document.addEventListener("DOMContentLoaded", function() {
    const btn = document.getElementsByClassName('btn')[0];
    btn.addEventListener('click', function() {
        console.log("evo me");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "sendText", tabId: tabs[0].id });
        });
    })
}) 