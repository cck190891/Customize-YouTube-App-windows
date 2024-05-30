

function sent_windows_info(label:string) {
    return`
    setInterval(function() {
      window.__TAURI__.event.emit('tauri://html-result',{label:'${label}',title: document.title });
    }, 1000);    
    window.addEventListener("beforeunload", function(event) {
      window.__TAURI__.event.emit('tauri://html-reload',{label:'${label}' });
    });
    `
}

function sent_pre_init(){
    if (localStorage.getItem("isAdBlockEnabled") !== "true") return''
    return`
    function removeYouTubeAds() {
      if (window.ytInitialPlayerResponse && window.ytInitialPlayerResponse.adPlacements) {
        window.ytInitialPlayerResponse.adPlacements = undefined;
      }
      if (window.ytInitialPlayerResponse && window.ytInitialPlayerResponse.adSlots) {
        window.ytInitialPlayerResponse.adSlots = undefined;
      }
      if (window.ytInitialPlayerResponse && window.ytInitialPlayerResponse.playerAds) {
        window.ytInitialPlayerResponse.playerAds = undefined;
      }
      if (window.playerResponse && window.playerResponse.adPlacements) {
        window.playerResponse.adPlacements = undefined;
      }
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (window.ytInitialPlayerResponse && mutation.addedNodes.length === 1) {
            window.ytInitialPlayerResponse.adPlacements = undefined;
            window.ytInitialPlayerResponse.playerAds = undefined;
            window.ytInitialPlayerResponse.adSlots = undefined;
            window.playerResponse.adPlacements = undefined;
          }
        });
      });
  
      observer.observe(document, { childList: true, subtree: true });
    }
    `
}

function sent_xhr_fetch(){
    if (localStorage.getItem("isAdBlockEnabled") !== "true") return''

    return `
    function modifyXHRResponse() {
      if (XMLHttpRequest.prototype._isModified) {
        return;
      }
      XMLHttpRequest.prototype._isModified = true;
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function() {
        this.addEventListener('readystatechange', function() {
          if (this.readyState === 4) {
            const adPlacementPattern1 = /"adPlacements.*?([A-Z]"\}|"\}{2\,4})\}\]\,/;
            const adPlacementPattern2 = /"adPlacements.*?("adSlots"|"adBreakHeartbeatParams")/gms;
            const urlPatterns = [
              /playlist\\?list=/,
              /player\\?/,
              /watch\\?v=/,
              /youtubei\\/v1\\/player/
            ];

    
            if (this.responseType == 'string'){
              let modifiedResponseText =  this.responseText;
              if (urlPatterns.some(pattern => pattern.test(this.responseURL))) {
                modifiedResponseText = modifiedResponseText
                .replace(adPlacementPattern1, '')
                .replace(adPlacementPattern2, '$1')
              }
              
              Object.defineProperty(this, 'responseText', { value: modifiedResponseText });
            }
          }
        });
        const doubleedclickurlPattern=/doubleclick\.net/;
        if (!(doubleedclickurlPattern.test(this.responseURL))){
          originalOpen.apply(this, arguments);
        }
      };
    }
    function modifyFetchResponse() {
      if (window._isFetchModified) {
        return;}
      window._isFetchModified = true;
      const originalFetch = window.fetch;
      window.fetch = async function() {
        const response = await originalFetch.apply(this, arguments);
        const url = response.url;
        const clone = response.clone();
    
        const adPlacementPattern1 = /"adPlacements.*?([A-Z]"\}|"\}{2\,4})\}\]\,/
        const adSlotsPattern = /\"adSlots.*?\}\]\}\}\]\,/;
        const urlPatterns = [
          /playlist\\?list=/,
          /player\\?/,
          /watch\\?v=/,
          /youtubei\\/v1\\/player/
        ];
        if (urlPatterns.some(pattern => pattern.test(this.responseURL))) {
          const responseText = await clone.text();
          let modifiedResponseText = responseText
            .replace(adPlacementPattern1, '')
            .replace(adSlotsPattern, '');
          return new Response(modifiedResponseText, {
            status: clone.status,
            statusText: clone.statusText,
            headers: clone.headers
        });
        }
        return response;
      };
    }
    if (["m.youtube.com", "music.youtube.com", "tv.youtube.com", "www.youtube.com", "youtubekids.com", "youtube-nocookie.com"].includes(window.location.host)) {
      modifyXHRResponse();
      modifyFetchResponse();
    }
    if (window.gc){
      window.gc();
    }`
}


