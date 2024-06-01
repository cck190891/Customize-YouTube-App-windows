
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


 function sent_xhr_fetch(){
    // From : https://github.com/TheRealJoelmatic/RemoveAdblockThing/tree/main
    // https://github.com/TheRealJoelmatic/RemoveAdblockThing/blob/main/Youtube-Ad-blocker-Reminder-Remover.user.js

    if (localStorage.getItem("isAdBlockEnabled") !== "true") {
      console.log("disable adblock")
      return
    }

    return `  
    document.addEventListener('DOMContentLoaded', function() {
      var script = document.createElement('script');
      script.src = "${localStorage.getItem('isScriptpathEnabled')}"
      // script.src = "https://raw.githubusercontent.com/TheRealJoelmatic/RemoveAdblockThing/main/Youtube-Ad-blocker-Reminder-Remover.user.js"
      // script.src = "https://drive.usercontent.google.com/download?id=1pOkGLUoU22-Sy2asaMA4T9KA0qRRFAKN&export=download&authuser=0&confirm=t&uuid=2d33cd79-ec0b-4e20-b7df-d84a9f6ca718&at=APZUnTWvqG8TNWrM28WJc2XiJX1c%3A1717264602400";
      // script.src = "https://cdn.discordapp.com/attachments/1210839424699600966/1246520809975976058/Youtube-Ad-blocker-Reminder-Remover.user.js?ex=665cb078&is=665b5ef8&hm=4405cb0e643e7a850c015ac9c430ad236c6da5ecda830edd955517e9b6434f06&";
      script.text =
      document.head.appendChild(script);
      console.log("DOM fully loaded and parsed");
    });
     `
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
   
    }
    `
}

function sent_adb_button_click(){
  if (localStorage.getItem("isAdBlockEnabled") !== "true") return''

    return`
    let skipAdButtons = document.getElementsByClassName("ytp-skip-ad-button");
    if (skipAdButtons.length > 0) {
      skipAdButtons[0].click();
    }
    `
}

function sent_nonstop(){
  if (localStorage.getItem("isNonstopEnabled") !== "true") return''

    return`
    // 'ytd-popup-container' for yt
    // 'ytmusic-popup-container' for ytm
    function removeContinueWatchingPrompt() {
        document.querySelector('.ytd-popup-container').click();
    }
    setInterval(removeContinueWatchingPrompt, 30000);
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
    setInterval(setResolution, 30000);
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
      };
      // Latency time affects memory size 
      // (callback 500- timer 1000 memory 1.1GB)
      // (callback 750- timer 2000 memory 0.7GB)
      // watchout when you setting
      const throttledCallback = throttle(callback, 500);
      const observer = new MutationObserver(throttledCallback);
      const target = document.documentElement;
    
      if (target) {
        observer.observe(target, { attributes: true, childList: true, subtree: true });
      } 
      setInterval(() => {
          callback(); 
      }, 2000);
    });
    `
}
 


export {
    sent_windows_info,
    sent_xhr_fetch, 
    sent_adb_button_click, 
    sent_disable_element, 
    sent_nonstop, 
    sent_hd1080,
    sent_f11_event,
    sent_MutationObserver_event

}