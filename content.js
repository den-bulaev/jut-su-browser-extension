const SKIP_INTRO_BTN_SELECTOR =
  ".vjs-overlay.vjs-overlay-bottom-left.vjs-overlay-skip-intro.vjs-overlay-background.vjs-hidden";
const GO_TO_NEXT_EPISODE_BTN_SELECTOR =
  ".vjs-overlay.vjs-overlay-bottom-right.vjs-overlay-skip-intro.vjs-overlay-background";
const PLAY_BTN_SELECTOR = ".vjs-big-play-button";
const VIDEO_WRAPPER = ".video-js.vjs-default-skin";
const ELEMENT_TO_HIDE_1_SELECTOR = ".info_panel.clear";
const ELEMENT_TO_HIDE_2_SELECTOR = ".header.z_fix_header";
const ELEMENT_TO_HIDE_3_SELECTOR = ".footer.wrapper";

const body = document.querySelector("body");

let isRunning = true;

const waitForElm = (selector) => {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);

    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

const observeElementClassListChanges = (domElement) => {
  const options = {
    attributes: true,
    attributeFilter: ["class"],
  };

  function callback(mutationList, observer) {
    mutationList.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        if (!mutation.target.classList.contains("vjs-hidden") && isRunning) {
          mutation.target.click();
        }
      }
    });
  }

  const observer = new MutationObserver(callback);

  if (domElement) {
    observer.observe(domElement, options);
  }
};

const getFullscreen = (isRevert) => {
  const videoWrapper = document.querySelector(VIDEO_WRAPPER);
  const elementToHide1 = document.querySelector(ELEMENT_TO_HIDE_1_SELECTOR);
  const elementToHide2 = document.querySelector(ELEMENT_TO_HIDE_2_SELECTOR);
  const elementToHide3 = document.querySelector(ELEMENT_TO_HIDE_3_SELECTOR);

  if (body) {
    body.style.overflow = isRevert ? "auto" : "hidden";
  }

  if (elementToHide1) {
    elementToHide1.style.display = isRevert ? "block" : "none";
  }

  if (elementToHide2) {
    elementToHide2.style.display = isRevert ? "block" : "none";
  }

  if (elementToHide3) {
    elementToHide3.style.display = isRevert ? "block" : "none";
  }

  videoWrapper.style.position = isRevert ? "relative" : "fixed";
  videoWrapper.style.zIndex = isRevert ? 10 : 9999;
  videoWrapper.style.top = isRevert ? "0px" : "50%";
  videoWrapper.style.left = isRevert ? "0px" : "50%";
  videoWrapper.style.height = isRevert ? "unset" : "100%";
  videoWrapper.style.transform = isRevert ? "none" : "translate(-50%, -50%)";
};

waitForElm(PLAY_BTN_SELECTOR).then((element) => {
  if (element && isRunning) {
    setTimeout(() => {
      getFullscreen();
      element.click();
    }, 1000);
  }
});

waitForElm(SKIP_INTRO_BTN_SELECTOR).then((element) => {
  observeElementClassListChanges(element);
});

waitForElm(GO_TO_NEXT_EPISODE_BTN_SELECTOR).then((element) => {
  observeElementClassListChanges(element);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "stopNext": {
      isRunning = false;
      sendResponse({ success: true });
      break;
    }

    case "runNext": {
      isRunning = true;
      sendResponse({ success: true });
      break;
    }

    case "getFullscreen": {
      getFullscreen();
      sendResponse({ success: true });
      break;
    }

    default: {
      getFullscreen(true);
      sendResponse({ success: true });
    }
  }

  return true;
});
