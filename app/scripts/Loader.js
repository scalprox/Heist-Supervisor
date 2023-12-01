let notif = new Audio(chrome.runtime.getURL("app/assets/notif.mp3"));
const csp = "script-src 'self'; object-src 'self'";
let check = false;
// Créez une balise <meta> pour injecter la CSP dans la page
const meta = document.createElement("meta");
meta.httpEquiv = "Content-Security-Policy";
meta.content = csp;
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "dataFromBackground") {
    // Transmettez la donnée au script injecté
    let event = new CustomEvent("getAdress", { detail: message.adress });
    window.dispatchEvent(event);
  }
});
window.addEventListener(
  "message",
  function (event) {
    if (event.source != window) return;

    if (event.data.type && event.data.type == "openInvitePopup") {
      console.log("received loader");
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
    }
  },
  false
);
window.addEventListener("notification", function (event) {
  setTimeout(() => {
    notif.play();
  }, 600);
});

// Ajoutez la balise <meta> au head de la page
let interval = setInterval(() => {
  const head = document.querySelector("head");
  if (head) {
    clearInterval(interval);
    document.head.appendChild(meta);
    const HeistSupervisor = document.createElement("script");
    HeistSupervisor.src = chrome.runtime.getURL(
      "dist/bundleHeistSupervisor.js"
    );
    document.head.appendChild(HeistSupervisor);
    document.head.appendChild(style);
  }
}, 20);

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
