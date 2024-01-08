/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!****************************************!*\
  !*** ./app/scripts/HeistSupervisor.js ***!
  \****************************************/
/**   Known bugs
 * in vault need to stop interval if player dont own nft
 */
let withdrawBtnPath;
let xhrGangData;
let xhrActualPlotAuction;
let xhrNotificationData;
let userWallet;
let getMoneyId;
let getMoneyIdLoc;
let newLiChimp;
let newLiTang;
let newLiStat;
let CocoTabsClicked = false;
let Amount;
let isCocoSelected = false;
let isNanaSelected = false;
let inHub = false;
let roundRaffle1;
let roundRaffle2;
let hubHtml = false;
let chimpTang;
let gorilla;
const walletAddressRegex =
  /https:\/\/api\.theheist\.game\/nft\/robbers\/wallet-top-performing\/([\w]+)/;

const locTarget = document.querySelector(
  "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper.Dialog_scrollPaper__BgbbA.css-ekeie0 > div > div"
);
const targetElement = document.querySelector(
  "body > div.MuiDialog-root.location_root__6XsDH.MuiModal-root.css-126xj0f"
);

(function isUserLogged() {
  let originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("load", function () {
      if (
        this.responseURL.includes("https://api.theheist.game/nft/my-robbers") &&
        this.status === 200
      ) {
        initFunction2();
        const title = searchElement("The heist game").parentElement;
        const h2 = document.createElement("h2");
        h2.style.color = "#fff";
        h2.textContent = "supervised";
        title.appendChild(h2);
      }
    });
    originalSend.apply(this, arguments);
  };
})();

function searchPlaceholder(query) {
  const elements = document.querySelectorAll(
    "input[placeholder], textarea[placeholder]"
  );
  for (let elem of elements) {
    if (elem.placeholder === query) {
      return elem;
    }
  }
  return null;
}

//  ↓↓ auto search element in DOM to prevent path update issue ↓↓
function searchElement(query) {
  const element = document.querySelectorAll("button, h3, h2, h1, span, div, p");
  for (let elem of element) {
    if (elem.textContent.trim() === query) {
      return elem;
    }
  }
  return null;
}

function initFunction2() {
  let intervalGang = setInterval(() => {
    let gangButton = searchElement("Gangs");
    if (gangButton) {
      clearInterval(intervalGang);

      gangMenu(gangButton);
    }
  }, 50);

  let intervalLocation = setInterval(() => {
    let cityPath = searchElement("City");
    let hub = searchElement("Hub");
    if (cityPath) {
      const citySwitch = cityPath.parentElement.children[1];
      if (citySwitch) {
        if (!citySwitch.className.includes("_toggle--active")) {
          miscOptions();
        }
        startObservingHub();
        startObservingWithdraw();
        clearInterval(intervalLocation);
        citySwitch.addEventListener("click", () => {
          let interval = setInterval(() => {
            let safeHouse = searchElement("Safehouse");
            if (
              !citySwitch.className.includes("_toggle--active") &&
              safeHouse
            ) {
              clearInterval(interval);
              miscOptions();
              startObservingHub();
            } else if (citySwitch.className.includes("_toggle--active")) {
              clearInterval(interval);
            }
          }, 50);
        });
      }
    }
  }, 50);

  let intervalChat = setInterval(() => {
    let chatPath = searchElement("Heist Chat");
    if (chatPath) {
      clearInterval(intervalChat);
      const elementToObserve = chatPath.parentElement.children[0];
      const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            const currentClasses = elementToObserve.className;
            if (!currentClasses.includes("undefined")) {
              sendInviteInGame();
            }
          }
        }
      });
      const observerConfig = {
        attributes: true,
        attributeFilter: ["class"],
      };
      observer.observe(elementToObserve, observerConfig);
    }
  }, 50);

  let intervalNotif = setInterval(() => {
    let notifPath = searchElement("The heist game");
    if (notifPath) {
      clearInterval(intervalNotif);
      notifTracker();
      notifSound();
    }
  }, 50);
}

//  ↓↓ add chat request button in profile when you click on someone profile ↓↓
function addInviteButtonInProfile() {
  window.addEventListener("getAdress", function (event) {
    if (event.detail) {
      const clientWalletAdress = event.detail;
      const tradeQuerry = searchElement("TRADE");
      const injectButtonPath = tradeQuerry.parentElement;
      const nameClass = tradeQuerry.className;
      if (document.getElementById("sendInvite")) {
        document.getElementById("sendInvite").value = clientWalletAdress;
      } else {
        const newButton = document.createElement("button");
        newButton.id = "sendInvite";
        newButton.className = nameClass;
        newButton.textContent = "Invite To Dm";
        newButton.style.marginBottom = "-16px";
        newButton.value = clientWalletAdress;
        injectButtonPath.insertBefore(newButton, injectButtonPath.firstChild);
      }

      const sendButton = document.getElementById("sendInvite");
      sendButton.addEventListener("click", () => {
        localStorage.setItem("adressToInvite", clientWalletAdress);
        window.postMessage({ type: "openInvitePopup" }, "*");
      });
    }
  });
}

// ↓↓  get client wallet adress for chating in the Heist Supervisor Popup ↓↓
function sendInviteInGame() {
  const elem1 = document.getElementById("chat-history-bottom-position");
  const profilePath =
    elem1.parentElement.children[2].children[0].children[0].children[0];
  const childElem = profilePath.parentElement.parentElement;
  for (let i = 0; i < childElem.children.length; i++) {
    childElem.children[i].children[0].addEventListener(
      "click",
      () => {
        addInviteButtonInProfile();
      },
      {
        once: true,
      }
    );
  }
}

function maxWithdraw() {
  // ↓↓ withdraw tab path ↓↓
  let interval = setInterval(() => {
    const getCocoTotal = withdrawBtnPath.children[0].children[2].children[1];
    const getNanaTotal = withdrawBtnPath.children[0].children[0].children[1];
    const elem1 = searchElement("Amount:");
    if (elem1) {
      clearInterval(interval);
      const placeHolder = elem1.firstElementChild.firstElementChild;
      const depositButtonPath = elem1.parentElement.children[5];
      const divParent = elem1.parentElement;
      const buttonClass = depositButtonPath.classList;
      if (depositButtonPath && !document.getElementById("maxButton")) {
        const maxButton = document.createElement("button");
        maxButton.classList = buttonClass;
        maxButton.id = "maxButton";
        maxButton.textContent = "Max Amount";
        maxButton.style.marginBottom = "10px";
        divParent.insertBefore(maxButton, depositButtonPath);
      }
      let withdrawLoc = elem1.parentElement.parentElement;
      withdrawLoc.addEventListener(
        "click",
        () => {
          setTimeout(maxWithdraw, 200);
          return;
        },
        { once: true }
      );
      setTimeout(() => {
        //  ↓↓ getMoneyIdLoc check if nana or coco is selected in withdraw menu ↓↓
        getMoneyIdLoc =
          elem1.parentElement.children[2].firstElementChild.firstElementChild;
        getMoneyId = getMoneyIdLoc.getAttribute("aria-label");
      }, 100);
      if (getCocoTotal) {
        let arialLabelCoco = getCocoTotal.getAttribute("aria-label");
        let numberMatchCoco = arialLabelCoco.match(/([\d,]+)/);

        if (numberMatchCoco) {
          Amount = numberMatchCoco[1];
        }
      }
      if (getNanaTotal) {
        let arialLabelNana = getNanaTotal.getAttribute("aria-label");
        let numberMatchNana = arialLabelNana.match(/([\d,]+)/);

        if (numberMatchNana) {
          Amount = numberMatchNana[1];
        }
      }

      setTimeout(() => {
        document.getElementById("maxButton").addEventListener("click", () => {
          let inputEvent = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          );
          inputEvent.set.call(placeHolder, Amount.replace(/\./g, ""));
          placeHolder.dispatchEvent(new Event("input", { bubbles: true }));
        });
        if (getMoneyId.includes("COCO")) {
          isCocoSelected = true;
          const match = getMoneyId.match(/(\d|,)+/);
          const matchAmount = match[0];
          let cleanedCoco = matchAmount.replace(/,/g, ".");
          Amount = cleanedCoco;
          getMoneyIdLoc.textContent = Amount;
        }
        if (getMoneyId.includes("NANA")) {
          isNanaSelected = true;
          const match = getMoneyId.match(/(\d|,)+/);
          const matchAmount = match[0];
          let cleanedNana = matchAmount.replace(/,/g, ".");
          Amount = cleanedNana;
          getMoneyIdLoc.textContent = Amount;
        }
      }, 200);
    }
  }, 100);
}

function LocationStats() {
  if (inHub === true) {
    let badEventPercent = 0;
    const updateLiStats = document.querySelector("#STATS");
    const updateLiChimp = document.querySelector("#percentChimp");
    const updateLiTang = document.querySelector("#percentTang");
    const updateLiGorilla = document.querySelector("#rillaStats");

    //   ↓↓ path to to the top list of location ( safe House, federal reserve....) in the location menu ↓↓
    const elem1 = searchElement("Event table");
    try {
      let myChimps = searchElement("My Chimps");
      if (!myChimps) myChimps = searchElement("My Orangutans");
      if (!myChimps) myChimps = searchElement("My Gorillas");

      const topList =
        myChimps.parentElement.parentElement.previousElementSibling;
      const CocoTabsList =
        elem1.parentElement.parentElement.parentElement.parentElement
          .children[0].children[0].children[0].children[0];

      if (CocoTabsList) {
        CocoTabsList.addEventListener("click", function handleClick() {
          if (!CocoTabsClicked) {
            let interval1 = setInterval(() => {
              const locQuerry = searchElement("Location Stats");
              if (locQuerry) {
                clearInterval(interval1);
                topList.removeEventListener("click", reloadSelectApe);
                LocationStats();
                return;
              }
            }, 50);

            CocoTabsList.removeEventListener("click", handleClick);
            CocoTabsClicked = true;
          }
        });
      }
      //  ↓↓ path to the location ul container ↓↓
      const locQuerry = searchElement("Location Stats");
      const getUl = locQuerry.parentElement.parentElement.children[2];
      getUl.style.maxHeight = "100%";
      //  ↓↓ path to coco emission value ↓↓
      const CocoEmissionsLoc = getUl.children[3].children[1];
      //  ↓↓ path of number of rilla value ↓↓
      const RillaLoc = getUl.children[2].children[1];
      //  ↓↓ path to number of Tang value ↓↓
      const TangLoc = getUl.children[1].children[1];
      //  ↓↓ path to number of Chimp value ↓↓
      const ChimpDoc = getUl.children[0].children[1];
      const nameClassLi = getUl.children[1].className;
      const nameClassValue = ChimpDoc.className;
      const nameClassLabel = getUl.children[0].children[2].className;
      const newLiGorilla = document.createElement("li");
      const newLiStat = document.createElement("li");
      const newLiChimp = document.createElement("li");
      const newLiTang = document.createElement("li");
      const badEventUl = elem1.parentElement.children[3];
      for (let i = 0; i < badEventUl.children.length; i++) {
        const eventPercent =
          badEventUl.children[i].firstElementChild.children[1].children[2]
            .firstElementChild;
        let number = parseFloat(eventPercent.textContent.replace("%", ""));
        badEventPercent = badEventPercent + number;
      }
      if (ChimpDoc) {
        const CocoToNumber = CocoEmissionsLoc.textContent;
        const Coco = parseInt(CocoToNumber) * 1000;
        let Tangtxt = TangLoc.textContent;
        let Chimptxt = ChimpDoc.textContent;
        let Rillatxt = RillaLoc.textContent;
        let Rilla = parseInt(Rillatxt);
        let Tang = parseInt(Tangtxt);
        let Chimp = parseInt(Chimptxt);

        const apePerRilla = Math.round((Tang + Chimp) / Rilla);
        const tangPercentage = Math.round((Tang / (Tang + Chimp)) * 100);
        const chimpPercentage = Math.round((Chimp / (Tang + Chimp)) * 100);
        const cocoDistribution = Math.floor(Coco / (Tang + Chimp));
        const estHourlyRilla = Math.round(
          (badEventPercent / 100) * apePerRilla * cocoDistribution
        );
        if (updateLiGorilla) {
          updateLiGorilla.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
          <span class="${nameClassValue}">${estHourlyRilla}</span>
          <span class="${nameClassLabel}">Est. Hourly $COCO per Gorilla</span>  
    `;
        } else {
          newLiGorilla.className = nameClassLi;
          newLiGorilla.id = "rillaStats";
          newLiGorilla.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
          <span class="${nameClassValue}">${estHourlyRilla}</span>
          <span class="${nameClassLabel}">Est. Hourly $COCO per Gorilla</span>  
    `;
        }
        if (updateLiTang) {
          updateLiTang.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
      <span class="${nameClassValue}">${tangPercentage}%</span>
      <span class="${nameClassLabel}">Of Tangs</span>  
`;
        } else {
          newLiTang.className = nameClassLi;
          newLiTang.id = "percentTang";
          newLiTang.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
        <span class="${nameClassValue}">${tangPercentage}%</span>
        <span class="${nameClassLabel}">Of Tangs</span>  
        `;
        }
        if (updateLiChimp) {
          updateLiChimp.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
      <span class="${nameClassValue}">${chimpPercentage}%</span>
      <span class="${nameClassLabel}">Of Chimps</span>  
`;
        } else {
          newLiChimp.className = nameClassLi;
          newLiChimp.id = "percentChimp";
          newLiChimp.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
        <span class="${nameClassValue}">${chimpPercentage}%</span>
        <span class="${nameClassLabel}">Of Chimps</span>  
        `;
        }
        if (updateLiStats) {
          updateLiStats.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
        <span class="${nameClassValue}">${cocoDistribution}</span>
        <span class="${nameClassLabel}">Est. Hourly $COCO per TANG/CHIMP</span>
      `;
        } else {
          newLiStat.className = nameClassLi;
          newLiStat.id = "STATS";
          newLiStat.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
        <span class="${nameClassValue}">${cocoDistribution}</span>
        <span class="${nameClassLabel}">Est. Hourly $COCO per TANG/CHIMP</span>
      
      `;
        }
        if (getUl) {
          getUl.appendChild(newLiStat);
          getUl.appendChild(newLiChimp);
          getUl.appendChild(newLiTang);
          getUl.appendChild(newLiGorilla);
        }
        CocoTabsClicked = false;
      }
      const selectApeFunction = miscOptions("locations");
      selectApeFunction();

      function reloadSelectApe() {
        setTimeout(selectApeFunction, 100);
      }

      topList.addEventListener("click", reloadSelectApe);
    } catch (error) {
      console.error(error);
    }
  }
}

function startObservingHub() {
  const elementToObserve = document.querySelector("#root");
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-hidden"
      ) {
        const isAriaHiddenTrue =
          mutation.target.getAttribute("aria-hidden") === "true";

        if (isAriaHiddenTrue) {
          inHub = true;
          let interval = setInterval(() => {
            const checkLoc = searchElement("Location Stats");
            const checkHub = searchElement("Blackmarket");
            const landPool = searchElement("LAND POOL");
            const auction = searchElement("Your bid");
            if (checkLoc) {
              clearInterval(interval);
              setTimeout(LocationStats, 700);
            }
            if (checkHub) {
              clearInterval(interval);
              const loopCheck = searchElement("Blackmarket");
              const ulButton = loopCheck.parentElement.parentElement;
              let interval1 = setInterval(() => {
                if (ulButton.children[2]) {
                  clearInterval(interval1);
                  checkHubTab();
                }
              }, 50);
            }
            if (auction) {
              clearInterval(interval);
            }
            if (landPool) {
              clearInterval(interval);
            }
          }, 100);
        } else {
          const path = searchElement("Gangs");
          setTimeout(() => {
            gangMenu(path);
          }, 700);
          inHub = false;
        }
      }
    }
  });
  const observerConfig = { attributes: true, attributeFilter: ["aria-hidden"] };
  observer.observe(elementToObserve, observerConfig);
}
let activeTab;
function checkHubTab() {
  if (document.body.style.overflow != "hidden") {
    return;
  }
  const loopCheck = searchElement("Blackmarket");
  const ulButton = loopCheck.parentElement.parentElement;

  try {
    for (let i = 0; i < ulButton.children.length; i++) {
      const li = ulButton.children[i];

      li.removeEventListener("click", clicked);

      if (
        li.firstElementChild.className.includes("--active") &&
        activeTab != li
      ) {
        activeTab = li;
        functionHubTab[i]();
        if (i === 1) {
          const selectApeFunction = miscOptions("vault");
          selectApeFunction();
        }
      } else if (
        li.firstElementChild.className.includes("--active") &&
        activeTab == li
      ) {
        setTimeout(() => {
          clicked();
        }, 100);
        return;
      }
      if (!li.firstElementChild.className.includes("--active")) {
        li.addEventListener("click", clicked);
      }
    }
  } catch (error) {
    console.error(error);
  }

  function clicked() {
    for (let n = 0; n < ulButton.children.length; n++) {
      ulButton.children[n].removeEventListener("click", clicked);
    }
    checkHubTab();
  }
}

