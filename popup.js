const toggleStateButton = document.getElementById("on-off-switch");
const label = document.querySelector(".on-off-switch-label");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTabId = tabs[0]?.id;

  if (tabs[0].url.includes("https://jut.su/")) {
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
          (response) => {
            console.log("State toggled for tab:", response);
          }
        );

        if (currentTabId) {
          chrome.tabs.sendMessage(
            currentTabId,
            { action: isChecked ? "stopExtension" : "runExtension" },
            (response) => {
              if (response) {
                console.log("Response from content script:", response);
              } else {
                console.log("No response from content", response);
              }
            }
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
