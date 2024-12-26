const SKIP_INTRO_BTN_SELECTOR =
  ".vjs-overlay.vjs-overlay-bottom-left.vjs-overlay-skip-intro.vjs-overlay-background";
const GO_TO_NEXT_EPISODE_BTN_SELECTOR =
  ".vjs-overlay.vjs-overlay-bottom-right.vjs-overlay-skip-intro.vjs-overlay-background";
const PLAY_BTN_SELECTOR = ".vjs-big-play-button";
const VIDEO_WRAPPER = ".video-js.vjs-default-skin";
const ELEMENT_TO_HIDE_1_SELECTOR = ".info_panel.clear";
const ELEMENT_TO_HIDE_2_SELECTOR = ".header.z_fix_header";
const ELEMENT_TO_HIDE_3_SELECTOR = ".footer.wrapper";

const body = document.querySelector("body");
const elementToHide1 = document.querySelector(ELEMENT_TO_HIDE_1_SELECTOR);
const elementToHide2 = document.querySelector(ELEMENT_TO_HIDE_2_SELECTOR);
const elementToHide3 = document.querySelector(ELEMENT_TO_HIDE_3_SELECTOR);

let isRunning = true;
let timer;

function extensionLoop() {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(function () {
    const playBtn = document.querySelector(PLAY_BTN_SELECTOR);
    const skipIntroBtn = document.querySelector(SKIP_INTRO_BTN_SELECTOR);
    const nextEpisodeBtn = document.querySelector(
      GO_TO_NEXT_EPISODE_BTN_SELECTOR
    );
    const videoWrapper = document.querySelector(VIDEO_WRAPPER);

    if (videoWrapper.classList.contains("vjs-paused") && !playBtn) {
      extensionLoop();
      return;
    }

    if (isRunning) {
      if (body) {
        body.style.overflow = "hidden";
      }

      if (
        playBtn &&
        window.getComputedStyle(playBtn, null).display !== "none"
      ) {
        playBtn.click();
      }

      if (elementToHide1) {
        elementToHide1.style.opacity = "0";
      }

      if (elementToHide2) {
        elementToHide2.style.opacity = "0";
      }

      if (elementToHide3) {
        elementToHide3.style.opacity = "0";
      }

      if (videoWrapper) {
        videoWrapper.style.position = "fixed";
        videoWrapper.style.zIndex = 9999;
        videoWrapper.style.top = "50%";
        videoWrapper.style.left = "50%";
        videoWrapper.style.transform = "translate(-50%, -50%)";
      }

      if (!skipIntroBtn && !nextEpisodeBtn) {
        extensionLoop();
        return;
      }

      const isSkipIntroBtnHidden =
        !!skipIntroBtn?.classList.contains("vjs-hidden");
      const isNextEpisodeBtnHidden =
        !!nextEpisodeBtn?.classList.contains("vjs-hidden");

      if (isSkipIntroBtnHidden && isNextEpisodeBtnHidden) {
        extensionLoop();
        return;
      }

      if (!skipIntroBtn && nextEpisodeBtn && !isNextEpisodeBtnHidden) {
        nextEpisodeBtn?.click();
        extensionLoop();
        return;
      }

      isSkipIntroBtnHidden ? nextEpisodeBtn?.click() : skipIntroBtn?.click();

      extensionLoop();
    } else {
      if (body) {
        body.style.overflow = "auto";
      }

      if (elementToHide1) {
        elementToHide1.style.opacity = "1";
      }

      if (elementToHide2) {
        elementToHide2.style.opacity = "1";
      }

      if (elementToHide3) {
        elementToHide3.style.opacity = "1";
      }

      if (videoWrapper) {
        videoWrapper.style.position = "relative";
        videoWrapper.style.zIndex = "auto";
        videoWrapper.style.top = "0px";
        videoWrapper.style.left = "0px";
        videoWrapper.style.transform = "none";
      }
    }
  }, 3000);
}

extensionLoop();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "stopExtension") {
    isRunning = false;
    sendResponse({ success: true });
  }

  if (message.action === "runExtension") {
    isRunning = true;
    sendResponse({ success: true });
    extensionLoop();
  }

  return true;
});
