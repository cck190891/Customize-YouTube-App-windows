import { invoke } from '@tauri-apps/api/core';
import { useEffect, useRef, useState } from 'preact/hooks';


async function sent_xhr_fetch() {
        // adblock code is converted from ublock filiter
        const xhr = `
        function modifyXHRResponse() {
          if (XMLHttpRequest.prototype._isModified) {
            return;
          }
          XMLHttpRequest.prototype._isModified = true;
          const originalOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function() {
            this.addEventListener('readystatechange', function() {
              if (this.readyState === 4) {
                const adPlacementPattern1 = /"adPlacements.*?([A-Z]"\}|"\}{2,4})\}\]\,/g;
                const adPlacementPattern2 = /"adPlacements.*?("adSlots"|"adBreakHeartbeatParams")/gms;
                const adSlotsPattern = /\"adSlots.*?\}\]\}\}\]\,/;
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
                      .replace(adSlotsPattern, '');
                  }
        
                  Object.defineProperty(this, 'responseText', { value: modifiedResponseText });
                }
                      }
            });
            originalOpen.apply(this, arguments);
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
        
            const adPlacementPattern1 = /"adPlacements.*?([A-Z]"\}|"\}{2,4})\}\]\,/g;
            const adSlotsPattern = /\"adSlots.*?\}\]\}\}\]\,/;
            const reelWatchPattern = /reel_watch_sequence/;
            const reelItemPattern = /reel_item_watch/;
        
            if (reelWatchPattern.test(url) || reelItemPattern.test(url) || url.includes('ads')) {
              const responseText = await clone.text();
              let modifiedResponseText = responseText
                .replace(adPlacementPattern1, '')
                .replace(adSlotsPattern, '');
              // return new Response(modifiedResponseText, {
              //   status: clone.status,
              //   statusText: clone.statusText,
              //   headers: clone.headers
              // });
              return new Response({
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

  window.__TAURI_INTERNALS__.metadata.windows.forEach(async window => {
      await invoke('do_eval', { label: window.label, jscode: xhr });
  });
}


async function sent_windows_info() {

  window.__TAURI_INTERNALS__.metadata.windows.forEach(async window => {
    let windows_info_code =
    `
    window.__TAURI__.event.emit('tauri://html-result',{label:'${window.label}',title: document.title });
    `
    await invoke('do_eval', { label: window.label, jscode: windows_info_code });
  });

}

async function sent_hd1080() {

  window.__TAURI_INTERNALS__.metadata.windows.forEach(async window => {
    let hd1080 =
    `
    "use strict";
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
    await invoke('do_eval', { label: window.label, jscode: hd1080 });
  });

}

async function sent_disable_element() {

  window.__TAURI_INTERNALS__.metadata.windows.forEach(async window => {
    let adb =
    `
        if (["m.youtube.com", "music.youtube.com", "tv.youtube.com", "www.youtube.com", "youtubekids.com", "youtube-nocookie.com"].includes(window.location.host)) {
          document.querySelectorAll('ytd-ad-slot-renderer').forEach(element => element.style.display = 'none');
          document.querySelectorAll('.ytp-title-link.yt-uix-sessionlink.ytp-title-fullerscreen-link').forEach(element => element.style.display = 'none');
          document.querySelectorAll('ytd-player-legacy-desktop-watch-ads-renderer').forEach(element => element.style.display = 'none');
          document.querySelectorAll('.ytp-fullerscreen-edu-button.ytp-button.ytp-fullerscreen-edu-button-subtle').forEach(element => element.style.display = 'none');

          
          const propertiesToUnset = [
            'ytInitialPlayerResponse.playerAds',
            'ytInitialPlayerResponse.adPlacements',
            'ytInitialPlayerResponse.adSlots',
            'playerResponse.adPlacements',
            'playerResponse.playerAds',
            'playerResponse.adSlots'
          ];
          
          propertiesToUnset.forEach(property => {
            const path = property.split('.');
            let obj = window;
            while (path.length > 1) {
              obj = obj[path.shift()];
            }
            if (obj && path[0]) {
              Object.defineProperty(obj, path[0], { get: () => undefined, set: () => {} });
            }
          });
        }
    `
    await invoke('do_eval', { label: window.label, jscode: adb });
  });
}






async function sent_adb_button_click() {
  // adblock code is converted from ublock filiter
  const xhr = `
  var skipAdButtons = document.getElementsByClassName("ytp-skip-ad-button");
  if (skipAdButtons.length > 0) {
    skipAdButtons[0].click();
  }
  
    `

window.__TAURI_INTERNALS__.metadata.windows.forEach(async window => {
await invoke('do_eval', { label: window.label, jscode: xhr });
});
}

