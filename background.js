chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sendText" && request.tabId) {
    // Forward the message to content.js in the specified tab
    chrome.tabs.sendMessage(request.tabId, { action: "sendText" });
  }
});