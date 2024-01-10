let withdrawBtnPath;
let xhrGangData;
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
}

function hubTab2() {
  //  market
}

function hubTab3() {
  //  blackMarket
}

function hubTab4() {
  //  rewards
}

function hubTab5() {
  //  cosmetic
}

function hubTab6() {
  //  cosmetic store
}

function startObservingWithdraw() {
  //   ↓↓ location of the withdraw / deposit Tab ↓↓
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