const functionHubTab = [
  hubTab0,
  hubTab1,
  hubTab2,
  hubTab3,
  hubTab4,
  hubTab5,
  hubTab6,
];

function hubTab0() {
  // social
  console.log("social");
  let interval1 = setInterval(() => {
    const elem1 = searchElement("ORANGUTANS COMING");
    if (elem1) {
      try {
        const elem2 =
          elem1.parentElement.parentElement.parentElement.children[1]
            .children[1].children[1].children[1];
        if (elem2) {
          const elem3 = elem2.firstElementChild.firstElementChild;
          if (elem3) {
            clearInterval(interval1);
            setTimeout(nftRecruitment, 700);
            setTimeout(raffleTicket, 700);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, 50);
}

function reloadHubTab1() {
  hubTab1();
  return;
}

function hubTab1() {
  //  vault
  console.log("restart");
  let interval = setInterval(() => {
    const path = searchElement("Show Info").parentElement.nextElementSibling;
    if (document.body.style.overflow != "hidden") {
      return;
    }
    if (path) {
      const nftUl = path.children[1];
      if (nftUl) {
        const checkChange =
          path.firstElementChild.firstElementChild.children[1];
        if (checkChange) {
          clearInterval(interval);

          checkChange.removeEventListener("click", reloadHubTab1);
          checkChange.addEventListener("click", reloadHubTab1);
          try {
            for (let i = 0; i < nftUl.children.length; i++) {
              if (nftUl.children.length == 0) {
                break;
              }
              const nftLi = nftUl.children[i];
              const upgradeBtn =
                nftLi.firstElementChild.children[2].firstElementChild;
              upgradeBtn.addEventListener("click", maxUpgrade);
            }
          } catch (error) {
            console.error(error);
          }

          function maxUpgrade() {
            for (let n = 0; n < nftUl.children.length; n++) {
              nftUl.children[n].removeEventListener("click", maxUpgrade);
            }
            let interval = setInterval(() => {
              const path = searchElement("Each Point Increases yield");
              if (path) {
                clearInterval(interval);
                const ulUpgrade =
                  path.parentElement.parentElement.parentElement.parentElement;
                for (let i = 0; i < ulUpgrade.children.length; i++) {
                  if (
                    document.getElementById("maxBtn" + i) ||
                    ulUpgrade.children[i].className.includes("prestige")
                  ) {
                    continue;
                  }
                  const liUpgrade = ulUpgrade.children[i];
                  const btnContainer = liUpgrade.children[1];
                  const btnClass =
                    btnContainer.children[2].children[1].className;
                  const button = document.createElement("button");
                  button.id = "maxBtn" + i;
                  button.className = btnClass;
                  button.textContent = "MAX";
                  button.style.width = "153px";
                  btnContainer.insertBefore(button, btnContainer.children[3]);
                  document
                    .getElementById("maxBtn" + [i])
                    .addEventListener("click", () => {
                      let inputEvent = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        "value"
                      );
                      let placeHolder =
                        liUpgrade.children[1].children[2].firstElementChild
                          .children[1];
                      inputEvent.set.call(placeHolder, 99);
                      placeHolder.dispatchEvent(
                        new Event("input", { bubbles: true })
                      );
                    });
                }
              }
            }, 50);
          }
        }
      }
    }
  }, 100);

  console.log("vault");
}

function hubTab2() {
  //  market
  console.log("market");
}

function hubTab3() {
  //  blackMarket
  console.log("bm");
}

function hubTab4() {
  //  rewards
  console.log("reward");
}

function hubTab5() {
  //  cosmetic
  console.log("cosmetic");
}

function hubTab6() {
  //  cosmetic store
}

function startObservingWithdraw() {
  //   ↓↓ location of the withdraw / deposit Tab ↓↓
  const elem1 = searchElement("Gangs");
  const elem2 = elem1.parentElement;
  const elem3 = elem2.children[1];
  const elementToObserve = elem3.firstElementChild;
  withdrawBtnPath = elementToObserve;

  const observerCallback = (mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentClasses = elementToObserve.className;
        const containsButtonBlack = currentClasses.includes("_button--black");
        if (!containsButtonBlack) {
          withdrawClick = false;
        } else {
          maxWithdraw();
        }
      }
    });
  };
  const observer = new MutationObserver(observerCallback);
  const observerConfig = { attributes: true, attributeFilter: ["class"] };
  observer.observe(elementToObserve, observerConfig);
}

function nftRecruitment() {
  let chancePerTicket;
  const container = document.querySelector(
    "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._mintContent_1tyqk_258 > div._mintContentFooter_1tyqk_308"
  );
  if (container) {
    const contractSold = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._mintContent_1tyqk_258 > div._mintContentFooter_1tyqk_308 > div:nth-child(1) > div"
    );
    const totalRecruit = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._mintContent_1tyqk_258 > div._mintContentHeader_1tyqk_287 > div:nth-child(2) > div"
    );
    chancePerTicket =
      (parseFloat(totalRecruit.textContent) /
        parseFloat(contractSold.textContent)) *
      100;

    const newElem = document.createElement("div");
    newElem.className = "_mintContentHeaderStat_1tyqk_337";
    newElem.innerHTML = `
    <p class="_mintContentLabel_1tyqk_378">chance per contract</p>
    <div class="_mintContentHeaderStatValue_1tyqk_398">${chancePerTicket.toFixed(
      2
    )}%</div>
    `;
    container.insertBefore(newElem, container.children[1]);
    const hubButtonList = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._navigation_75try_27 > ul > li:nth-child(1)"
    );
    hubButtonList.addEventListener(
      "click",
      () => {
        setTimeout(nftRecruitment, 500);
        setTimeout(raffleTicket, 500);
        setTimeout(LocationStats, 500);
      },
      { once: true }
    );
  }
}

function raffleTicket() {
  if (inHub === true) {
    //  ↓↓ path of the raffel1 raffle2 ( all the tab) ↓↓
    const elem1 = searchElement("ORANGUTANS COMING");
    const elem2 =
      elem1.parentElement.parentElement.parentElement.children[1].children[1]
        .children[1].children[1].firstElementChild;

    const tab1 = elem2.children[0];
    const tab2 = elem2.children[1];
    const raffleLoc1 = tab1.children[0].children[0];
    const raffleLoc2 = tab2.children[0].children[0];
    //  ↓↓path where total item in the raffle  ↓↓
    const qtyRaffle1 = raffleLoc1.children[1];
    const qtyRaffle2 = raffleLoc2.children[1];
    const nameClass = qtyRaffle1.className;
    //  ↓↓ path where total ticket purchased by all players ↓↓
    const qtyTicket1 =
      tab1.children[0].children[3].children[0].children[0].children[1];
    const qtyTicket2 =
      tab2.children[0].children[3].children[0].children[0].children[1];
    if (qtyRaffle1) {
      let cleanRaffle1 = qtyRaffle1.textContent;
      let matche1 = cleanRaffle1.match(/\d+/);
      let raffle1 = parseInt(matche1);
      let cleanRaffle2 = qtyRaffle2.textContent;
      let matche2 = cleanRaffle2.match(/\d+/);
      let raffle2 = parseInt(matche2);
      let cleanedTicket1 = parseFloat(qtyTicket1.textContent);
      let cleanedTicket2 = parseFloat(qtyTicket2.textContent);
      let raffleChance1 = (raffle1 / cleanedTicket1) * 100;
      let raffleChance2 = (raffle2 / cleanedTicket2) * 100;
      roundRaffle1 = raffleChance1.toFixed(3);
      roundRaffle2 = raffleChance2.toFixed(3);
    }

    if (raffleLoc1) {
      if (hubHtml === false) {
        const div1 = document.createElement("div");
        div1.className = nameClass;
        div1.id = "raffle1";
        div1.textContent = roundRaffle1 + "% chance per ticket";
        if (!document.getElementById("raffle1")) {
          raffleLoc1.appendChild(div1);
        }

        const div2 = document.createElement("div");
        div2.className = nameClass;
        div2.id = "raffle2";
        div2.textContent = roundRaffle2 + "% chance per ticket";
        if (!document.getElementById("raffle2")) {
          raffleLoc2.appendChild(div2);
        }
      }
    }
  }
}

function notifSound() {
  let event = new CustomEvent("notification");
  const elem1 = searchElement("The heist game");
  const notifCounter = elem1.parentElement.children[0].children[1];
  let notif = parseFloat(notifCounter.textContent);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "childList" ||
        mutation.type === "characterxhrNotificationData"
      ) {
        notif = parseFloat(notifCounter.textContent);
        if (notif > 0) {
          window.dispatchEvent(event);
        }
      }
    });
  });
  const config = {
    childList: true,
    characterxhrNotificationData: true,
    subtree: true,
  };
  observer.observe(notifCounter, config);
}

function notifTracker() {
  var oldXHR = window.XMLHttpRequest;

  function newXHR() {
    let realXHR = new oldXHR();

    realXHR.onreadystatechange = function () {
      if (realXHR.readyState == 4 && realXHR.status == 200) {
        const gangUrlRegex = /https:\/\/api\.theheist\.game\/gang\/\d+$/;
        if (gangUrlRegex.test(realXHR.responseURL)) {
          xhrGangData = JSON.parse(realXHR.responseText);
        }
        if (
          realXHR.responseURL.includes(
            "https://api.theheist.game/notification/history?offset=0&limit=10"
          )
        ) {
          xhrNotificationData = JSON.parse(realXHR.responseText);
        }
        if (
          realXHR.responseURL.includes(
            "https://api.theheist.game/notification/history?offset=10&limit=10"
          )
        ) {
          addNewNotif(JSON.parse(realXHR.responseText));
          setTimeout(openNotifProfile, 1000);
        }
        if (realXHR.responseURL.includes("https://api.theheist.game/auth/me")) {
          let response = JSON.parse(realXHR.responseText);
          userWallet = response.id;
        }
      }
    };
    return realXHR;
  }
  window.XMLHttpRequest = newXHR;
  const elem1 = searchElement("The heist game");
  const elementToObserve = elem1.parentElement.children[0].children[0];

  const observerCallback = (mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentClasses = elementToObserve.className;
        const classChange = currentClasses.includes("_active");

        if (classChange) {
          setTimeout(openNotifProfile, 1000);
        }
      }
    });
  };
  const observer = new MutationObserver(observerCallback);
  const observerConfig = { attributes: true, attributeFilter: ["class"] };
  observer.observe(elementToObserve, observerConfig);
}

function openNotifProfile() {
  const notifListPath = document.querySelector(
    "#notification-scroller > div > div"
  ).children;
  for (let i = 0; i < notifListPath.length; i++) {
    let item = notifListPath[i];
    item.addEventListener("click", () => {
      let wallet = xhrNotificationData[i].walletId;
      searchPlayer(wallet, xhrNotificationData[i].wallet.username);
    });
  }
}

function addNewNotif(newNotif) {
  let notifIndex = Object.keys(xhrNotificationData).length;
  newNotif.forEach((item, index) => {
    xhrNotificationData[notifIndex + index] = item;
  });
}

function searchPlayer(walletAdress, playerName) {
  const hubBtn = searchElement("Hub");
  hubBtn.click();
  let interval = setInterval(() => {
    const social = searchElement("Social");
    if (social) {
      clearInterval(interval);
      social.click();
      let checkLoad = setInterval(() => {
        const searchBtn = searchElement("Player search").firstElementChild;
        if (searchBtn) {
          clearInterval(checkLoad);
          searchBtn.click();
          let checkLoad2 = setInterval(() => {
            const placeHolder = searchPlaceholder("Player Search");
            if (placeHolder) {
              clearInterval(checkLoad2);
              let inputEvent = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
              );
              inputEvent.set.call(placeHolder, walletAdress);
              placeHolder.dispatchEvent(new Event("input", { bubbles: true }));
              let checkLoad3 = setInterval(() => {
                const playerPath = document.querySelector(
                  "#player-scroller > div.infinite-scroll-component__outerdiv > div > div > div"
                );
                if (playerPath) {
                  if (playerPath.textContent == playerName) {
                    clearInterval(checkLoad3);
                    playerPath.click();
                    addInviteButtonInProfile();
                  }
                }
              }, 30);
            }
          }, 30);
        }
      }, 30);
    }
  }, 30);
}

function howManyLeftClass(element) {
  const classes = element.className.split(" ");
  const motif = /_left/;
  let count = 0;

  classes.forEach((classe) => {
    if (motif.test(classe)) {
      count++;
    }
  });
  return count;
}

function gangMenu(path) {
  const gangBtn = path;

  if (gangBtn) {
    gangBtn.addEventListener(
      "click",
      () => {
        let interval = setInterval(() => {
          // ↓↓ retrieve element to observe ( left gang tab) ↓↓
          let elementToObserve;
          const child = document.getElementById("gang-scroller");
          const membersPath = searchElement("MEMBERS");
          let closeBtn;
          if (child) {
            closeBtn = searchElement("VIEW GANG").nextElementSibling;
            elementToObserve = child.parentElement.parentElement;
          } else if (membersPath) {
            let backButton =
              searchElement("BACK").parentElement.parentElement.children[1]
                .firstElementChild;
            closeBtn = backButton;
            elementToObserve =
              membersPath.parentElement.parentElement.parentElement
                .parentElement;
          }

          if (membersPath) {
            clearInterval(interval);
            getGangPlayer(elementToObserve, closeBtn);
            const observerCallback = (mutationsList, observer) => {
              mutationsList.forEach((mutation) => {
                if (
                  mutation.type === "attributes" &&
                  mutation.attributeName === "class"
                ) {
                  const state = howManyLeftClass(elementToObserve);
                  if (state === 2) {
                    getGangPlayer(elementToObserve, closeBtn);
                  }
                }
              });
            };
            const observer = new MutationObserver(observerCallback);
            const observerConfig = {
              attributes: true,
              attributeFilter: ["class"],
            };
            observer.observe(elementToObserve, observerConfig);
          } else if (child) {
            clearInterval(interval);
            const observerCallback = (mutationsList, observer) => {
              mutationsList.forEach((mutation) => {
                if (
                  mutation.type === "attributes" &&
                  mutation.attributeName === "class"
                ) {
                  const state = howManyLeftClass(elementToObserve);
                  if (state === 2) {
                    getGangPlayer(elementToObserve, closeBtn);
                  }
                }
              });
            };
            const observer = new MutationObserver(observerCallback);
            const observerConfig = {
              attributes: true,
              attributeFilter: ["class"],
            };
            observer.observe(elementToObserve, observerConfig);
          }
        }, 50);
      },
      { once: true }
    );
  }
}

function getGangPlayer(parent, closeBtn) {
  let interval = setInterval(() => {
    const child1 = parent.children[0].children[0];
    const playerPath = child1.children[1];
    if (playerPath) {
      let firstChild = playerPath.firstElementChild;
      let className = playerPath.children[1].className;
      if (firstChild && firstChild.className != className) {
        playerPath.removeChild(playerPath.children[0]);
      }
      clearInterval(interval);
      let membershipsIndex = 0;
      for (let i = 0; i < playerPath.children.length; i++) {
        playerPath.children[i].style.cursor = "pointer";
        membershipsIndex = i;
        if (xhrGangData.memberships[i].status === "Left") {
          membershipsIndex++;
        }
        let item = playerPath.children[i];
        let member = xhrGangData.memberships[membershipsIndex];

        item.addEventListener("click", () => {
          let playerName = member.wallet.username;
          let wallet = member.walletId;

          openProfileFromGang(playerName, wallet, closeBtn);
        });
      }
    }
  }, 300);
}