function sent_disable_element(){
  if (localStorage.getItem("isAdBlockEnabled") !== "true") return''

    return`
    if (["m.youtube.com", "music.youtube.com", "tv.youtube.com", "www.youtube.com", "youtubekids.com", "youtube-nocookie.com"].includes(window.location.host)) {
      document.querySelectorAll('ytd-ad-slot-renderer').forEach(element => element.style.display = 'none');
      document.querySelectorAll('ytd-player-legacy-desktop-watch-ads-renderer').forEach(element => element.style.display = 'none');
      document.querySelectorAll('.ytp-fullerscreen-edu-button.ytp-button').forEach(element => element.style.display = 'none');
      document.querySelectorAll('.ytp-chrome-top').forEach(element => element.style.display = 'none');
      document.querySelectorAll('.ytp-chrome-top').forEach(element => element.style.display = 'none');
      // document.querySelectorAll('.ytlr-horizontal-list-renderer__items > .yt-virtual-list__container > .yt-virtual-list__item--visible.yt-virtual-list__item--selected.yt-virtual-list__item').forEach(element => {
      //   if(element.textContent.includes('Ad')) {
      //       element.style.display = 'none';
      //     }
      // });          
    }
    `
}

function sent_adb_button_click(){
  if (localStorage.getItem("isAdBlockEnabled") !== "true") return''

    return`
    var skipAdButtons = document.getElementsByClassName("ytp-skip-ad-button");
    if (skipAdButtons.length > 0) {
      skipAdButtons[0].click();
    }
    `
}

function sent_nonstop(){
  if (localStorage.getItem("isNonstopEnabled") !== "true") return''

    return`
    function removeContinueWatchingPrompt() {
        document.querySelector('ytd-popup-container').click();
    }
    removeContinueWatchingPrompt();
    `
}


function sent_hd1080(){
  if (localStorage.getItem("isAutohdEnabled") !== "true") return''

    return`
    const targetRes = "hd1080";
    function setResolution() {
      const player = document.getElementById("movie_player") || document.getElementsByClassName("html5-video-player")[0];
      if (!player) return;
  
      const availableQualities = player.getAvailableQualityLevels();
      if (availableQualities.includes(targetRes)) {
        player.setPlaybackQualityRange(targetRes);
        player.setPlaybackQuality(targetRes);
        console.log("Resolution set to:", targetRes);
      }
    }
    window.addEventListener("yt-navigate-finish", setResolution, true);
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "complete") {
        setResolution();
      }
    });
    setResolution();    
    `
}

function sent_f11_event(label:string){
    return`
    document.addEventListener('keydown', async function (event) {
        if (event.key === 'F11' ) {
            window.__TAURI__.event.emit('tauri://F11',{label:'${label}'});
        }
    });
    `
}

function sent_MutationObserver_event(label:string){

    return` 
    function throttle(callback, delay) {
      let timerId;
      let throttled = false;
      
      return function() {
        if (!throttled) {
          callback.apply(this, arguments);
          throttled = true;
          
          timerId = setTimeout(() => {
            throttled = false;
          }, delay);
        }
      };
    }
    document.addEventListener('DOMContentLoaded', () => { 
      const callback = function(mutationsList, observer) {
        window.__TAURI__.event.emit('tauri://mutationObserver',{label:'${label}'});
        console.log('work')
      };
    
      const throttledCallback = throttle(callback, 500);
      const observer = new MutationObserver(throttledCallback);
      const target = document.documentElement;
    
      if (target) {
        observer.observe(target, { attributes: true, childList: true, subtree: true });
      } 
      setInterval(() => {
          callback(); 
      }, 1000);
    });
    `
}
 


export {
    sent_windows_info,
    sent_pre_init,
    sent_xhr_fetch, 
    sent_adb_button_click, 
    sent_disable_element, 
    sent_nonstop, 
    sent_hd1080,
    sent_f11_event,
    sent_MutationObserver_event

}