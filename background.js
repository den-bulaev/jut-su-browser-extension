import { BackgroundActions } from "./constants.js";

// Listener for messages from content or popup scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = message?.state?.tabId;

  switch (message?.action) {
    case BackgroundActions.saveState: {
      chrome.storage.local.get([String(tabId)], (res) => {
        const preparedState = Object.keys(res).length
          ? { ...res[tabId], ...message.state }
          : message.state;

        chrome.storage.local.set({
          [String(tabId)]: preparedState,
        });
      });

      sendResponse({ status: "success", tabId });
      break;
    }

    case BackgroundActions.getState: {
      chrome.storage.local.get([String(tabId)], (res) => {
        if (!res) {
          sendResponse({ error: "State not found" });
        } else {
          sendResponse({ state: res });
        }
      });
      break;
    }

    default:
      sendResponse({ error: "Unknown command" });
  }

  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.active) {
    chrome.storage.local.remove(String(tabId));
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(String(tabId));
});