function openProfileFromGang(username, wallet, closeBtn) {
  let interval1 = setInterval(() => {
    if (closeBtn) {
      clearInterval(interval1);
      closeBtn.click();
      let interval2 = setInterval(() => {
        const hubBtn = searchElement("Hub");
        if (hubBtn) {
          clearInterval(interval2);
          hubBtn.click();
          let interval3 = setInterval(() => {
            const socialBtn = searchElement("Social");
            if (socialBtn) {
              clearInterval(interval3);
              socialBtn.click();
              let interval4 = setInterval(() => {
                const searchPlayerBtn =
                  searchElement("Player search").firstElementChild;
                if (searchPlayerBtn) {
                  clearInterval(interval4);
                  searchPlayerBtn.click();
                  let interval5 = setInterval(() => {
                    const placeHolder = searchPlaceholder("Player Search");
                    if (placeHolder) {
                      clearInterval(interval5);
                      let inputEvent = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        "value"
                      );
                      inputEvent.set.call(placeHolder, wallet);
                      placeHolder.dispatchEvent(
                        new Event("input", { bubbles: true })
                      );
                      let interval6 = setInterval(() => {
                        const playerPath = document.querySelector(
                          "#player-scroller > div.infinite-scroll-component__outerdiv > div > div > div"
                        );
                        if (playerPath) {
                          if (playerPath.textContent == username) {
                            clearInterval(interval6);
                            playerPath.click();
                            addInviteButtonInProfile();
                          }
                        }
                      }, 30);
                    }
                  }, 30);
                }
              }, 30);
            }
          }, 30);
        }
      }, 30);
    }
  }, 30);
}
let option1;
function miscOptions(path) {
  let event = new CustomEvent("ready");
  window.dispatchEvent(event);
  try {
    if (!option1) {
      option1 = initOption1();
    }
    if (path === "locations" || path === "vault") {
      return option1(path);
    }
    let switchFunctions = [options0, option1, options2];
    window.addEventListener(
      "miscOptions",
      function (event) {
        event.detail.forEach((switchState, index) => {
          if (switchState == true) {
            switchFunctions[index](true);
          }
        });
      },
      { once: true }
    );

    function options0() {
      let interval1 = setInterval(() => {
        const policeStation = searchElement("Police Station");
        if (policeStation) {
          const animatedList =
            policeStation.parentElement.children[1].className;
          if (animatedList) {
            clearInterval(interval1);
            const elem = document.querySelectorAll("." + animatedList);
            elem.forEach(function (element) {
              element.parentNode.removeChild(element);
            });
          }
        }
      }, 500);
    }
    function initOption1() {
      let active;
      return function option1(data) {
        if (data !== undefined && typeof data == "boolean") {
          active = data;
          return;
        }
        if (!active) {
          return;
        }
        if (data == "locations") {
          return function () {
            setTopApeLoc();
          };
        }
        if (data == "vault") {
          return function () {
            setTopApeVault();
          };
        }
        function setTopApeVault() {
          try {
            if (chimpTang) {
              const nfts =
                searchElement("Show Info").parentElement.nextElementSibling;
              const tangButton =
                nfts.firstElementChild.children[0].children[1].children[1];
              const rillaButton =
                nfts.firstElementChild.children[0].children[1].children[2];

              let Chimp = 0;
              let Tang = 0;
              let Rilla = 0;

              for (let i = 0; i < chimpTang.length; i++) {
                let ape = chimpTang[i].species;
                if (ape === "Orangutan") {
                  Tang++;
                }
                if (ape === "Chimp") {
                  Chimp++;
                }
              }
              if (gorilla.length > 0) {
                for (let i = 0; i < gorilla.length; i++) {
                  Rilla++;
                }
              }
              const topApe = Math.max(Chimp, Tang, Rilla);
              if (topApe === Tang) tangButton.click();
              if (topApe === Rilla) rillaButton.click();
            }
          } catch (error) {
            console.error(error);
          }
        }
        function setTopApeLoc() {
          try {
            if (chimpTang) {
              let Chimp = 0;
              let Tang = 0;
              let Rilla = 0;

              for (let i = 0; i < chimpTang.length; i++) {
                let ape = chimpTang[i].species;
                if (ape === "Orangutan") {
                  Tang++;
                }
                if (ape === "Chimp") {
                  Chimp++;
                }
              }
              if (gorilla.length > 0) {
                for (let i = 0; i < gorilla.length; i++) {
                  Rilla++;
                }
              }

              let checkChimp = searchElement("My Chimps");
              if (!checkChimp) checkChimp = searchElement("My Orangutans");
              if (!checkChimp) checkChimp = searchElement("My Gorillas");
              const apesList = checkChimp.nextElementSibling.firstElementChild;
              const chimpButton = apesList.children[0];
              const tangButton = apesList.children[1];
              const rillaButton = apesList.children[2];
              const inLocChimp = parseFloat(
                chimpButton.children[1].textContent
              );
              const inLocTang = parseFloat(tangButton.children[1].textContent);
              const inLocRilla = parseFloat(
                rillaButton.children[1].textContent
              );
              const topApe = Math.max(inLocChimp, inLocRilla, inLocTang);
              if (topApe === inLocChimp) return;
              if (topApe === inLocRilla) rillaButton.click();
              if (topApe === inLocTang) tangButton.click();
            }
          } catch (error) {
            console.error(error);
          }
        }
      };
    }
    function options2() {}
  } catch (error) {
    console.error(error);
  }
}

