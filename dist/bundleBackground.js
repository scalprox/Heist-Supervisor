(()=>{let e;chrome.storage.local.get(["adress"],(function(t){e=t}));const t=/https:\/\/api\.theheist\.game\/nft\/robbers\/wallet-top-performing\/([\w]+)/;chrome.webRequest.onCompleted.addListener((o=>{const n=o.url.match(t);n&&n[1]&&(e=n[1],console.log(e),chrome.tabs.query({active:!0,currentWindow:!0},(function(t){chrome.tabs.sendMessage(t[0].id,{type:"dataFromBackground",adress:e})})))}),{urls:["*://*.theheist.game/*"]}),chrome.runtime.onMessage.addListener((function(e,t,o){"openNotifHTML"===e.action&&(chrome.windows.create({url:chrome.runtime.getURL("./public/notification.html"),type:"popup",width:388,height:568}),chrome.runtime.onMessage.addListener((function(e,t,o){if("walletAdress"===e.type){const t=e.data;chrome.runtime.sendMessage({type:"notification",adress:t})}})))}))})();