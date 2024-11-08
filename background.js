chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkSpelling" && request.tabId) {
    chrome.tabs.sendMessage(request.tabId, { action: "checkSpelling" });
  }
});