var apeOldXHR = window.XMLHttpRequest;
function observeApeXHR() {
  let realXHR = new apeOldXHR();

  realXHR.onreadystatechange = function () {
    if (realXHR.readyState == 4 && realXHR.status == 200) {
      if (
        realXHR.responseURL.includes("https://api.theheist.game/nft/my-robbers")
      ) {
        chimpTang = JSON.parse(realXHR.responseText);
      }
      if (
        realXHR.responseURL.includes("https://api.theheist.game/nft/my-cops")
      ) {
        gorilla = JSON.parse(realXHR.responseText);
      }
    }
  };
  return realXHR;
}
window.XMLHttpRequest = observeApeXHR;

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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eURBQXlEO0FBQ3pEO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQiwwQkFBMEI7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Q0EsZ0NBQWdDLG9CQUFvQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixzQkFBc0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLG9CQUFvQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2hlaXN0LXN1cGVydmlzb3IvLi9hcHAvc2NyaXB0cy9IZWlzdFN1cGVydmlzb3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqICAgS25vd24gYnVnc1xyXG4gKiBpbiB2YXVsdCBuZWVkIHRvIHN0b3AgaW50ZXJ2YWwgaWYgcGxheWVyIGRvbnQgb3duIG5mdFxyXG4gKi9cclxubGV0IHdpdGhkcmF3QnRuUGF0aDtcclxubGV0IHhockdhbmdEYXRhO1xyXG5sZXQgeGhyQWN0dWFsUGxvdEF1Y3Rpb247XHJcbmxldCB4aHJOb3RpZmljYXRpb25EYXRhO1xyXG5sZXQgdXNlcldhbGxldDtcclxubGV0IGdldE1vbmV5SWQ7XHJcbmxldCBnZXRNb25leUlkTG9jO1xyXG5sZXQgbmV3TGlDaGltcDtcclxubGV0IG5ld0xpVGFuZztcclxubGV0IG5ld0xpU3RhdDtcclxubGV0IENvY29UYWJzQ2xpY2tlZCA9IGZhbHNlO1xyXG5sZXQgQW1vdW50O1xyXG5sZXQgaXNDb2NvU2VsZWN0ZWQgPSBmYWxzZTtcclxubGV0IGlzTmFuYVNlbGVjdGVkID0gZmFsc2U7XHJcbmxldCBpbkh1YiA9IGZhbHNlO1xyXG5sZXQgcm91bmRSYWZmbGUxO1xyXG5sZXQgcm91bmRSYWZmbGUyO1xyXG5sZXQgaHViSHRtbCA9IGZhbHNlO1xyXG5sZXQgY2hpbXBUYW5nO1xyXG5sZXQgZ29yaWxsYTtcclxuY29uc3Qgd2FsbGV0QWRkcmVzc1JlZ2V4ID1cclxuICAvaHR0cHM6XFwvXFwvYXBpXFwudGhlaGVpc3RcXC5nYW1lXFwvbmZ0XFwvcm9iYmVyc1xcL3dhbGxldC10b3AtcGVyZm9ybWluZ1xcLyhbXFx3XSspLztcclxuXHJcbmNvbnN0IGxvY1RhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgXCJib2R5ID4gZGl2Lk11aURpYWxvZy1yb290Lk11aU1vZGFsLXJvb3QuY3NzLTEyNnhqMGYgPiBkaXYuTXVpRGlhbG9nLWNvbnRhaW5lci5NdWlEaWFsb2ctc2Nyb2xsUGFwZXIuRGlhbG9nX3Njcm9sbFBhcGVyX19CZ2JiQS5jc3MtZWtlaWUwID4gZGl2ID4gZGl2XCJcclxuKTtcclxuY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgXCJib2R5ID4gZGl2Lk11aURpYWxvZy1yb290LmxvY2F0aW9uX3Jvb3RfXzZYc0RILk11aU1vZGFsLXJvb3QuY3NzLTEyNnhqMGZcIlxyXG4pO1xyXG5cclxuKGZ1bmN0aW9uIGlzVXNlckxvZ2dlZCgpIHtcclxuICBsZXQgb3JpZ2luYWxTZW5kID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmQ7XHJcbiAgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHRoaXMucmVzcG9uc2VVUkwuaW5jbHVkZXMoXCJodHRwczovL2FwaS50aGVoZWlzdC5nYW1lL25mdC9teS1yb2JiZXJzXCIpICYmXHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPT09IDIwMFxyXG4gICAgICApIHtcclxuICAgICAgICBpbml0RnVuY3Rpb24yKCk7XHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSBzZWFyY2hFbGVtZW50KFwiVGhlIGhlaXN0IGdhbWVcIikucGFyZW50RWxlbWVudDtcclxuICAgICAgICBjb25zdCBoMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcclxuICAgICAgICBoMi5zdHlsZS5jb2xvciA9IFwiI2ZmZlwiO1xyXG4gICAgICAgIGgyLnRleHRDb250ZW50ID0gXCJzdXBlcnZpc2VkXCI7XHJcbiAgICAgICAgdGl0bGUuYXBwZW5kQ2hpbGQoaDIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIG9yaWdpbmFsU2VuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH07XHJcbn0pKCk7XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hQbGFjZWhvbGRlcihxdWVyeSkge1xyXG4gIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgIFwiaW5wdXRbcGxhY2Vob2xkZXJdLCB0ZXh0YXJlYVtwbGFjZWhvbGRlcl1cIlxyXG4gICk7XHJcbiAgZm9yIChsZXQgZWxlbSBvZiBlbGVtZW50cykge1xyXG4gICAgaWYgKGVsZW0ucGxhY2Vob2xkZXIgPT09IHF1ZXJ5KSB7XHJcbiAgICAgIHJldHVybiBlbGVtO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLy8gIOKGk+KGkyBhdXRvIHNlYXJjaCBlbGVtZW50IGluIERPTSB0byBwcmV2ZW50IHBhdGggdXBkYXRlIGlzc3VlIOKGk+KGk1xyXG5mdW5jdGlvbiBzZWFyY2hFbGVtZW50KHF1ZXJ5KSB7XHJcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b24sIGgzLCBoMiwgaDEsIHNwYW4sIGRpdiwgcFwiKTtcclxuICBmb3IgKGxldCBlbGVtIG9mIGVsZW1lbnQpIHtcclxuICAgIGlmIChlbGVtLnRleHRDb250ZW50LnRyaW0oKSA9PT0gcXVlcnkpIHtcclxuICAgICAgcmV0dXJuIGVsZW07XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0RnVuY3Rpb24yKCkge1xyXG4gIGxldCBpbnRlcnZhbEdhbmcgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBsZXQgZ2FuZ0J1dHRvbiA9IHNlYXJjaEVsZW1lbnQoXCJHYW5nc1wiKTtcclxuICAgIGlmIChnYW5nQnV0dG9uKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxHYW5nKTtcclxuXHJcbiAgICAgIGdhbmdNZW51KGdhbmdCdXR0b24pO1xyXG4gICAgfVxyXG4gIH0sIDUwKTtcclxuXHJcbiAgbGV0IGludGVydmFsTG9jYXRpb24gPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBsZXQgY2l0eVBhdGggPSBzZWFyY2hFbGVtZW50KFwiQ2l0eVwiKTtcclxuICAgIGxldCBodWIgPSBzZWFyY2hFbGVtZW50KFwiSHViXCIpO1xyXG4gICAgaWYgKGNpdHlQYXRoKSB7XHJcbiAgICAgIGNvbnN0IGNpdHlTd2l0Y2ggPSBjaXR5UGF0aC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdO1xyXG4gICAgICBpZiAoY2l0eVN3aXRjaCkge1xyXG4gICAgICAgIGlmICghY2l0eVN3aXRjaC5jbGFzc05hbWUuaW5jbHVkZXMoXCJfdG9nZ2xlLS1hY3RpdmVcIikpIHtcclxuICAgICAgICAgIG1pc2NPcHRpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXJ0T2JzZXJ2aW5nSHViKCk7XHJcbiAgICAgICAgc3RhcnRPYnNlcnZpbmdXaXRoZHJhdygpO1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxMb2NhdGlvbik7XHJcbiAgICAgICAgY2l0eVN3aXRjaC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2FmZUhvdXNlID0gc2VhcmNoRWxlbWVudChcIlNhZmVob3VzZVwiKTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICFjaXR5U3dpdGNoLmNsYXNzTmFtZS5pbmNsdWRlcyhcIl90b2dnbGUtLWFjdGl2ZVwiKSAmJlxyXG4gICAgICAgICAgICAgIHNhZmVIb3VzZVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgICAgICAgICAgICBtaXNjT3B0aW9ucygpO1xyXG4gICAgICAgICAgICAgIHN0YXJ0T2JzZXJ2aW5nSHViKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2l0eVN3aXRjaC5jbGFzc05hbWUuaW5jbHVkZXMoXCJfdG9nZ2xlLS1hY3RpdmVcIikpIHtcclxuICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgNTApO1xyXG5cclxuICBsZXQgaW50ZXJ2YWxDaGF0ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgbGV0IGNoYXRQYXRoID0gc2VhcmNoRWxlbWVudChcIkhlaXN0IENoYXRcIik7XHJcbiAgICBpZiAoY2hhdFBhdGgpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbENoYXQpO1xyXG4gICAgICBjb25zdCBlbGVtZW50VG9PYnNlcnZlID0gY2hhdFBhdGgucGFyZW50RWxlbWVudC5jaGlsZHJlblswXTtcclxuICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9uc0xpc3QpIHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgbXV0YXRpb24udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIgJiZcclxuICAgICAgICAgICAgbXV0YXRpb24uYXR0cmlidXRlTmFtZSA9PT0gXCJjbGFzc1wiXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudENsYXNzZXMgPSBlbGVtZW50VG9PYnNlcnZlLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgaWYgKCFjdXJyZW50Q2xhc3Nlcy5pbmNsdWRlcyhcInVuZGVmaW5lZFwiKSkge1xyXG4gICAgICAgICAgICAgIHNlbmRJbnZpdGVJbkdhbWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnN0IG9ic2VydmVyQ29uZmlnID0ge1xyXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSxcclxuICAgICAgfTtcclxuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50VG9PYnNlcnZlLCBvYnNlcnZlckNvbmZpZyk7XHJcbiAgICB9XHJcbiAgfSwgNTApO1xyXG5cclxuICBsZXQgaW50ZXJ2YWxOb3RpZiA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgIGxldCBub3RpZlBhdGggPSBzZWFyY2hFbGVtZW50KFwiVGhlIGhlaXN0IGdhbWVcIik7XHJcbiAgICBpZiAobm90aWZQYXRoKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxOb3RpZik7XHJcbiAgICAgIG5vdGlmVHJhY2tlcigpO1xyXG4gICAgICBub3RpZlNvdW5kKCk7XHJcbiAgICB9XHJcbiAgfSwgNTApO1xyXG59XHJcblxyXG4vLyAg4oaT4oaTIGFkZCBjaGF0IHJlcXVlc3QgYnV0dG9uIGluIHByb2ZpbGUgd2hlbiB5b3UgY2xpY2sgb24gc29tZW9uZSBwcm9maWxlIOKGk+KGk1xyXG5mdW5jdGlvbiBhZGRJbnZpdGVCdXR0b25JblByb2ZpbGUoKSB7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJnZXRBZHJlc3NcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuZGV0YWlsKSB7XHJcbiAgICAgIGNvbnN0IGNsaWVudFdhbGxldEFkcmVzcyA9IGV2ZW50LmRldGFpbDtcclxuICAgICAgY29uc3QgdHJhZGVRdWVycnkgPSBzZWFyY2hFbGVtZW50KFwiVFJBREVcIik7XHJcbiAgICAgIGNvbnN0IGluamVjdEJ1dHRvblBhdGggPSB0cmFkZVF1ZXJyeS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICBjb25zdCBuYW1lQ2xhc3MgPSB0cmFkZVF1ZXJyeS5jbGFzc05hbWU7XHJcbiAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbmRJbnZpdGVcIikpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbmRJbnZpdGVcIikudmFsdWUgPSBjbGllbnRXYWxsZXRBZHJlc3M7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbmV3QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgICBuZXdCdXR0b24uaWQgPSBcInNlbmRJbnZpdGVcIjtcclxuICAgICAgICBuZXdCdXR0b24uY2xhc3NOYW1lID0gbmFtZUNsYXNzO1xyXG4gICAgICAgIG5ld0J1dHRvbi50ZXh0Q29udGVudCA9IFwiSW52aXRlIFRvIERtXCI7XHJcbiAgICAgICAgbmV3QnV0dG9uLnN0eWxlLm1hcmdpbkJvdHRvbSA9IFwiLTE2cHhcIjtcclxuICAgICAgICBuZXdCdXR0b24udmFsdWUgPSBjbGllbnRXYWxsZXRBZHJlc3M7XHJcbiAgICAgICAgaW5qZWN0QnV0dG9uUGF0aC5pbnNlcnRCZWZvcmUobmV3QnV0dG9uLCBpbmplY3RCdXR0b25QYXRoLmZpcnN0Q2hpbGQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBzZW5kQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZW5kSW52aXRlXCIpO1xyXG4gICAgICBzZW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhZHJlc3NUb0ludml0ZVwiLCBjbGllbnRXYWxsZXRBZHJlc3MpO1xyXG4gICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSh7IHR5cGU6IFwib3Blbkludml0ZVBvcHVwXCIgfSwgXCIqXCIpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLy8g4oaT4oaTICBnZXQgY2xpZW50IHdhbGxldCBhZHJlc3MgZm9yIGNoYXRpbmcgaW4gdGhlIEhlaXN0IFN1cGVydmlzb3IgUG9wdXAg4oaT4oaTXHJcbmZ1bmN0aW9uIHNlbmRJbnZpdGVJbkdhbWUoKSB7XHJcbiAgY29uc3QgZWxlbTEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoYXQtaGlzdG9yeS1ib3R0b20tcG9zaXRpb25cIik7XHJcbiAgY29uc3QgcHJvZmlsZVBhdGggPVxyXG4gICAgZWxlbTEucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcclxuICBjb25zdCBjaGlsZEVsZW0gPSBwcm9maWxlUGF0aC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZEVsZW0uY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgIGNoaWxkRWxlbS5jaGlsZHJlbltpXS5jaGlsZHJlblswXS5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBcImNsaWNrXCIsXHJcbiAgICAgICgpID0+IHtcclxuICAgICAgICBhZGRJbnZpdGVCdXR0b25JblByb2ZpbGUoKTtcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIG9uY2U6IHRydWUsXHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXhXaXRoZHJhdygpIHtcclxuICAvLyDihpPihpMgd2l0aGRyYXcgdGFiIHBhdGgg4oaT4oaTXHJcbiAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgY29uc3QgZ2V0Q29jb1RvdGFsID0gd2l0aGRyYXdCdG5QYXRoLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzJdLmNoaWxkcmVuWzFdO1xyXG4gICAgY29uc3QgZ2V0TmFuYVRvdGFsID0gd2l0aGRyYXdCdG5QYXRoLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdO1xyXG4gICAgY29uc3QgZWxlbTEgPSBzZWFyY2hFbGVtZW50KFwiQW1vdW50OlwiKTtcclxuICAgIGlmIChlbGVtMSkge1xyXG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgICAgY29uc3QgcGxhY2VIb2xkZXIgPSBlbGVtMS5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgY29uc3QgZGVwb3NpdEJ1dHRvblBhdGggPSBlbGVtMS5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzVdO1xyXG4gICAgICBjb25zdCBkaXZQYXJlbnQgPSBlbGVtMS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICBjb25zdCBidXR0b25DbGFzcyA9IGRlcG9zaXRCdXR0b25QYXRoLmNsYXNzTGlzdDtcclxuICAgICAgaWYgKGRlcG9zaXRCdXR0b25QYXRoICYmICFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1heEJ1dHRvblwiKSkge1xyXG4gICAgICAgIGNvbnN0IG1heEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgbWF4QnV0dG9uLmNsYXNzTGlzdCA9IGJ1dHRvbkNsYXNzO1xyXG4gICAgICAgIG1heEJ1dHRvbi5pZCA9IFwibWF4QnV0dG9uXCI7XHJcbiAgICAgICAgbWF4QnV0dG9uLnRleHRDb250ZW50ID0gXCJNYXggQW1vdW50XCI7XHJcbiAgICAgICAgbWF4QnV0dG9uLnN0eWxlLm1hcmdpbkJvdHRvbSA9IFwiMTBweFwiO1xyXG4gICAgICAgIGRpdlBhcmVudC5pbnNlcnRCZWZvcmUobWF4QnV0dG9uLCBkZXBvc2l0QnV0dG9uUGF0aCk7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHdpdGhkcmF3TG9jID0gZWxlbTEucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB3aXRoZHJhd0xvYy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwiY2xpY2tcIixcclxuICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KG1heFdpdGhkcmF3LCAyMDApO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyBvbmNlOiB0cnVlIH1cclxuICAgICAgKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgLy8gIOKGk+KGkyBnZXRNb25leUlkTG9jIGNoZWNrIGlmIG5hbmEgb3IgY29jbyBpcyBzZWxlY3RlZCBpbiB3aXRoZHJhdyBtZW51IOKGk+KGk1xyXG4gICAgICAgIGdldE1vbmV5SWRMb2MgPVxyXG4gICAgICAgICAgZWxlbTEucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICBnZXRNb25leUlkID0gZ2V0TW9uZXlJZExvYy5nZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIpO1xyXG4gICAgICB9LCAxMDApO1xyXG4gICAgICBpZiAoZ2V0Q29jb1RvdGFsKSB7XHJcbiAgICAgICAgbGV0IGFyaWFsTGFiZWxDb2NvID0gZ2V0Q29jb1RvdGFsLmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIik7XHJcbiAgICAgICAgbGV0IG51bWJlck1hdGNoQ29jbyA9IGFyaWFsTGFiZWxDb2NvLm1hdGNoKC8oW1xcZCxdKykvKTtcclxuXHJcbiAgICAgICAgaWYgKG51bWJlck1hdGNoQ29jbykge1xyXG4gICAgICAgICAgQW1vdW50ID0gbnVtYmVyTWF0Y2hDb2NvWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoZ2V0TmFuYVRvdGFsKSB7XHJcbiAgICAgICAgbGV0IGFyaWFsTGFiZWxOYW5hID0gZ2V0TmFuYVRvdGFsLmdldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIik7XHJcbiAgICAgICAgbGV0IG51bWJlck1hdGNoTmFuYSA9IGFyaWFsTGFiZWxOYW5hLm1hdGNoKC8oW1xcZCxdKykvKTtcclxuXHJcbiAgICAgICAgaWYgKG51bWJlck1hdGNoTmFuYSkge1xyXG4gICAgICAgICAgQW1vdW50ID0gbnVtYmVyTWF0Y2hOYW5hWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXhCdXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgIGxldCBpbnB1dEV2ZW50ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcclxuICAgICAgICAgICAgd2luZG93LkhUTUxJbnB1dEVsZW1lbnQucHJvdG90eXBlLFxyXG4gICAgICAgICAgICBcInZhbHVlXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBpbnB1dEV2ZW50LnNldC5jYWxsKHBsYWNlSG9sZGVyLCBBbW91bnQucmVwbGFjZSgvXFwuL2csIFwiXCIpKTtcclxuICAgICAgICAgIHBsYWNlSG9sZGVyLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoZ2V0TW9uZXlJZC5pbmNsdWRlcyhcIkNPQ09cIikpIHtcclxuICAgICAgICAgIGlzQ29jb1NlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIGNvbnN0IG1hdGNoID0gZ2V0TW9uZXlJZC5tYXRjaCgvKFxcZHwsKSsvKTtcclxuICAgICAgICAgIGNvbnN0IG1hdGNoQW1vdW50ID0gbWF0Y2hbMF07XHJcbiAgICAgICAgICBsZXQgY2xlYW5lZENvY28gPSBtYXRjaEFtb3VudC5yZXBsYWNlKC8sL2csIFwiLlwiKTtcclxuICAgICAgICAgIEFtb3VudCA9IGNsZWFuZWRDb2NvO1xyXG4gICAgICAgICAgZ2V0TW9uZXlJZExvYy50ZXh0Q29udGVudCA9IEFtb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGdldE1vbmV5SWQuaW5jbHVkZXMoXCJOQU5BXCIpKSB7XHJcbiAgICAgICAgICBpc05hbmFTZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICBjb25zdCBtYXRjaCA9IGdldE1vbmV5SWQubWF0Y2goLyhcXGR8LCkrLyk7XHJcbiAgICAgICAgICBjb25zdCBtYXRjaEFtb3VudCA9IG1hdGNoWzBdO1xyXG4gICAgICAgICAgbGV0IGNsZWFuZWROYW5hID0gbWF0Y2hBbW91bnQucmVwbGFjZSgvLC9nLCBcIi5cIik7XHJcbiAgICAgICAgICBBbW91bnQgPSBjbGVhbmVkTmFuYTtcclxuICAgICAgICAgIGdldE1vbmV5SWRMb2MudGV4dENvbnRlbnQgPSBBbW91bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCAyMDApO1xyXG4gICAgfVxyXG4gIH0sIDEwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExvY2F0aW9uU3RhdHMoKSB7XHJcbiAgaWYgKGluSHViID09PSB0cnVlKSB7XHJcbiAgICBsZXQgYmFkRXZlbnRQZXJjZW50ID0gMDtcclxuICAgIGNvbnN0IHVwZGF0ZUxpU3RhdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI1NUQVRTXCIpO1xyXG4gICAgY29uc3QgdXBkYXRlTGlDaGltcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGVyY2VudENoaW1wXCIpO1xyXG4gICAgY29uc3QgdXBkYXRlTGlUYW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwZXJjZW50VGFuZ1wiKTtcclxuICAgIGNvbnN0IHVwZGF0ZUxpR29yaWxsYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmlsbGFTdGF0c1wiKTtcclxuXHJcbiAgICAvLyAgIOKGk+KGkyBwYXRoIHRvIHRvIHRoZSB0b3AgbGlzdCBvZiBsb2NhdGlvbiAoIHNhZmUgSG91c2UsIGZlZGVyYWwgcmVzZXJ2ZS4uLi4pIGluIHRoZSBsb2NhdGlvbiBtZW51IOKGk+KGk1xyXG4gICAgY29uc3QgZWxlbTEgPSBzZWFyY2hFbGVtZW50KFwiRXZlbnQgdGFibGVcIik7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgbXlDaGltcHMgPSBzZWFyY2hFbGVtZW50KFwiTXkgQ2hpbXBzXCIpO1xyXG4gICAgICBpZiAoIW15Q2hpbXBzKSBteUNoaW1wcyA9IHNlYXJjaEVsZW1lbnQoXCJNeSBPcmFuZ3V0YW5zXCIpO1xyXG4gICAgICBpZiAoIW15Q2hpbXBzKSBteUNoaW1wcyA9IHNlYXJjaEVsZW1lbnQoXCJNeSBHb3JpbGxhc1wiKTtcclxuXHJcbiAgICAgIGNvbnN0IHRvcExpc3QgPVxyXG4gICAgICAgIG15Q2hpbXBzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICBjb25zdCBDb2NvVGFic0xpc3QgPVxyXG4gICAgICAgIGVsZW0xLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnRcclxuICAgICAgICAgIC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcclxuXHJcbiAgICAgIGlmIChDb2NvVGFic0xpc3QpIHtcclxuICAgICAgICBDb2NvVGFic0xpc3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKCkge1xyXG4gICAgICAgICAgaWYgKCFDb2NvVGFic0NsaWNrZWQpIHtcclxuICAgICAgICAgICAgbGV0IGludGVydmFsMSA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCBsb2NRdWVycnkgPSBzZWFyY2hFbGVtZW50KFwiTG9jYXRpb24gU3RhdHNcIik7XHJcbiAgICAgICAgICAgICAgaWYgKGxvY1F1ZXJyeSkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbDEpO1xyXG4gICAgICAgICAgICAgICAgdG9wTGlzdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVsb2FkU2VsZWN0QXBlKTtcclxuICAgICAgICAgICAgICAgIExvY2F0aW9uU3RhdHMoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDUwKTtcclxuXHJcbiAgICAgICAgICAgIENvY29UYWJzTGlzdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlQ2xpY2spO1xyXG4gICAgICAgICAgICBDb2NvVGFic0NsaWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIC8vICDihpPihpMgcGF0aCB0byB0aGUgbG9jYXRpb24gdWwgY29udGFpbmVyIOKGk+KGk1xyXG4gICAgICBjb25zdCBsb2NRdWVycnkgPSBzZWFyY2hFbGVtZW50KFwiTG9jYXRpb24gU3RhdHNcIik7XHJcbiAgICAgIGNvbnN0IGdldFVsID0gbG9jUXVlcnJ5LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXTtcclxuICAgICAgZ2V0VWwuc3R5bGUubWF4SGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgIC8vICDihpPihpMgcGF0aCB0byBjb2NvIGVtaXNzaW9uIHZhbHVlIOKGk+KGk1xyXG4gICAgICBjb25zdCBDb2NvRW1pc3Npb25zTG9jID0gZ2V0VWwuY2hpbGRyZW5bM10uY2hpbGRyZW5bMV07XHJcbiAgICAgIC8vICDihpPihpMgcGF0aCBvZiBudW1iZXIgb2YgcmlsbGEgdmFsdWUg4oaT4oaTXHJcbiAgICAgIGNvbnN0IFJpbGxhTG9jID0gZ2V0VWwuY2hpbGRyZW5bMl0uY2hpbGRyZW5bMV07XHJcbiAgICAgIC8vICDihpPihpMgcGF0aCB0byBudW1iZXIgb2YgVGFuZyB2YWx1ZSDihpPihpNcclxuICAgICAgY29uc3QgVGFuZ0xvYyA9IGdldFVsLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzFdO1xyXG4gICAgICAvLyAg4oaT4oaTIHBhdGggdG8gbnVtYmVyIG9mIENoaW1wIHZhbHVlIOKGk+KGk1xyXG4gICAgICBjb25zdCBDaGltcERvYyA9IGdldFVsLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdO1xyXG4gICAgICBjb25zdCBuYW1lQ2xhc3NMaSA9IGdldFVsLmNoaWxkcmVuWzFdLmNsYXNzTmFtZTtcclxuICAgICAgY29uc3QgbmFtZUNsYXNzVmFsdWUgPSBDaGltcERvYy5jbGFzc05hbWU7XHJcbiAgICAgIGNvbnN0IG5hbWVDbGFzc0xhYmVsID0gZ2V0VWwuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMl0uY2xhc3NOYW1lO1xyXG4gICAgICBjb25zdCBuZXdMaUdvcmlsbGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgICAgIGNvbnN0IG5ld0xpU3RhdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgY29uc3QgbmV3TGlDaGltcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgY29uc3QgbmV3TGlUYW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgICBjb25zdCBiYWRFdmVudFVsID0gZWxlbTEucGFyZW50RWxlbWVudC5jaGlsZHJlblszXTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiYWRFdmVudFVsLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRQZXJjZW50ID1cclxuICAgICAgICAgIGJhZEV2ZW50VWwuY2hpbGRyZW5baV0uZmlyc3RFbGVtZW50Q2hpbGQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMl1cclxuICAgICAgICAgICAgLmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgIGxldCBudW1iZXIgPSBwYXJzZUZsb2F0KGV2ZW50UGVyY2VudC50ZXh0Q29udGVudC5yZXBsYWNlKFwiJVwiLCBcIlwiKSk7XHJcbiAgICAgICAgYmFkRXZlbnRQZXJjZW50ID0gYmFkRXZlbnRQZXJjZW50ICsgbnVtYmVyO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChDaGltcERvYykge1xyXG4gICAgICAgIGNvbnN0IENvY29Ub051bWJlciA9IENvY29FbWlzc2lvbnNMb2MudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgY29uc3QgQ29jbyA9IHBhcnNlSW50KENvY29Ub051bWJlcikgKiAxMDAwO1xyXG4gICAgICAgIGxldCBUYW5ndHh0ID0gVGFuZ0xvYy50ZXh0Q29udGVudDtcclxuICAgICAgICBsZXQgQ2hpbXB0eHQgPSBDaGltcERvYy50ZXh0Q29udGVudDtcclxuICAgICAgICBsZXQgUmlsbGF0eHQgPSBSaWxsYUxvYy50ZXh0Q29udGVudDtcclxuICAgICAgICBsZXQgUmlsbGEgPSBwYXJzZUludChSaWxsYXR4dCk7XHJcbiAgICAgICAgbGV0IFRhbmcgPSBwYXJzZUludChUYW5ndHh0KTtcclxuICAgICAgICBsZXQgQ2hpbXAgPSBwYXJzZUludChDaGltcHR4dCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFwZVBlclJpbGxhID0gTWF0aC5yb3VuZCgoVGFuZyArIENoaW1wKSAvIFJpbGxhKTtcclxuICAgICAgICBjb25zdCB0YW5nUGVyY2VudGFnZSA9IE1hdGgucm91bmQoKFRhbmcgLyAoVGFuZyArIENoaW1wKSkgKiAxMDApO1xyXG4gICAgICAgIGNvbnN0IGNoaW1wUGVyY2VudGFnZSA9IE1hdGgucm91bmQoKENoaW1wIC8gKFRhbmcgKyBDaGltcCkpICogMTAwKTtcclxuICAgICAgICBjb25zdCBjb2NvRGlzdHJpYnV0aW9uID0gTWF0aC5mbG9vcihDb2NvIC8gKFRhbmcgKyBDaGltcCkpO1xyXG4gICAgICAgIGNvbnN0IGVzdEhvdXJseVJpbGxhID0gTWF0aC5yb3VuZChcclxuICAgICAgICAgIChiYWRFdmVudFBlcmNlbnQgLyAxMDApICogYXBlUGVyUmlsbGEgKiBjb2NvRGlzdHJpYnV0aW9uXHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAodXBkYXRlTGlHb3JpbGxhKSB7XHJcbiAgICAgICAgICB1cGRhdGVMaUdvcmlsbGEuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCI5NlwiIGhlaWdodD1cIjk2XCIgdmlld0JveD1cIjAgMCA5NiA5NlwiIGZpbGw9XCJub25lXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cIiR7bmFtZUNsYXNzVmFsdWV9XCI+JHtlc3RIb3VybHlSaWxsYX08L3NwYW4+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cIiR7bmFtZUNsYXNzTGFiZWx9XCI+RXN0LiBIb3VybHkgJENPQ08gcGVyIEdvcmlsbGE8L3NwYW4+ICBcclxuICAgIGA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5ld0xpR29yaWxsYS5jbGFzc05hbWUgPSBuYW1lQ2xhc3NMaTtcclxuICAgICAgICAgIG5ld0xpR29yaWxsYS5pZCA9IFwicmlsbGFTdGF0c1wiO1xyXG4gICAgICAgICAgbmV3TGlHb3JpbGxhLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiOTZcIiBoZWlnaHQ9XCI5NlwiIHZpZXdCb3g9XCIwIDAgOTYgOTZcIiBmaWxsPVwibm9uZVwiPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCIke25hbWVDbGFzc1ZhbHVlfVwiPiR7ZXN0SG91cmx5UmlsbGF9PC9zcGFuPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCIke25hbWVDbGFzc0xhYmVsfVwiPkVzdC4gSG91cmx5ICRDT0NPIHBlciBHb3JpbGxhPC9zcGFuPiAgXHJcbiAgICBgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodXBkYXRlTGlUYW5nKSB7XHJcbiAgICAgICAgICB1cGRhdGVMaVRhbmcuaW5uZXJIVE1MID0gYFxyXG4gICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjk2XCIgaGVpZ2h0PVwiOTZcIiB2aWV3Qm94PVwiMCAwIDk2IDk2XCIgZmlsbD1cIm5vbmVcIj5cclxuICAgICAgPHNwYW4gY2xhc3M9XCIke25hbWVDbGFzc1ZhbHVlfVwiPiR7dGFuZ1BlcmNlbnRhZ2V9JTwvc3Bhbj5cclxuICAgICAgPHNwYW4gY2xhc3M9XCIke25hbWVDbGFzc0xhYmVsfVwiPk9mIFRhbmdzPC9zcGFuPiAgXHJcbmA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5ld0xpVGFuZy5jbGFzc05hbWUgPSBuYW1lQ2xhc3NMaTtcclxuICAgICAgICAgIG5ld0xpVGFuZy5pZCA9IFwicGVyY2VudFRhbmdcIjtcclxuICAgICAgICAgIG5ld0xpVGFuZy5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCI5NlwiIGhlaWdodD1cIjk2XCIgdmlld0JveD1cIjAgMCA5NiA5NlwiIGZpbGw9XCJub25lXCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCIke25hbWVDbGFzc1ZhbHVlfVwiPiR7dGFuZ1BlcmNlbnRhZ2V9JTwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cIiR7bmFtZUNsYXNzTGFiZWx9XCI+T2YgVGFuZ3M8L3NwYW4+ICBcclxuICAgICAgICBgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodXBkYXRlTGlDaGltcCkge1xyXG4gICAgICAgICAgdXBkYXRlTGlDaGltcC5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiOTZcIiBoZWlnaHQ9XCI5NlwiIHZpZXdCb3g9XCIwIDAgOTYgOTZcIiBmaWxsPVwibm9uZVwiPlxyXG4gICAgICA8c3BhbiBjbGFzcz1cIiR7bmFtZUNsYXNzVmFsdWV9XCI+JHtjaGltcFBlcmNlbnRhZ2V9JTwvc3Bhbj5cclxuICAgICAgPHNwYW4gY2xhc3M9XCIke25hbWVDbGFzc0xhYmVsfVwiPk9mIENoaW1wczwvc3Bhbj4gIFxyXG5gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXdMaUNoaW1wLmNsYXNzTmFtZSA9IG5hbWVDbGFzc0xpO1xyXG4gICAgICAgICAgbmV3TGlDaGltcC5pZCA9IFwicGVyY2VudENoaW1wXCI7XHJcbiAgICAgICAgICBuZXdMaUNoaW1wLmlubmVySFRNTCA9IGBcclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjk2XCIgaGVpZ2h0PVwiOTZcIiB2aWV3Qm94PVwiMCAwIDk2IDk2XCIgZmlsbD1cIm5vbmVcIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cIiR7bmFtZUNsYXNzVmFsdWV9XCI+JHtjaGltcFBlcmNlbnRhZ2V9JTwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cIiR7bmFtZUNsYXNzTGFiZWx9XCI+T2YgQ2hpbXBzPC9zcGFuPiAgXHJcbiAgICAgICAgYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVwZGF0ZUxpU3RhdHMpIHtcclxuICAgICAgICAgIHVwZGF0ZUxpU3RhdHMuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiOTZcIiBoZWlnaHQ9XCI5NlwiIHZpZXdCb3g9XCIwIDAgOTYgOTZcIiBmaWxsPVwibm9uZVwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiJHtuYW1lQ2xhc3NWYWx1ZX1cIj4ke2NvY29EaXN0cmlidXRpb259PC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiJHtuYW1lQ2xhc3NMYWJlbH1cIj5Fc3QuIEhvdXJseSAkQ09DTyBwZXIgVEFORy9DSElNUDwvc3Bhbj5cclxuICAgICAgYDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV3TGlTdGF0LmNsYXNzTmFtZSA9IG5hbWVDbGFzc0xpO1xyXG4gICAgICAgICAgbmV3TGlTdGF0LmlkID0gXCJTVEFUU1wiO1xyXG4gICAgICAgICAgbmV3TGlTdGF0LmlubmVySFRNTCA9IGBcclxuICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjk2XCIgaGVpZ2h0PVwiOTZcIiB2aWV3Qm94PVwiMCAwIDk2IDk2XCIgZmlsbD1cIm5vbmVcIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cIiR7bmFtZUNsYXNzVmFsdWV9XCI+JHtjb2NvRGlzdHJpYnV0aW9ufTwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cIiR7bmFtZUNsYXNzTGFiZWx9XCI+RXN0LiBIb3VybHkgJENPQ08gcGVyIFRBTkcvQ0hJTVA8L3NwYW4+XHJcbiAgICAgIFxyXG4gICAgICBgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZ2V0VWwpIHtcclxuICAgICAgICAgIGdldFVsLmFwcGVuZENoaWxkKG5ld0xpU3RhdCk7XHJcbiAgICAgICAgICBnZXRVbC5hcHBlbmRDaGlsZChuZXdMaUNoaW1wKTtcclxuICAgICAgICAgIGdldFVsLmFwcGVuZENoaWxkKG5ld0xpVGFuZyk7XHJcbiAgICAgICAgICBnZXRVbC5hcHBlbmRDaGlsZChuZXdMaUdvcmlsbGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBDb2NvVGFic0NsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBzZWxlY3RBcGVGdW5jdGlvbiA9IG1pc2NPcHRpb25zKFwibG9jYXRpb25zXCIpO1xyXG4gICAgICBzZWxlY3RBcGVGdW5jdGlvbigpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcmVsb2FkU2VsZWN0QXBlKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoc2VsZWN0QXBlRnVuY3Rpb24sIDEwMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRvcExpc3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbG9hZFNlbGVjdEFwZSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXJ0T2JzZXJ2aW5nSHViKCkge1xyXG4gIGNvbnN0IGVsZW1lbnRUb09ic2VydmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIik7XHJcbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpID0+IHtcclxuICAgIGZvciAoY29uc3QgbXV0YXRpb24gb2YgbXV0YXRpb25zTGlzdCkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbXV0YXRpb24udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIgJiZcclxuICAgICAgICBtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSBcImFyaWEtaGlkZGVuXCJcclxuICAgICAgKSB7XHJcbiAgICAgICAgY29uc3QgaXNBcmlhSGlkZGVuVHJ1ZSA9XHJcbiAgICAgICAgICBtdXRhdGlvbi50YXJnZXQuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgPT09IFwidHJ1ZVwiO1xyXG5cclxuICAgICAgICBpZiAoaXNBcmlhSGlkZGVuVHJ1ZSkge1xyXG4gICAgICAgICAgaW5IdWIgPSB0cnVlO1xyXG4gICAgICAgICAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjaGVja0xvYyA9IHNlYXJjaEVsZW1lbnQoXCJMb2NhdGlvbiBTdGF0c1wiKTtcclxuICAgICAgICAgICAgY29uc3QgY2hlY2tIdWIgPSBzZWFyY2hFbGVtZW50KFwiQmxhY2ttYXJrZXRcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhbmRQb29sID0gc2VhcmNoRWxlbWVudChcIkxBTkQgUE9PTFwiKTtcclxuICAgICAgICAgICAgY29uc3QgYXVjdGlvbiA9IHNlYXJjaEVsZW1lbnQoXCJZb3VyIGJpZFwiKTtcclxuICAgICAgICAgICAgaWYgKGNoZWNrTG9jKSB7XHJcbiAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgc2V0VGltZW91dChMb2NhdGlvblN0YXRzLCA3MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjaGVja0h1Yikge1xyXG4gICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGxvb3BDaGVjayA9IHNlYXJjaEVsZW1lbnQoXCJCbGFja21hcmtldFwiKTtcclxuICAgICAgICAgICAgICBjb25zdCB1bEJ1dHRvbiA9IGxvb3BDaGVjay5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgbGV0IGludGVydmFsMSA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh1bEJ1dHRvbi5jaGlsZHJlblsyXSkge1xyXG4gICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsMSk7XHJcbiAgICAgICAgICAgICAgICAgIGNoZWNrSHViVGFiKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhdWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGxhbmRQb29sKSB7XHJcbiAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHBhdGggPSBzZWFyY2hFbGVtZW50KFwiR2FuZ3NcIik7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZ2FuZ01lbnUocGF0aCk7XHJcbiAgICAgICAgICB9LCA3MDApO1xyXG4gICAgICAgICAgaW5IdWIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICBjb25zdCBvYnNlcnZlckNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlRmlsdGVyOiBbXCJhcmlhLWhpZGRlblwiXSB9O1xyXG4gIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudFRvT2JzZXJ2ZSwgb2JzZXJ2ZXJDb25maWcpO1xyXG59XHJcbmxldCBhY3RpdmVUYWI7XHJcbmZ1bmN0aW9uIGNoZWNrSHViVGFiKCkge1xyXG4gIGlmIChkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ICE9IFwiaGlkZGVuXCIpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc3QgbG9vcENoZWNrID0gc2VhcmNoRWxlbWVudChcIkJsYWNrbWFya2V0XCIpO1xyXG4gIGNvbnN0IHVsQnV0dG9uID0gbG9vcENoZWNrLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdWxCdXR0b24uY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgbGkgPSB1bEJ1dHRvbi5jaGlsZHJlbltpXTtcclxuXHJcbiAgICAgIGxpLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja2VkKTtcclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBsaS5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc05hbWUuaW5jbHVkZXMoXCItLWFjdGl2ZVwiKSAmJlxyXG4gICAgICAgIGFjdGl2ZVRhYiAhPSBsaVxyXG4gICAgICApIHtcclxuICAgICAgICBhY3RpdmVUYWIgPSBsaTtcclxuICAgICAgICBmdW5jdGlvbkh1YlRhYltpXSgpO1xyXG4gICAgICAgIGlmIChpID09PSAxKSB7XHJcbiAgICAgICAgICBjb25zdCBzZWxlY3RBcGVGdW5jdGlvbiA9IG1pc2NPcHRpb25zKFwidmF1bHRcIik7XHJcbiAgICAgICAgICBzZWxlY3RBcGVGdW5jdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICBsaS5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc05hbWUuaW5jbHVkZXMoXCItLWFjdGl2ZVwiKSAmJlxyXG4gICAgICAgIGFjdGl2ZVRhYiA9PSBsaVxyXG4gICAgICApIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGNsaWNrZWQoKTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIWxpLmZpcnN0RWxlbWVudENoaWxkLmNsYXNzTmFtZS5pbmNsdWRlcyhcIi0tYWN0aXZlXCIpKSB7XHJcbiAgICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrZWQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2xpY2tlZCgpIHtcclxuICAgIGZvciAobGV0IG4gPSAwOyBuIDwgdWxCdXR0b24uY2hpbGRyZW4ubGVuZ3RoOyBuKyspIHtcclxuICAgICAgdWxCdXR0b24uY2hpbGRyZW5bbl0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrZWQpO1xyXG4gICAgfVxyXG4gICAgY2hlY2tIdWJUYWIoKTtcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGZ1bmN0aW9uSHViVGFiID0gW1xyXG4gIGh1YlRhYjAsXHJcbiAgaHViVGFiMSxcclxuICBodWJUYWIyLFxyXG4gIGh1YlRhYjMsXHJcbiAgaHViVGFiNCxcclxuICBodWJUYWI1LFxyXG4gIGh1YlRhYjYsXHJcbl07XHJcblxyXG5mdW5jdGlvbiBodWJUYWIwKCkge1xyXG4gIC8vIHNvY2lhbFxyXG4gIGNvbnNvbGUubG9nKFwic29jaWFsXCIpO1xyXG4gIGxldCBpbnRlcnZhbDEgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBjb25zdCBlbGVtMSA9IHNlYXJjaEVsZW1lbnQoXCJPUkFOR1VUQU5TIENPTUlOR1wiKTtcclxuICAgIGlmIChlbGVtMSkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGVsZW0yID1cclxuICAgICAgICAgIGVsZW0xLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdXHJcbiAgICAgICAgICAgIC5jaGlsZHJlblsxXS5jaGlsZHJlblsxXS5jaGlsZHJlblsxXTtcclxuICAgICAgICBpZiAoZWxlbTIpIHtcclxuICAgICAgICAgIGNvbnN0IGVsZW0zID0gZWxlbTIuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICAgICAgICBpZiAoZWxlbTMpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbDEpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KG5mdFJlY3J1aXRtZW50LCA3MDApO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJhZmZsZVRpY2tldCwgNzAwKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCA1MCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbG9hZEh1YlRhYjEoKSB7XHJcbiAgaHViVGFiMSgpO1xyXG4gIHJldHVybjtcclxufVxyXG5cclxuZnVuY3Rpb24gaHViVGFiMSgpIHtcclxuICAvLyAgdmF1bHRcclxuICBjb25zb2xlLmxvZyhcInJlc3RhcnRcIik7XHJcbiAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgY29uc3QgcGF0aCA9IHNlYXJjaEVsZW1lbnQoXCJTaG93IEluZm9cIikucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICBpZiAoZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyAhPSBcImhpZGRlblwiKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChwYXRoKSB7XHJcbiAgICAgIGNvbnN0IG5mdFVsID0gcGF0aC5jaGlsZHJlblsxXTtcclxuICAgICAgaWYgKG5mdFVsKSB7XHJcbiAgICAgICAgY29uc3QgY2hlY2tDaGFuZ2UgPVxyXG4gICAgICAgICAgcGF0aC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5jaGlsZHJlblsxXTtcclxuICAgICAgICBpZiAoY2hlY2tDaGFuZ2UpIHtcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG5cclxuICAgICAgICAgIGNoZWNrQ2hhbmdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZWxvYWRIdWJUYWIxKTtcclxuICAgICAgICAgIGNoZWNrQ2hhbmdlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZWxvYWRIdWJUYWIxKTtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmZ0VWwuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBpZiAobmZ0VWwuY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBjb25zdCBuZnRMaSA9IG5mdFVsLmNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHVwZ3JhZGVCdG4gPVxyXG4gICAgICAgICAgICAgICAgbmZ0TGkuZmlyc3RFbGVtZW50Q2hpbGQuY2hpbGRyZW5bMl0uZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICAgICAgICAgICAgdXBncmFkZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWF4VXBncmFkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIG1heFVwZ3JhZGUoKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgbmZ0VWwuY2hpbGRyZW4ubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICBuZnRVbC5jaGlsZHJlbltuXS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWF4VXBncmFkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSBzZWFyY2hFbGVtZW50KFwiRWFjaCBQb2ludCBJbmNyZWFzZXMgeWllbGRcIik7XHJcbiAgICAgICAgICAgICAgaWYgKHBhdGgpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdWxVcGdyYWRlID1cclxuICAgICAgICAgICAgICAgICAgcGF0aC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bFVwZ3JhZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWF4QnRuXCIgKyBpKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHVsVXBncmFkZS5jaGlsZHJlbltpXS5jbGFzc05hbWUuaW5jbHVkZXMoXCJwcmVzdGlnZVwiKVxyXG4gICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBjb25zdCBsaVVwZ3JhZGUgPSB1bFVwZ3JhZGUuY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGJ0bkNvbnRhaW5lciA9IGxpVXBncmFkZS5jaGlsZHJlblsxXTtcclxuICAgICAgICAgICAgICAgICAgY29uc3QgYnRuQ2xhc3MgPVxyXG4gICAgICAgICAgICAgICAgICAgIGJ0bkNvbnRhaW5lci5jaGlsZHJlblsyXS5jaGlsZHJlblsxXS5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgICAgICAgICAgICAgIGJ1dHRvbi5pZCA9IFwibWF4QnRuXCIgKyBpO1xyXG4gICAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NOYW1lID0gYnRuQ2xhc3M7XHJcbiAgICAgICAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiTUFYXCI7XHJcbiAgICAgICAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS53aWR0aCA9IFwiMTUzcHhcIjtcclxuICAgICAgICAgICAgICAgICAgYnRuQ29udGFpbmVyLmluc2VydEJlZm9yZShidXR0b24sIGJ0bkNvbnRhaW5lci5jaGlsZHJlblszXSk7XHJcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKFwibWF4QnRuXCIgKyBbaV0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRFdmVudCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5IVE1MSW5wdXRFbGVtZW50LnByb3RvdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YWx1ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHBsYWNlSG9sZGVyID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlVcGdyYWRlLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzJdLmZpcnN0RWxlbWVudENoaWxkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgaW5wdXRFdmVudC5zZXQuY2FsbChwbGFjZUhvbGRlciwgOTkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2VIb2xkZXIuZGlzcGF0Y2hFdmVudChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEV2ZW50KFwiaW5wdXRcIiwgeyBidWJibGVzOiB0cnVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sIDEwMCk7XHJcblxyXG4gIGNvbnNvbGUubG9nKFwidmF1bHRcIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh1YlRhYjIoKSB7XHJcbiAgLy8gIG1hcmtldFxyXG4gIGNvbnNvbGUubG9nKFwibWFya2V0XCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBodWJUYWIzKCkge1xyXG4gIC8vICBibGFja01hcmtldFxyXG4gIGNvbnNvbGUubG9nKFwiYm1cIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh1YlRhYjQoKSB7XHJcbiAgLy8gIHJld2FyZHNcclxuICBjb25zb2xlLmxvZyhcInJld2FyZFwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaHViVGFiNSgpIHtcclxuICAvLyAgY29zbWV0aWNcclxuICBjb25zb2xlLmxvZyhcImNvc21ldGljXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBodWJUYWI2KCkge1xyXG4gIC8vICBjb3NtZXRpYyBzdG9yZVxyXG59XHJcblxyXG5mdW5jdGlvbiBzdGFydE9ic2VydmluZ1dpdGhkcmF3KCkge1xyXG4gIC8vICAg4oaT4oaTIGxvY2F0aW9uIG9mIHRoZSB3aXRoZHJhdyAvIGRlcG9zaXQgVGFiIOKGk+KGk1xyXG4gIGNvbnN0IGVsZW0xID0gc2VhcmNoRWxlbWVudChcIkdhbmdzXCIpO1xyXG4gIGNvbnN0IGVsZW0yID0gZWxlbTEucGFyZW50RWxlbWVudDtcclxuICBjb25zdCBlbGVtMyA9IGVsZW0yLmNoaWxkcmVuWzFdO1xyXG4gIGNvbnN0IGVsZW1lbnRUb09ic2VydmUgPSBlbGVtMy5maXJzdEVsZW1lbnRDaGlsZDtcclxuICB3aXRoZHJhd0J0blBhdGggPSBlbGVtZW50VG9PYnNlcnZlO1xyXG5cclxuICBjb25zdCBvYnNlcnZlckNhbGxiYWNrID0gKG11dGF0aW9uc0xpc3QsIG9ic2VydmVyKSA9PiB7XHJcbiAgICBtdXRhdGlvbnNMaXN0LmZvckVhY2goKG11dGF0aW9uKSA9PiB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBtdXRhdGlvbi50eXBlID09PSBcImF0dHJpYnV0ZXNcIiAmJlxyXG4gICAgICAgIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09IFwiY2xhc3NcIlxyXG4gICAgICApIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50Q2xhc3NlcyA9IGVsZW1lbnRUb09ic2VydmUuY2xhc3NOYW1lO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5zQnV0dG9uQmxhY2sgPSBjdXJyZW50Q2xhc3Nlcy5pbmNsdWRlcyhcIl9idXR0b24tLWJsYWNrXCIpO1xyXG4gICAgICAgIGlmICghY29udGFpbnNCdXR0b25CbGFjaykge1xyXG4gICAgICAgICAgd2l0aGRyYXdDbGljayA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtYXhXaXRoZHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG9ic2VydmVyQ2FsbGJhY2spO1xyXG4gIGNvbnN0IG9ic2VydmVyQ29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBhdHRyaWJ1dGVGaWx0ZXI6IFtcImNsYXNzXCJdIH07XHJcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50VG9PYnNlcnZlLCBvYnNlcnZlckNvbmZpZyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5mdFJlY3J1aXRtZW50KCkge1xyXG4gIGxldCBjaGFuY2VQZXJUaWNrZXQ7XHJcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgIFwiYm9keSA+IGRpdi5NdWlEaWFsb2ctcm9vdC5NdWlNb2RhbC1yb290LmNzcy0xMjZ4ajBmID4gZGl2Lk11aURpYWxvZy1jb250YWluZXIuTXVpRGlhbG9nLXNjcm9sbFBhcGVyLl9zY3JvbGxQYXBlcl9nbnlsaV8xOC5jc3MtZWtlaWUwID4gZGl2ID4gZGl2Ll9zb2NpYWxDb250ZW50XzF0eXFrXzEuX3RhYkNvbnRlbnRfNzV0cnlfMTUgPiBkaXYuX21haW5fMXR5cWtfMTY5ID4gZGl2Ll9tYWluQ29udGVudF8xdHlxa18yNDEgPiBkaXYuX21haW5Db250ZW50UmlnaHRfMXR5cWtfMjQ5ID4gZGl2Ll9taW50Q29udGVudF8xdHlxa18yNTggPiBkaXYuX21pbnRDb250ZW50Rm9vdGVyXzF0eXFrXzMwOFwiXHJcbiAgKTtcclxuICBpZiAoY29udGFpbmVyKSB7XHJcbiAgICBjb25zdCBjb250cmFjdFNvbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcImJvZHkgPiBkaXYuTXVpRGlhbG9nLXJvb3QuTXVpTW9kYWwtcm9vdC5jc3MtMTI2eGowZiA+IGRpdi5NdWlEaWFsb2ctY29udGFpbmVyLk11aURpYWxvZy1zY3JvbGxQYXBlci5fc2Nyb2xsUGFwZXJfZ255bGlfMTguY3NzLWVrZWllMCA+IGRpdiA+IGRpdi5fc29jaWFsQ29udGVudF8xdHlxa18xLl90YWJDb250ZW50Xzc1dHJ5XzE1ID4gZGl2Ll9tYWluXzF0eXFrXzE2OSA+IGRpdi5fbWFpbkNvbnRlbnRfMXR5cWtfMjQxID4gZGl2Ll9tYWluQ29udGVudFJpZ2h0XzF0eXFrXzI0OSA+IGRpdi5fbWludENvbnRlbnRfMXR5cWtfMjU4ID4gZGl2Ll9taW50Q29udGVudEZvb3Rlcl8xdHlxa18zMDggPiBkaXY6bnRoLWNoaWxkKDEpID4gZGl2XCJcclxuICAgICk7XHJcbiAgICBjb25zdCB0b3RhbFJlY3J1aXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcImJvZHkgPiBkaXYuTXVpRGlhbG9nLXJvb3QuTXVpTW9kYWwtcm9vdC5jc3MtMTI2eGowZiA+IGRpdi5NdWlEaWFsb2ctY29udGFpbmVyLk11aURpYWxvZy1zY3JvbGxQYXBlci5fc2Nyb2xsUGFwZXJfZ255bGlfMTguY3NzLWVrZWllMCA+IGRpdiA+IGRpdi5fc29jaWFsQ29udGVudF8xdHlxa18xLl90YWJDb250ZW50Xzc1dHJ5XzE1ID4gZGl2Ll9tYWluXzF0eXFrXzE2OSA+IGRpdi5fbWFpbkNvbnRlbnRfMXR5cWtfMjQxID4gZGl2Ll9tYWluQ29udGVudFJpZ2h0XzF0eXFrXzI0OSA+IGRpdi5fbWludENvbnRlbnRfMXR5cWtfMjU4ID4gZGl2Ll9taW50Q29udGVudEhlYWRlcl8xdHlxa18yODcgPiBkaXY6bnRoLWNoaWxkKDIpID4gZGl2XCJcclxuICAgICk7XHJcbiAgICBjaGFuY2VQZXJUaWNrZXQgPVxyXG4gICAgICAocGFyc2VGbG9hdCh0b3RhbFJlY3J1aXQudGV4dENvbnRlbnQpIC9cclxuICAgICAgICBwYXJzZUZsb2F0KGNvbnRyYWN0U29sZC50ZXh0Q29udGVudCkpICpcclxuICAgICAgMTAwO1xyXG5cclxuICAgIGNvbnN0IG5ld0VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbmV3RWxlbS5jbGFzc05hbWUgPSBcIl9taW50Q29udGVudEhlYWRlclN0YXRfMXR5cWtfMzM3XCI7XHJcbiAgICBuZXdFbGVtLmlubmVySFRNTCA9IGBcclxuICAgIDxwIGNsYXNzPVwiX21pbnRDb250ZW50TGFiZWxfMXR5cWtfMzc4XCI+Y2hhbmNlIHBlciBjb250cmFjdDwvcD5cclxuICAgIDxkaXYgY2xhc3M9XCJfbWludENvbnRlbnRIZWFkZXJTdGF0VmFsdWVfMXR5cWtfMzk4XCI+JHtjaGFuY2VQZXJUaWNrZXQudG9GaXhlZChcclxuICAgICAgMlxyXG4gICAgKX0lPC9kaXY+XHJcbiAgICBgO1xyXG4gICAgY29udGFpbmVyLmluc2VydEJlZm9yZShuZXdFbGVtLCBjb250YWluZXIuY2hpbGRyZW5bMV0pO1xyXG4gICAgY29uc3QgaHViQnV0dG9uTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiYm9keSA+IGRpdi5NdWlEaWFsb2ctcm9vdC5NdWlNb2RhbC1yb290LmNzcy0xMjZ4ajBmID4gZGl2Lk11aURpYWxvZy1jb250YWluZXIuTXVpRGlhbG9nLXNjcm9sbFBhcGVyLl9zY3JvbGxQYXBlcl9nbnlsaV8xOC5jc3MtZWtlaWUwID4gZGl2ID4gZGl2Ll9uYXZpZ2F0aW9uXzc1dHJ5XzI3ID4gdWwgPiBsaTpudGgtY2hpbGQoMSlcIlxyXG4gICAgKTtcclxuICAgIGh1YkJ1dHRvbkxpc3QuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgXCJjbGlja1wiLFxyXG4gICAgICAoKSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dChuZnRSZWNydWl0bWVudCwgNTAwKTtcclxuICAgICAgICBzZXRUaW1lb3V0KHJhZmZsZVRpY2tldCwgNTAwKTtcclxuICAgICAgICBzZXRUaW1lb3V0KExvY2F0aW9uU3RhdHMsIDUwMCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHsgb25jZTogdHJ1ZSB9XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmFmZmxlVGlja2V0KCkge1xyXG4gIGlmIChpbkh1YiA9PT0gdHJ1ZSkge1xyXG4gICAgLy8gIOKGk+KGkyBwYXRoIG9mIHRoZSByYWZmZWwxIHJhZmZsZTIgKCBhbGwgdGhlIHRhYikg4oaT4oaTXHJcbiAgICBjb25zdCBlbGVtMSA9IHNlYXJjaEVsZW1lbnQoXCJPUkFOR1VUQU5TIENPTUlOR1wiKTtcclxuICAgIGNvbnN0IGVsZW0yID1cclxuICAgICAgZWxlbTEucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV1cclxuICAgICAgICAuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMV0uZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG4gICAgY29uc3QgdGFiMSA9IGVsZW0yLmNoaWxkcmVuWzBdO1xyXG4gICAgY29uc3QgdGFiMiA9IGVsZW0yLmNoaWxkcmVuWzFdO1xyXG4gICAgY29uc3QgcmFmZmxlTG9jMSA9IHRhYjEuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF07XHJcbiAgICBjb25zdCByYWZmbGVMb2MyID0gdGFiMi5jaGlsZHJlblswXS5jaGlsZHJlblswXTtcclxuICAgIC8vICDihpPihpNwYXRoIHdoZXJlIHRvdGFsIGl0ZW0gaW4gdGhlIHJhZmZsZSAg4oaT4oaTXHJcbiAgICBjb25zdCBxdHlSYWZmbGUxID0gcmFmZmxlTG9jMS5jaGlsZHJlblsxXTtcclxuICAgIGNvbnN0IHF0eVJhZmZsZTIgPSByYWZmbGVMb2MyLmNoaWxkcmVuWzFdO1xyXG4gICAgY29uc3QgbmFtZUNsYXNzID0gcXR5UmFmZmxlMS5jbGFzc05hbWU7XHJcbiAgICAvLyAg4oaT4oaTIHBhdGggd2hlcmUgdG90YWwgdGlja2V0IHB1cmNoYXNlZCBieSBhbGwgcGxheWVycyDihpPihpNcclxuICAgIGNvbnN0IHF0eVRpY2tldDEgPVxyXG4gICAgICB0YWIxLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzNdLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdO1xyXG4gICAgY29uc3QgcXR5VGlja2V0MiA9XHJcbiAgICAgIHRhYjIuY2hpbGRyZW5bMF0uY2hpbGRyZW5bM10uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMV07XHJcbiAgICBpZiAocXR5UmFmZmxlMSkge1xyXG4gICAgICBsZXQgY2xlYW5SYWZmbGUxID0gcXR5UmFmZmxlMS50ZXh0Q29udGVudDtcclxuICAgICAgbGV0IG1hdGNoZTEgPSBjbGVhblJhZmZsZTEubWF0Y2goL1xcZCsvKTtcclxuICAgICAgbGV0IHJhZmZsZTEgPSBwYXJzZUludChtYXRjaGUxKTtcclxuICAgICAgbGV0IGNsZWFuUmFmZmxlMiA9IHF0eVJhZmZsZTIudGV4dENvbnRlbnQ7XHJcbiAgICAgIGxldCBtYXRjaGUyID0gY2xlYW5SYWZmbGUyLm1hdGNoKC9cXGQrLyk7XHJcbiAgICAgIGxldCByYWZmbGUyID0gcGFyc2VJbnQobWF0Y2hlMik7XHJcbiAgICAgIGxldCBjbGVhbmVkVGlja2V0MSA9IHBhcnNlRmxvYXQocXR5VGlja2V0MS50ZXh0Q29udGVudCk7XHJcbiAgICAgIGxldCBjbGVhbmVkVGlja2V0MiA9IHBhcnNlRmxvYXQocXR5VGlja2V0Mi50ZXh0Q29udGVudCk7XHJcbiAgICAgIGxldCByYWZmbGVDaGFuY2UxID0gKHJhZmZsZTEgLyBjbGVhbmVkVGlja2V0MSkgKiAxMDA7XHJcbiAgICAgIGxldCByYWZmbGVDaGFuY2UyID0gKHJhZmZsZTIgLyBjbGVhbmVkVGlja2V0MikgKiAxMDA7XHJcbiAgICAgIHJvdW5kUmFmZmxlMSA9IHJhZmZsZUNoYW5jZTEudG9GaXhlZCgzKTtcclxuICAgICAgcm91bmRSYWZmbGUyID0gcmFmZmxlQ2hhbmNlMi50b0ZpeGVkKDMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyYWZmbGVMb2MxKSB7XHJcbiAgICAgIGlmIChodWJIdG1sID09PSBmYWxzZSkge1xyXG4gICAgICAgIGNvbnN0IGRpdjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdjEuY2xhc3NOYW1lID0gbmFtZUNsYXNzO1xyXG4gICAgICAgIGRpdjEuaWQgPSBcInJhZmZsZTFcIjtcclxuICAgICAgICBkaXYxLnRleHRDb250ZW50ID0gcm91bmRSYWZmbGUxICsgXCIlIGNoYW5jZSBwZXIgdGlja2V0XCI7XHJcbiAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJhZmZsZTFcIikpIHtcclxuICAgICAgICAgIHJhZmZsZUxvYzEuYXBwZW5kQ2hpbGQoZGl2MSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkaXYyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYyLmNsYXNzTmFtZSA9IG5hbWVDbGFzcztcclxuICAgICAgICBkaXYyLmlkID0gXCJyYWZmbGUyXCI7XHJcbiAgICAgICAgZGl2Mi50ZXh0Q29udGVudCA9IHJvdW5kUmFmZmxlMiArIFwiJSBjaGFuY2UgcGVyIHRpY2tldFwiO1xyXG4gICAgICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyYWZmbGUyXCIpKSB7XHJcbiAgICAgICAgICByYWZmbGVMb2MyLmFwcGVuZENoaWxkKGRpdjIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbm90aWZTb3VuZCgpIHtcclxuICBsZXQgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJub3RpZmljYXRpb25cIik7XHJcbiAgY29uc3QgZWxlbTEgPSBzZWFyY2hFbGVtZW50KFwiVGhlIGhlaXN0IGdhbWVcIik7XHJcbiAgY29uc3Qgbm90aWZDb3VudGVyID0gZWxlbTEucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblsxXTtcclxuICBsZXQgbm90aWYgPSBwYXJzZUZsb2F0KG5vdGlmQ291bnRlci50ZXh0Q29udGVudCk7XHJcblxyXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xyXG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiIHx8XHJcbiAgICAgICAgbXV0YXRpb24udHlwZSA9PT0gXCJjaGFyYWN0ZXJ4aHJOb3RpZmljYXRpb25EYXRhXCJcclxuICAgICAgKSB7XHJcbiAgICAgICAgbm90aWYgPSBwYXJzZUZsb2F0KG5vdGlmQ291bnRlci50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgaWYgKG5vdGlmID4gMCkge1xyXG4gICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgY2hhcmFjdGVyeGhyTm90aWZpY2F0aW9uRGF0YTogdHJ1ZSxcclxuICAgIHN1YnRyZWU6IHRydWUsXHJcbiAgfTtcclxuICBvYnNlcnZlci5vYnNlcnZlKG5vdGlmQ291bnRlciwgY29uZmlnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbm90aWZUcmFja2VyKCkge1xyXG4gIHZhciBvbGRYSFIgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3Q7XHJcblxyXG4gIGZ1bmN0aW9uIG5ld1hIUigpIHtcclxuICAgIGxldCByZWFsWEhSID0gbmV3IG9sZFhIUigpO1xyXG5cclxuICAgIHJlYWxYSFIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAocmVhbFhIUi5yZWFkeVN0YXRlID09IDQgJiYgcmVhbFhIUi5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgY29uc3QgZ2FuZ1VybFJlZ2V4ID0gL2h0dHBzOlxcL1xcL2FwaVxcLnRoZWhlaXN0XFwuZ2FtZVxcL2dhbmdcXC9cXGQrJC87XHJcbiAgICAgICAgaWYgKGdhbmdVcmxSZWdleC50ZXN0KHJlYWxYSFIucmVzcG9uc2VVUkwpKSB7XHJcbiAgICAgICAgICB4aHJHYW5nRGF0YSA9IEpTT04ucGFyc2UocmVhbFhIUi5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICByZWFsWEhSLnJlc3BvbnNlVVJMLmluY2x1ZGVzKFxyXG4gICAgICAgICAgICBcImh0dHBzOi8vYXBpLnRoZWhlaXN0LmdhbWUvbm90aWZpY2F0aW9uL2hpc3Rvcnk/b2Zmc2V0PTAmbGltaXQ9MTBcIlxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgeGhyTm90aWZpY2F0aW9uRGF0YSA9IEpTT04ucGFyc2UocmVhbFhIUi5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICByZWFsWEhSLnJlc3BvbnNlVVJMLmluY2x1ZGVzKFxyXG4gICAgICAgICAgICBcImh0dHBzOi8vYXBpLnRoZWhlaXN0LmdhbWUvbm90aWZpY2F0aW9uL2hpc3Rvcnk/b2Zmc2V0PTEwJmxpbWl0PTEwXCJcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGFkZE5ld05vdGlmKEpTT04ucGFyc2UocmVhbFhIUi5yZXNwb25zZVRleHQpKTtcclxuICAgICAgICAgIHNldFRpbWVvdXQob3Blbk5vdGlmUHJvZmlsZSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZWFsWEhSLnJlc3BvbnNlVVJMLmluY2x1ZGVzKFwiaHR0cHM6Ly9hcGkudGhlaGVpc3QuZ2FtZS9hdXRoL21lXCIpKSB7XHJcbiAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlYWxYSFIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgIHVzZXJXYWxsZXQgPSByZXNwb25zZS5pZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gcmVhbFhIUjtcclxuICB9XHJcbiAgd2luZG93LlhNTEh0dHBSZXF1ZXN0ID0gbmV3WEhSO1xyXG4gIGNvbnN0IGVsZW0xID0gc2VhcmNoRWxlbWVudChcIlRoZSBoZWlzdCBnYW1lXCIpO1xyXG4gIGNvbnN0IGVsZW1lbnRUb09ic2VydmUgPSBlbGVtMS5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdO1xyXG5cclxuICBjb25zdCBvYnNlcnZlckNhbGxiYWNrID0gKG11dGF0aW9uc0xpc3QsIG9ic2VydmVyKSA9PiB7XHJcbiAgICBtdXRhdGlvbnNMaXN0LmZvckVhY2goKG11dGF0aW9uKSA9PiB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBtdXRhdGlvbi50eXBlID09PSBcImF0dHJpYnV0ZXNcIiAmJlxyXG4gICAgICAgIG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09IFwiY2xhc3NcIlxyXG4gICAgICApIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50Q2xhc3NlcyA9IGVsZW1lbnRUb09ic2VydmUuY2xhc3NOYW1lO1xyXG4gICAgICAgIGNvbnN0IGNsYXNzQ2hhbmdlID0gY3VycmVudENsYXNzZXMuaW5jbHVkZXMoXCJfYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICBpZiAoY2xhc3NDaGFuZ2UpIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQob3Blbk5vdGlmUHJvZmlsZSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIob2JzZXJ2ZXJDYWxsYmFjayk7XHJcbiAgY29uc3Qgb2JzZXJ2ZXJDb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0gfTtcclxuICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnRUb09ic2VydmUsIG9ic2VydmVyQ29uZmlnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb3Blbk5vdGlmUHJvZmlsZSgpIHtcclxuICBjb25zdCBub3RpZkxpc3RQYXRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgIFwiI25vdGlmaWNhdGlvbi1zY3JvbGxlciA+IGRpdiA+IGRpdlwiXHJcbiAgKS5jaGlsZHJlbjtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5vdGlmTGlzdFBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBpdGVtID0gbm90aWZMaXN0UGF0aFtpXTtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgbGV0IHdhbGxldCA9IHhock5vdGlmaWNhdGlvbkRhdGFbaV0ud2FsbGV0SWQ7XHJcbiAgICAgIHNlYXJjaFBsYXllcih3YWxsZXQsIHhock5vdGlmaWNhdGlvbkRhdGFbaV0ud2FsbGV0LnVzZXJuYW1lKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTmV3Tm90aWYobmV3Tm90aWYpIHtcclxuICBsZXQgbm90aWZJbmRleCA9IE9iamVjdC5rZXlzKHhock5vdGlmaWNhdGlvbkRhdGEpLmxlbmd0aDtcclxuICBuZXdOb3RpZi5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgeGhyTm90aWZpY2F0aW9uRGF0YVtub3RpZkluZGV4ICsgaW5kZXhdID0gaXRlbTtcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VhcmNoUGxheWVyKHdhbGxldEFkcmVzcywgcGxheWVyTmFtZSkge1xyXG4gIGNvbnN0IGh1YkJ0biA9IHNlYXJjaEVsZW1lbnQoXCJIdWJcIik7XHJcbiAgaHViQnRuLmNsaWNrKCk7XHJcbiAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgY29uc3Qgc29jaWFsID0gc2VhcmNoRWxlbWVudChcIlNvY2lhbFwiKTtcclxuICAgIGlmIChzb2NpYWwpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgIHNvY2lhbC5jbGljaygpO1xyXG4gICAgICBsZXQgY2hlY2tMb2FkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaEJ0biA9IHNlYXJjaEVsZW1lbnQoXCJQbGF5ZXIgc2VhcmNoXCIpLmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgIGlmIChzZWFyY2hCdG4pIHtcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY2hlY2tMb2FkKTtcclxuICAgICAgICAgIHNlYXJjaEJ0bi5jbGljaygpO1xyXG4gICAgICAgICAgbGV0IGNoZWNrTG9hZDIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlSG9sZGVyID0gc2VhcmNoUGxhY2Vob2xkZXIoXCJQbGF5ZXIgU2VhcmNoXCIpO1xyXG4gICAgICAgICAgICBpZiAocGxhY2VIb2xkZXIpIHtcclxuICAgICAgICAgICAgICBjbGVhckludGVydmFsKGNoZWNrTG9hZDIpO1xyXG4gICAgICAgICAgICAgIGxldCBpbnB1dEV2ZW50ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5IVE1MSW5wdXRFbGVtZW50LnByb3RvdHlwZSxcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIlxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgaW5wdXRFdmVudC5zZXQuY2FsbChwbGFjZUhvbGRlciwgd2FsbGV0QWRyZXNzKTtcclxuICAgICAgICAgICAgICBwbGFjZUhvbGRlci5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICAgICAgbGV0IGNoZWNrTG9hZDMgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwbGF5ZXJQYXRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgXCIjcGxheWVyLXNjcm9sbGVyID4gZGl2LmluZmluaXRlLXNjcm9sbC1jb21wb25lbnRfX291dGVyZGl2ID4gZGl2ID4gZGl2ID4gZGl2XCJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocGxheWVyUGF0aC50ZXh0Q29udGVudCA9PSBwbGF5ZXJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjaGVja0xvYWQzKTtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXJQYXRoLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWRkSW52aXRlQnV0dG9uSW5Qcm9maWxlKCk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LCAzMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIDMwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH1cclxuICB9LCAzMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhvd01hbnlMZWZ0Q2xhc3MoZWxlbWVudCkge1xyXG4gIGNvbnN0IGNsYXNzZXMgPSBlbGVtZW50LmNsYXNzTmFtZS5zcGxpdChcIiBcIik7XHJcbiAgY29uc3QgbW90aWYgPSAvX2xlZnQvO1xyXG4gIGxldCBjb3VudCA9IDA7XHJcblxyXG4gIGNsYXNzZXMuZm9yRWFjaCgoY2xhc3NlKSA9PiB7XHJcbiAgICBpZiAobW90aWYudGVzdChjbGFzc2UpKSB7XHJcbiAgICAgIGNvdW50Kys7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGNvdW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBnYW5nTWVudShwYXRoKSB7XHJcbiAgY29uc3QgZ2FuZ0J0biA9IHBhdGg7XHJcblxyXG4gIGlmIChnYW5nQnRuKSB7XHJcbiAgICBnYW5nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIFwiY2xpY2tcIixcclxuICAgICAgKCkgPT4ge1xyXG4gICAgICAgIGxldCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgIC8vIOKGk+KGkyByZXRyaWV2ZSBlbGVtZW50IHRvIG9ic2VydmUgKCBsZWZ0IGdhbmcgdGFiKSDihpPihpNcclxuICAgICAgICAgIGxldCBlbGVtZW50VG9PYnNlcnZlO1xyXG4gICAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbmctc2Nyb2xsZXJcIik7XHJcbiAgICAgICAgICBjb25zdCBtZW1iZXJzUGF0aCA9IHNlYXJjaEVsZW1lbnQoXCJNRU1CRVJTXCIpO1xyXG4gICAgICAgICAgbGV0IGNsb3NlQnRuO1xyXG4gICAgICAgICAgaWYgKGNoaWxkKSB7XHJcbiAgICAgICAgICAgIGNsb3NlQnRuID0gc2VhcmNoRWxlbWVudChcIlZJRVcgR0FOR1wiKS5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICAgIGVsZW1lbnRUb09ic2VydmUgPSBjaGlsZC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKG1lbWJlcnNQYXRoKSB7XHJcbiAgICAgICAgICAgIGxldCBiYWNrQnV0dG9uID1cclxuICAgICAgICAgICAgICBzZWFyY2hFbGVtZW50KFwiQkFDS1wiKS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV1cclxuICAgICAgICAgICAgICAgIC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICAgICAgY2xvc2VCdG4gPSBiYWNrQnV0dG9uO1xyXG4gICAgICAgICAgICBlbGVtZW50VG9PYnNlcnZlID1cclxuICAgICAgICAgICAgICBtZW1iZXJzUGF0aC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG1lbWJlcnNQYXRoKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICBnZXRHYW5nUGxheWVyKGVsZW1lbnRUb09ic2VydmUsIGNsb3NlQnRuKTtcclxuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXJDYWxsYmFjayA9IChtdXRhdGlvbnNMaXN0LCBvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICAgIG11dGF0aW9uc0xpc3QuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgbXV0YXRpb24udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIgJiZcclxuICAgICAgICAgICAgICAgICAgbXV0YXRpb24uYXR0cmlidXRlTmFtZSA9PT0gXCJjbGFzc1wiXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBob3dNYW55TGVmdENsYXNzKGVsZW1lbnRUb09ic2VydmUpO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXRHYW5nUGxheWVyKGVsZW1lbnRUb09ic2VydmUsIGNsb3NlQnRuKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG9ic2VydmVyQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlckNvbmZpZyA9IHtcclxuICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudFRvT2JzZXJ2ZSwgb2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChjaGlsZCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcclxuICAgICAgICAgICAgY29uc3Qgb2JzZXJ2ZXJDYWxsYmFjayA9IChtdXRhdGlvbnNMaXN0LCBvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICAgIG11dGF0aW9uc0xpc3QuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgbXV0YXRpb24udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIgJiZcclxuICAgICAgICAgICAgICAgICAgbXV0YXRpb24uYXR0cmlidXRlTmFtZSA9PT0gXCJjbGFzc1wiXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBob3dNYW55TGVmdENsYXNzKGVsZW1lbnRUb09ic2VydmUpO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoc3RhdGUgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnZXRHYW5nUGxheWVyKGVsZW1lbnRUb09ic2VydmUsIGNsb3NlQnRuKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG9ic2VydmVyQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlckNvbmZpZyA9IHtcclxuICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0sXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudFRvT2JzZXJ2ZSwgb2JzZXJ2ZXJDb25maWcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDUwKTtcclxuICAgICAgfSxcclxuICAgICAgeyBvbmNlOiB0cnVlIH1cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRHYW5nUGxheWVyKHBhcmVudCwgY2xvc2VCdG4pIHtcclxuICBsZXQgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICBjb25zdCBjaGlsZDEgPSBwYXJlbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF07XHJcbiAgICBjb25zdCBwbGF5ZXJQYXRoID0gY2hpbGQxLmNoaWxkcmVuWzFdO1xyXG4gICAgaWYgKHBsYXllclBhdGgpIHtcclxuICAgICAgbGV0IGZpcnN0Q2hpbGQgPSBwbGF5ZXJQYXRoLmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgICBsZXQgY2xhc3NOYW1lID0gcGxheWVyUGF0aC5jaGlsZHJlblsxXS5jbGFzc05hbWU7XHJcbiAgICAgIGlmIChmaXJzdENoaWxkICYmIGZpcnN0Q2hpbGQuY2xhc3NOYW1lICE9IGNsYXNzTmFtZSkge1xyXG4gICAgICAgIHBsYXllclBhdGgucmVtb3ZlQ2hpbGQocGxheWVyUGF0aC5jaGlsZHJlblswXSk7XHJcbiAgICAgIH1cclxuICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgIGxldCBtZW1iZXJzaGlwc0luZGV4ID0gMDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJQYXRoLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcGxheWVyUGF0aC5jaGlsZHJlbltpXS5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcclxuICAgICAgICBtZW1iZXJzaGlwc0luZGV4ID0gaTtcclxuICAgICAgICBpZiAoeGhyR2FuZ0RhdGEubWVtYmVyc2hpcHNbaV0uc3RhdHVzID09PSBcIkxlZnRcIikge1xyXG4gICAgICAgICAgbWVtYmVyc2hpcHNJbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaXRlbSA9IHBsYXllclBhdGguY2hpbGRyZW5baV07XHJcbiAgICAgICAgbGV0IG1lbWJlciA9IHhockdhbmdEYXRhLm1lbWJlcnNoaXBzW21lbWJlcnNoaXBzSW5kZXhdO1xyXG5cclxuICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICBsZXQgcGxheWVyTmFtZSA9IG1lbWJlci53YWxsZXQudXNlcm5hbWU7XHJcbiAgICAgICAgICBsZXQgd2FsbGV0ID0gbWVtYmVyLndhbGxldElkO1xyXG5cclxuICAgICAgICAgIG9wZW5Qcm9maWxlRnJvbUdhbmcocGxheWVyTmFtZSwgd2FsbGV0LCBjbG9zZUJ0bik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LCAzMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvcGVuUHJvZmlsZUZyb21HYW5nKHVzZXJuYW1lLCB3YWxsZXQsIGNsb3NlQnRuKSB7XHJcbiAgbGV0IGludGVydmFsMSA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgIGlmIChjbG9zZUJ0bikge1xyXG4gICAgICBjbGVhckludGVydmFsKGludGVydmFsMSk7XHJcbiAgICAgIGNsb3NlQnRuLmNsaWNrKCk7XHJcbiAgICAgIGxldCBpbnRlcnZhbDIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaHViQnRuID0gc2VhcmNoRWxlbWVudChcIkh1YlwiKTtcclxuICAgICAgICBpZiAoaHViQnRuKSB7XHJcbiAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsMik7XHJcbiAgICAgICAgICBodWJCdG4uY2xpY2soKTtcclxuICAgICAgICAgIGxldCBpbnRlcnZhbDMgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNvY2lhbEJ0biA9IHNlYXJjaEVsZW1lbnQoXCJTb2NpYWxcIik7XHJcbiAgICAgICAgICAgIGlmIChzb2NpYWxCdG4pIHtcclxuICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsMyk7XHJcbiAgICAgICAgICAgICAgc29jaWFsQnRuLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgbGV0IGludGVydmFsNCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlYXJjaFBsYXllckJ0biA9XHJcbiAgICAgICAgICAgICAgICAgIHNlYXJjaEVsZW1lbnQoXCJQbGF5ZXIgc2VhcmNoXCIpLmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFBsYXllckJ0bikge1xyXG4gICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsNCk7XHJcbiAgICAgICAgICAgICAgICAgIHNlYXJjaFBsYXllckJ0bi5jbGljaygpO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWw1ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYWNlSG9sZGVyID0gc2VhcmNoUGxhY2Vob2xkZXIoXCJQbGF5ZXIgU2VhcmNoXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGFjZUhvbGRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbDUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGlucHV0RXZlbnQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuSFRNTElucHV0RWxlbWVudC5wcm90b3R5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidmFsdWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGlucHV0RXZlbnQuc2V0LmNhbGwocGxhY2VIb2xkZXIsIHdhbGxldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBwbGFjZUhvbGRlci5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRXZlbnQoXCJpbnB1dFwiLCB7IGJ1YmJsZXM6IHRydWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgaW50ZXJ2YWw2ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwbGF5ZXJQYXRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIiNwbGF5ZXItc2Nyb2xsZXIgPiBkaXYuaW5maW5pdGUtc2Nyb2xsLWNvbXBvbmVudF9fb3V0ZXJkaXYgPiBkaXYgPiBkaXYgPiBkaXZcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyUGF0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXJQYXRoLnRleHRDb250ZW50ID09IHVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsNik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJQYXRoLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRJbnZpdGVCdXR0b25JblByb2ZpbGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH0sIDMwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0sIDMwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LCAzMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIDMwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDMwKTtcclxuICAgIH1cclxuICB9LCAzMCk7XHJcbn1cclxubGV0IG9wdGlvbjE7XHJcbmZ1bmN0aW9uIG1pc2NPcHRpb25zKHBhdGgpIHtcclxuICBsZXQgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJyZWFkeVwiKTtcclxuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgdHJ5IHtcclxuICAgIGlmICghb3B0aW9uMSkge1xyXG4gICAgICBvcHRpb24xID0gaW5pdE9wdGlvbjEoKTtcclxuICAgIH1cclxuICAgIGlmIChwYXRoID09PSBcImxvY2F0aW9uc1wiIHx8IHBhdGggPT09IFwidmF1bHRcIikge1xyXG4gICAgICByZXR1cm4gb3B0aW9uMShwYXRoKTtcclxuICAgIH1cclxuICAgIGxldCBzd2l0Y2hGdW5jdGlvbnMgPSBbb3B0aW9uczAsIG9wdGlvbjEsIG9wdGlvbnMyXTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBcIm1pc2NPcHRpb25zXCIsXHJcbiAgICAgIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LmRldGFpbC5mb3JFYWNoKChzd2l0Y2hTdGF0ZSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgIGlmIChzd2l0Y2hTdGF0ZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaEZ1bmN0aW9uc1tpbmRleF0odHJ1ZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIHsgb25jZTogdHJ1ZSB9XHJcbiAgICApO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9wdGlvbnMwKCkge1xyXG4gICAgICBsZXQgaW50ZXJ2YWwxID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBvbGljZVN0YXRpb24gPSBzZWFyY2hFbGVtZW50KFwiUG9saWNlIFN0YXRpb25cIik7XHJcbiAgICAgICAgaWYgKHBvbGljZVN0YXRpb24pIHtcclxuICAgICAgICAgIGNvbnN0IGFuaW1hdGVkTGlzdCA9XHJcbiAgICAgICAgICAgIHBvbGljZVN0YXRpb24ucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc05hbWU7XHJcbiAgICAgICAgICBpZiAoYW5pbWF0ZWRMaXN0KSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwxKTtcclxuICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIgKyBhbmltYXRlZExpc3QpO1xyXG4gICAgICAgICAgICBlbGVtLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgNTAwKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGluaXRPcHRpb24xKCkge1xyXG4gICAgICBsZXQgYWN0aXZlO1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gb3B0aW9uMShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZGF0YSA9PSBcImJvb2xlYW5cIikge1xyXG4gICAgICAgICAgYWN0aXZlID0gZGF0YTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFhY3RpdmUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGEgPT0gXCJsb2NhdGlvbnNcIikge1xyXG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VG9wQXBlTG9jKCk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGF0YSA9PSBcInZhdWx0XCIpIHtcclxuICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRvcEFwZVZhdWx0KCk7XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzZXRUb3BBcGVWYXVsdCgpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChjaGltcFRhbmcpIHtcclxuICAgICAgICAgICAgICBjb25zdCBuZnRzID1cclxuICAgICAgICAgICAgICAgIHNlYXJjaEVsZW1lbnQoXCJTaG93IEluZm9cIikucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICAgICAgY29uc3QgdGFuZ0J1dHRvbiA9XHJcbiAgICAgICAgICAgICAgICBuZnRzLmZpcnN0RWxlbWVudENoaWxkLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdLmNoaWxkcmVuWzFdO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJpbGxhQnV0dG9uID1cclxuICAgICAgICAgICAgICAgIG5mdHMuZmlyc3RFbGVtZW50Q2hpbGQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMV0uY2hpbGRyZW5bMl07XHJcblxyXG4gICAgICAgICAgICAgIGxldCBDaGltcCA9IDA7XHJcbiAgICAgICAgICAgICAgbGV0IFRhbmcgPSAwO1xyXG4gICAgICAgICAgICAgIGxldCBSaWxsYSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbXBUYW5nLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXBlID0gY2hpbXBUYW5nW2ldLnNwZWNpZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXBlID09PSBcIk9yYW5ndXRhblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIFRhbmcrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhcGUgPT09IFwiQ2hpbXBcIikge1xyXG4gICAgICAgICAgICAgICAgICBDaGltcCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAoZ29yaWxsYS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdvcmlsbGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgUmlsbGErKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgY29uc3QgdG9wQXBlID0gTWF0aC5tYXgoQ2hpbXAsIFRhbmcsIFJpbGxhKTtcclxuICAgICAgICAgICAgICBpZiAodG9wQXBlID09PSBUYW5nKSB0YW5nQnV0dG9uLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgaWYgKHRvcEFwZSA9PT0gUmlsbGEpIHJpbGxhQnV0dG9uLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzZXRUb3BBcGVMb2MoKSB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoY2hpbXBUYW5nKSB7XHJcbiAgICAgICAgICAgICAgbGV0IENoaW1wID0gMDtcclxuICAgICAgICAgICAgICBsZXQgVGFuZyA9IDA7XHJcbiAgICAgICAgICAgICAgbGV0IFJpbGxhID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGltcFRhbmcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBhcGUgPSBjaGltcFRhbmdbaV0uc3BlY2llcztcclxuICAgICAgICAgICAgICAgIGlmIChhcGUgPT09IFwiT3Jhbmd1dGFuXCIpIHtcclxuICAgICAgICAgICAgICAgICAgVGFuZysrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGFwZSA9PT0gXCJDaGltcFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIENoaW1wKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChnb3JpbGxhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ29yaWxsYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICBSaWxsYSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgbGV0IGNoZWNrQ2hpbXAgPSBzZWFyY2hFbGVtZW50KFwiTXkgQ2hpbXBzXCIpO1xyXG4gICAgICAgICAgICAgIGlmICghY2hlY2tDaGltcCkgY2hlY2tDaGltcCA9IHNlYXJjaEVsZW1lbnQoXCJNeSBPcmFuZ3V0YW5zXCIpO1xyXG4gICAgICAgICAgICAgIGlmICghY2hlY2tDaGltcCkgY2hlY2tDaGltcCA9IHNlYXJjaEVsZW1lbnQoXCJNeSBHb3JpbGxhc1wiKTtcclxuICAgICAgICAgICAgICBjb25zdCBhcGVzTGlzdCA9IGNoZWNrQ2hpbXAubmV4dEVsZW1lbnRTaWJsaW5nLmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGNoaW1wQnV0dG9uID0gYXBlc0xpc3QuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgY29uc3QgdGFuZ0J1dHRvbiA9IGFwZXNMaXN0LmNoaWxkcmVuWzFdO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJpbGxhQnV0dG9uID0gYXBlc0xpc3QuY2hpbGRyZW5bMl07XHJcbiAgICAgICAgICAgICAgY29uc3QgaW5Mb2NDaGltcCA9IHBhcnNlRmxvYXQoXHJcbiAgICAgICAgICAgICAgICBjaGltcEJ1dHRvbi5jaGlsZHJlblsxXS50ZXh0Q29udGVudFxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgY29uc3QgaW5Mb2NUYW5nID0gcGFyc2VGbG9hdCh0YW5nQnV0dG9uLmNoaWxkcmVuWzFdLnRleHRDb250ZW50KTtcclxuICAgICAgICAgICAgICBjb25zdCBpbkxvY1JpbGxhID0gcGFyc2VGbG9hdChcclxuICAgICAgICAgICAgICAgIHJpbGxhQnV0dG9uLmNoaWxkcmVuWzFdLnRleHRDb250ZW50XHJcbiAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICBjb25zdCB0b3BBcGUgPSBNYXRoLm1heChpbkxvY0NoaW1wLCBpbkxvY1JpbGxhLCBpbkxvY1RhbmcpO1xyXG4gICAgICAgICAgICAgIGlmICh0b3BBcGUgPT09IGluTG9jQ2hpbXApIHJldHVybjtcclxuICAgICAgICAgICAgICBpZiAodG9wQXBlID09PSBpbkxvY1JpbGxhKSByaWxsYUJ1dHRvbi5jbGljaygpO1xyXG4gICAgICAgICAgICAgIGlmICh0b3BBcGUgPT09IGluTG9jVGFuZykgdGFuZ0J1dHRvbi5jbGljaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBvcHRpb25zMigpIHt9XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGFwZU9sZFhIUiA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcclxuZnVuY3Rpb24gb2JzZXJ2ZUFwZVhIUigpIHtcclxuICBsZXQgcmVhbFhIUiA9IG5ldyBhcGVPbGRYSFIoKTtcclxuXHJcbiAgcmVhbFhIUi5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAocmVhbFhIUi5yZWFkeVN0YXRlID09IDQgJiYgcmVhbFhIUi5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICByZWFsWEhSLnJlc3BvbnNlVVJMLmluY2x1ZGVzKFwiaHR0cHM6Ly9hcGkudGhlaGVpc3QuZ2FtZS9uZnQvbXktcm9iYmVyc1wiKVxyXG4gICAgICApIHtcclxuICAgICAgICBjaGltcFRhbmcgPSBKU09OLnBhcnNlKHJlYWxYSFIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgcmVhbFhIUi5yZXNwb25zZVVSTC5pbmNsdWRlcyhcImh0dHBzOi8vYXBpLnRoZWhlaXN0LmdhbWUvbmZ0L215LWNvcHNcIilcclxuICAgICAgKSB7XHJcbiAgICAgICAgZ29yaWxsYSA9IEpTT04ucGFyc2UocmVhbFhIUi5yZXNwb25zZVRleHQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuICByZXR1cm4gcmVhbFhIUjtcclxufVxyXG53aW5kb3cuWE1MSHR0cFJlcXVlc3QgPSBvYnNlcnZlQXBlWEhSO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=