async function sent_nonstop() {
  // adblock code is converted from ublock filiter
  const nonstop = `
    function removeContinueWatchingPrompt() {
        let continueWatchingButtonEN = document.querySelector('button[aria-label="Yes"]');
        let continueWatchingButtonCN = document.querySelector('button[aria-label="是"]');

        if (continueWatchingButtonEN) {
          continueWatchingButtonEN.click();
        }
        if (continueWatchingButtonCN) {
          continueWatchingButtonCN.click();
        }
  
    // 立即執行一次檢查
    removeContinueWatchingPrompt();
  `

window.__TAURI_INTERNALS__.metadata.windows.forEach(async window => {
await invoke('do_eval', { label: window.label, jscode: nonstop });
});
}









export default function JSblock() {
    (async()=>{
      window.setInterval(async () => {
        await sent_windows_info();
        await sent_hd1080();
      }, 2000);    
    
    })()
    // ADblock
    const adintervalIdRef = useRef<number | null>(null);
    const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(localStorage.getItem("isAdBlockEnabled") === "true");
    useEffect(() => {
      async function run() {
        if (isAdBlockEnabled) {
                localStorage.setItem("isAdBlockEnabled", "true");
                const intervalId = window.setInterval(async () => {
                    await sent_adb_button_click();
                    await sent_xhr_fetch();
                    await sent_disable_element();
                }, 1000);
                adintervalIdRef.current = intervalId;
                console.log('setInterval:', intervalId);
            } else {
                localStorage.setItem("isAdBlockEnabled", "false");
                if (adintervalIdRef.current !== null) {
                    clearInterval(adintervalIdRef.current);
                    console.log('clearInterval:', adintervalIdRef.current);
                    adintervalIdRef.current = null;
                }
            }
        }
        run();
    }, [isAdBlockEnabled]);
    // Nonstop 
    const nonstopintervalIdRef = useRef<number | null>(null);
    const [isNonstopEnabled, setIsNonstopEnabled] = useState(localStorage.getItem("isNonstopEnabled") === "true");
    useEffect(() => {
      async function run() {
        if (isNonstopEnabled) {
                localStorage.setItem("isNonstopEnabled", "true");
                const intervalId = window.setInterval(async () => {
                  await sent_nonstop();
                }, 300000);
                nonstopintervalIdRef.current = intervalId;
                console.log('setInterval:', intervalId);
            } else {
                localStorage.setItem("isNonstopEnabled", "false");
                if (nonstopintervalIdRef.current !== null) {
                    clearInterval(nonstopintervalIdRef.current);
                    console.log('clearInterval:', nonstopintervalIdRef.current);
                    nonstopintervalIdRef.current = null;
                }
            }
        }
        run();
    }, [isNonstopEnabled]);

    // HD1080
    const autohdintervalIdRef = useRef<number | null>(null);
    const [isAutohdEnabled, setIsAutohdEnabled] = useState(localStorage.getItem('isAutohdEnabled') === 'true');
    useEffect(() => {
      async function run() {
        if (isAutohdEnabled) {
                localStorage.setItem('isAutohdEnabled', 'true');
                const intervalId = window.setInterval(async () => {
                  await sent_nonstop();
                }, 300000);
                autohdintervalIdRef.current = intervalId;
                console.log('setInterval:', intervalId);
            } else {
                localStorage.setItem('isAutohdEnabled', 'false');

                if (autohdintervalIdRef.current !== null) {
                    clearInterval(autohdintervalIdRef.current);
                    console.log('clearInterval:', autohdintervalIdRef.current);
                    autohdintervalIdRef.current = null;
                }
            }
        }
        run();
    }, [isAutohdEnabled]);
    const [isHidetotrayEnabled, setIsHidetotrayEnabled] = useState(localStorage.getItem('isHidetotrayEnabled') === 'true');

    return (
        <>
            <p>adb</p>
            <input
                type="checkbox"
                defaultChecked={isAdBlockEnabled}
                onChange={(e) => setIsAdBlockEnabled((e.target as HTMLInputElement).checked)}
            />
            <p>Nonstop</p>
            <input
                type="checkbox"
                defaultChecked={isNonstopEnabled}
                onChange={(e) => setIsNonstopEnabled((e.target as HTMLInputElement).checked)}
            />

            <p>auto 1080p</p>
            <input
                type="checkbox"
                defaultChecked={isAutohdEnabled}
                onChange={(e) => setIsAutohdEnabled((e.target as HTMLInputElement).checked)}
            />

            <p>yt page hide to trayicon</p>
            <input
                type="checkbox"
                defaultChecked={isHidetotrayEnabled}
                onChange={(e) => setIsHidetotrayEnabled((e.target as HTMLInputElement).checked)}
            />
        </>
    );
}
