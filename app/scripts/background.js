let currentAdress;
let alreadyOpen = false;
chrome.storage.local.get(["adress"], function (result) {
  currentAdress = result;
});
const walletAddressRegex =
  /https:\/\/api\.theheist\.game\/nft\/robbers\/wallet-top-performing\/([\w]+)/;

chrome.webRequest.onCompleted.addListener(
  (details) => {
    const match = details.url.match(walletAddressRegex);

    if (match && match[1]) {
      currentAdress = match[1];
      console.log(currentAdress);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "dataFromBackground",
          adress: currentAdress,
        });
      });
    }
  },
  { urls: ["*://*.theheist.game/*"] }
);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "openNotifHTML") {
    if (!alreadyOpen) {
      alreadyOpen = true;
      chrome.windows.getCurrent(function (currentWindow) {
        var leftPosition = currentWindow.left + (currentWindow.width - 388); // 300 est la largeur de la nouvelle fenêtre
        var topPosition = currentWindow.top;
        chrome.windows.create({
          url: chrome.runtime.getURL("./public/notification.html"),
          type: "popup",
          width: 388,
          height: 568,
          top: topPosition,
          left: leftPosition,
        });
        setTimeout(() => {
          alreadyOpen = false;
        }, 1000);
      });
    }

    chrome.runtime.onMessage.addListener(
      function (message, sender, sendResponse) {
        if (message.type === "walletAdress") {
          const wallet = message.data;
          chrome.runtime.sendMessage({
            type: "notification",
            adress: wallet,
          });
        }
      }
    );
  }
  if (message.action === "trackAuction") {
    if (!alreadyOpen) {
      alreadyOpen = true;
      setTimeout(() => {
        alreadyOpen = false;
      }, 1000);
      const data = {
        plotId: message.plotId,
        number: message.number,
        userWallet: message.userWallet,
      };
      chrome.windows.getCurrent(function (currentWindow) {
        // Calculer la position en haut à droite
        var leftPosition = currentWindow.left + (currentWindow.width - 388); // 300 est la largeur de la nouvelle fenêtre
        var topPosition = currentWindow.top;
        chrome.windows.create({
          url: chrome.runtime.getURL("./public/trackAuctionPage.html"),
          type: "popup",
          width: 388,
          height: 568,
          top: topPosition,
          left: leftPosition,
        });
        chrome.runtime.onMessage.addListener(
          (message, sender, sendResponse) => {
            if (message.type === "requestData") {
              sendResponse(data);
            }
          }
        );
      });
    }
  }
});
