let notif = new Audio(chrome.runtime.getURL("app/assets/notif.mp3"));
let isLogged = false;
const csp = "script-src 'self'; object-src 'self'";
let check = false;
const meta = document.createElement("meta");
meta.httpEquiv = "Content-Security-Policy";
meta.content = csp;

if (window.location.href.includes("https://theheist.game/")) {
  // get wallet retrieved wallet adress from service worker and send it to HeistSupervisor.js
  // check if user is logged and launch script if true
  chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
      if (message.type === "userAuth" && isLogged === false) {
        isLogged = true;
        const head = document.querySelector("head");
        if (head) {
          document.head.appendChild(meta);
          const HeistSupervisor = document.createElement("script");
          HeistSupervisor.src = chrome.runtime.getURL(
            "dist/bundleHeistSupervisor.js"
          );
          document.head.appendChild(HeistSupervisor);
          document.head.appendChild(style);
        }
      }
      if (message.type === "adressFromBack") {
        let event = new CustomEvent("getAdress", { detail: message.adress });
        window.dispatchEvent(event);
      }
    }
  );

  // ask service worker to open invitationPage and transmit wallet adress to invit
  window.addEventListener(
    "message",
    function (event) {
      if (event.source != window) return;
      if (event.data.type && event.data.type == "openInvitePopup") {
        chrome.runtime.sendMessage({ action: "openNotifHTML" });
        let dataFromLocalStorage = localStorage.getItem("adressToInvite");
        if (dataFromLocalStorage) {
          this.setTimeout(() => {
            chrome.runtime.sendMessage({
              type: "walletAdress",
              data: dataFromLocalStorage,
            });
          }, 500);
        }
      } else if (event.data.type && event.data.type == "firebaseUserData") {
        const uid = event.data.userData.uid;
        const hash = event.data.userData.hash;
        chrome.storage.local.set({ uid: uid });
        chrome.storage.local.set({ hash: hash });
      }
    },
    false
  );

  // if an ingame notification appear ( trade request / ambush / capture...) play a notification sound
  window.addEventListener("notification", function (event) {
    setTimeout(() => {
      notif.play();
    }, 600);
  });

  // change scroll bar style in game
  const style = document.createElement("style");
  style.textContent = `
::-webkit-scrollbar {
  width: 5px; 
  height: 100%; 
}
::-webkit-scrollbar-thumb {
  background: #999999; 
  border-radius: 6px; 
}
::-webkit-scrollbar-thumb:hover {
  background: #535151;
}
::-webkit-scrollbar-track {
  background: #fff; 
  border-radius: 6px; 
}
::-webkit-scrollbar-button {
  display: none;
}
`;
  window.addEventListener("ready", function () {
    try {
      chrome.storage.sync.get(null, function (data) {
        let keys = Object.keys(data);
        let switchData = [];
        for (let i = 0; i < keys.length; i++) {
          switchData.push(data["switchState" + i]);
        }
        let event = new CustomEvent("miscOptions", { detail: switchData });
        window.dispatchEvent(event);
      });
    } catch (error) {
      console.error(error);
    }
  });
} else if (
  window.location.href.startsWith("http://127.0.0.1:") ||
  window.location.href.includes("https://heist-supervisor.firebaseapp.com/")
) {
  window.addEventListener(
    "message",
    function (event) {
      if (event.source != window) return;
      if (event.data.type && event.data.type == "firebaseUserData") {
        const { uid, hash, publicAdress } = event.data.userData;
        chrome.storage.local.set({ uid: uid });
        chrome.storage.local.set({ hash: hash });
        chrome.storage.local.set({ publicAdress: publicAdress });
      }
    },
    false
  );
  const head = document.querySelector("head");
  if (head) {
    document.head.appendChild(meta);
    const getDataScript = document.createElement("script");
    getDataScript.src = chrome.runtime.getURL("dist/bundlegetDataFromWEB.js");
    document.head.appendChild(getDataScript);
  }
}
