const tabStates = {};

// Listener for messages from content or popup scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = message?.state?.tabId;

  switch (message?.action) {
    case "saveState":
      tabStates[tabId] = message?.state;
      sendResponse({ status: "success", tabId });

    case "getState":
      const state = tabStates[tabId] || null;
      sendResponse({ state, tabStates });

    default:
      sendResponse({ error: "Unknown command" });
  }

  return true;
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.transitionType === "reload") {
    delete tabStates[details.tabId];
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabStates[tabId];
});
