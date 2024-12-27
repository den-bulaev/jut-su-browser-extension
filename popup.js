const toggleStateButton = document.getElementById("on-off-switch");
const label = document.querySelector(".on-off-switch-label");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTabId = tabs[0]?.id;

  if (tabs[0].url.match(/https:\/\/jut.su\/.*episode.*/)) {
    // Fetch current state
    chrome.runtime.sendMessage({ action: "getState" }, (response) => {
      if (
        response?.tabStates[currentTabId]?.tabId === currentTabId &&
        response?.tabStates[currentTabId]?.toggled
      ) {
        if (label) {
          label.style.backgroundColor = "red";
        }

        if (toggleStateButton) {
          toggleStateButton.checked = true;
        }
      }
    });

    // Toggle state
    if (toggleStateButton) {
      toggleStateButton.addEventListener("change", (e) => {
        const isChecked = e.target.checked;

        if (label) {
          label.style.backgroundColor = isChecked ? "red" : "green";
        }

        chrome.runtime.sendMessage(
          {
            action: "saveState",
            state: { toggled: isChecked, tabId: currentTabId },
          },
          (response) => {}
        );

        if (currentTabId) {
          chrome.tabs.sendMessage(
            currentTabId,
            { action: isChecked ? "stopExtension" : "runExtension" },
            (response) => {}
          );
        }
      });
    }
  } else {
    const toggleWrapper = document.querySelector(".toggle-wrapper");

    if (toggleWrapper) {
      toggleWrapper.style.transitionDuration = "1000ms";
      toggleWrapper.style.transform = "translate(110%)";
    }
  }
});
