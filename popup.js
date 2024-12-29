import { BackgroundActions } from "./constants.js";

const togglers = document.querySelectorAll(".toggle");

const updateToggle = (toggle, isChecked) => {
  const toggleName = toggle?.name;

  toggle.checked = isChecked;

  if (toggleName) {
    const toggleLabel = document.querySelector(`label[for="${toggleName}"]`);

    if (toggleLabel) {
      if (isChecked) {
        toggleLabel.classList.add("toggle__off");
        toggleLabel.textContent = "Off";
      } else {
        toggleLabel.classList.remove("toggle__off");
        toggleLabel.textContent = "On";
      }
    }
  }
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTabId = tabs[0]?.id;

  if (tabs[0].url.match(/https:\/\/jut.su\/.*episode.*/) && togglers.length) {
    // Fetch current state
    chrome.runtime.sendMessage(
      { action: BackgroundActions.getState, state: { tabId: currentTabId } },
      (response) => {
        togglers.forEach((toggle) => {
          if (
            response?.state[currentTabId] &&
            toggle.name in response.state[currentTabId]
          ) {
            updateToggle(
              toggle,
              response.state[currentTabId][toggle.name].toggled
            );
          }
        });
      }
    );

    // Toggle state
    togglers.forEach((toggle) => {
      const toggleName = toggle?.name;

      if (toggleName) {
        toggle.addEventListener("change", (e) => {
          const isChecked = e.target.checked;

          updateToggle(toggle, isChecked);

          chrome.runtime.sendMessage(
            {
              action: BackgroundActions.saveState,
              state: {
                tabId: currentTabId,
                [toggleName]: {
                  toggled: isChecked,
                },
              },
            },
            (response) => {}
          );

          switch (toggleName) {
            case "skip-switch": {
              chrome.tabs.sendMessage(
                currentTabId,
                { action: isChecked ? "stopNext" : "runNext" },
                (response) => {}
              );
              break;
            }

            default: {
              chrome.tabs.sendMessage(
                currentTabId,
                { action: isChecked ? "resetFullscreen" : "getFullscreen" },
                (response) => {}
              );
            }
          }
        });
      }
    });
  } else {
    const unavailableBlock = document.querySelector(".unavailable-block");

    if (unavailableBlock) {
      unavailableBlock.style.display = "block";
    }
  }
});
