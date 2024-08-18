const SKIP_INTRO_BTN_SELECTOR = '.vjs-overlay.vjs-overlay-bottom-left.vjs-overlay-skip-intro.vjs-overlay-background';
const GO_TO_NEXT_EPISODE_BTN_SELECTOR = '.vjs-overlay.vjs-overlay-bottom-right.vjs-overlay-skip-intro.vjs-overlay-background';
const PLAY_BTN_SELECTOR = '.vjs-big-play-button';
const VIDEO_WRAPPER = '.video-js.vjs-default-skin';
const ELEMENT_TO_HIDE_1_SELECTOR = '.info_panel.clear'
const ELEMENT_TO_HIDE_2_SELECTOR = '.header.z_fix_header'

let focused = true;

window.addEventListener('blur', () => {
  focused = false;
});
window.addEventListener('focus', () => {
  focused = true;
});

setInterval(() => {
  if (!focused) {
    return;
  }

  const playBtn = document.querySelector(PLAY_BTN_SELECTOR);
  const skipIntroBtn = document.querySelector(SKIP_INTRO_BTN_SELECTOR);
  const nextEpisodeBtn = document.querySelector(GO_TO_NEXT_EPISODE_BTN_SELECTOR);

  if (playBtn && window.getComputedStyle(playBtn, null).display !== 'none') {
    playBtn.click();
  } else {
    const videoWrapper = document.querySelector(VIDEO_WRAPPER);
    const elementToHide1 = document.querySelector(ELEMENT_TO_HIDE_1_SELECTOR);
    const elementToHide2 = document.querySelector(ELEMENT_TO_HIDE_2_SELECTOR);

    if (elementToHide1) {
      elementToHide1.style.display = 'none';
    }

    if (elementToHide2) {
      elementToHide2.style.display = 'none';
    }

    if (videoWrapper) {
      videoWrapper.style.position = 'fixed';
      videoWrapper.style.zIndex = 9999;
      videoWrapper.style.top = '50%';
      videoWrapper.style.left = '50%';
      videoWrapper.style.transform = 'translate(-50%, -50%)';
    }
  }

  if (!skipIntroBtn && !nextEpisodeBtn) {
    return;
  }

  const isSkipIntroBtnHidden = !!skipIntroBtn?.classList.contains('vjs-hidden');
  const isNextEpisodeBtnHidden = !!nextEpisodeBtn?.classList.contains('vjs-hidden');

  if (isSkipIntroBtnHidden && isNextEpisodeBtnHidden) {
    return;
  }

  isSkipIntroBtnHidden
    ? nextEpisodeBtn?.click()
    : skipIntroBtn?.click();
}, 2000);
