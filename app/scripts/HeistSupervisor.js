const axios = require("axios").default;

let baseline;
let jailbreak;
let locationsData = {};
let cleanBaseline = {};
const locationsId = {
  "Havana Holdings": 14,
  "Bozo Bazar": 15,
  "Flashbang Finances": 16,
  "Paperhand Plaza": 17,
  "Summit Savings": 18,
  "Primate Plunder": 19,
  "Treetop Trust": 20,
};
let manageLocationStyleObserver;

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
let isKiwiSelected = false;
let isNanaSelected = false;
let inHub = false;
let roundRaffle1;
let roundRaffle2;
let hubHtml = false;
let chimpTang;
let gorilla;
const walletAddressRegex =
  /https:\/\/api\.theheist\.game\/nft\/robbers\/wallet-top-performing\/([\w]+)/;

(function () {
  initFunction2();
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
// error --> add wait element to title
function searchElement(query) {
  const element = document.querySelectorAll("button, h3, h2, h1, span, div, p");
  for (let elem of element) {
    if (elem.textContent.trim() === query) {
      return elem;
    }
  }
  return null;
}

// ↓↓ wait for the loading of element ↓↓
function waitForElem(searchFunction, abortPromise) {
  return new Promise((resolve, reject) => {
    let elem = searchFunction();
    if (elem) {
      resolve(elem);
    } else {
      const observer = new MutationObserver((mutations, obs) => {
        if (abortPromise && abortPromise.cancelled) {
          obs.disconnect();
          return;
        }
        const querry = searchFunction();
        if (querry) {
          obs.disconnect();
          clearTimeout(timeout);
          resolve(querry);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = setTimeout(() => {
        observer.disconnect();
        if (abortPromise && !abortPromise.cancelled) {
          console.error("unable to retrieve : ", searchFunction);
          reject(new Error("Unable to retrieve path from ", searchFunction));
        }
      }, 10000);
    }
  });
}
function waitForFirstElem(searchFunctions) {
  const abortPromise = { cancelled: false };
  const promises = searchFunctions.map((searchFunction) =>
    waitForElem(searchFunction, abortPromise)
  );
  const race = Promise.race(promises);
  race.then(() => {
    abortPromise.cancelled = true;
  });
  return race;
}

function initFunction2() {
  getLocationData();
  waitForElem(() => searchElement("Settings")).then((settingsButton) => {
    startObservingWithdraw();
    manageClickedMenu();
  });

  waitForElem(() => searchElement("Heist Chat")).then((chatPath) => {
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
  });

  // waitForElem(() => searchElement("The heist game")).then(() => {
  //   notifTracker();
  //   notifSound();
  // });
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
  const getKiwiTotal = withdrawBtnPath.children[0].children[0].children[1];
  const getNanaTotal = withdrawBtnPath.children[0].children[2].children[1];
  waitForElem(() => searchElement("Amount:")).then((elem1) => {
    const placeHolder = elem1.firstElementChild.firstElementChild;
    const depositButtonPath = elem1.parentElement.children[4];
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
    let withdrawLoc = elem1.parentElement.parentElement.parentElement;
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
        elem1.parentElement.children[1].firstElementChild.firstElementChild;
      getMoneyId = getMoneyIdLoc.getAttribute("aria-label");
    }, 100);
    if (getKiwiTotal) {
      let arialLabelCoco = getKiwiTotal.getAttribute("aria-label");
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
      if (getMoneyId.includes("KIWI")) {
        isKiwiSelected = true;
        const match = getMoneyId.match(/(\d|,)+/);
        const matchAmount = match[0];
        let cleanedKiwi = matchAmount.replace(/,/g, ".");
        Amount = cleanedKiwi;
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
  });
}

// start observing and manage click on side menue
function manageClickedMenu() {
  let activeSideMenu = "";
  const buttonListener = new Map();
  const sideBar = document.getElementById("dialog-sidebar");
  const config = { childList: true };
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.className.includes("undefined")) {
              activeSideMenu = "";
              manageClick();
            }
          }
        });
      }
    }
  });
  observer.observe(sideBar, config);
  function manageClick() {
    for (const button of sideBar.children[1].children) {
      if (!buttonListener.has(button)) {
        if (
          !button.className.includes("grayscale") &&
          button.lastElementChild.textContent != activeSideMenu
        ) {
          handleClick(button);
          break;
        }

        const listener = () => handleClick(button);
        button.addEventListener("click", listener);
        buttonListener.set(button, listener);
      }
    }
  }
  function handleClick(buttonElem) {
    if (buttonElem.lastElementChild.textContent != activeSideMenu) {
      activeSideMenu = buttonElem.lastElementChild.textContent;
      const listener = buttonListener.get(buttonElem);
      if (listener) {
        buttonElem.removeEventListener("click", listener);
        buttonListener.delete(buttonElem);
      }
      switch (activeSideMenu) {
        case "Trips":
          tripsFunction();
          break;
        case "Apes":
          apesFunction();
          break;
        case "Jail Break":
          jailbreakFunction();
          break;
        case "Land":
          landFunction();
          break;
      }
    }
    manageClick();
  }
}
//start function of side menue ( apes / trips / land / jailbreak )
function tripsFunction() {
  // check if lootTrip or heist is selected
  waitForElem(() => searchElement("Loot Trips"))
    .then((result) => {
      const locationSwitch = result.parentElement.parentElement;
      for (const button of locationSwitch.children) {
        if (button.className.includes("--active")) {
          switch (button.firstElementChild.textContent) {
            case "Loot Trips":
              //loottrip function
              break;
            case "Heists":
              heistsFunction(locationSwitch);
          }
          observeLocationType(locationSwitch);
          // manage active content
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
  //observer future change btw lootrip and heist
  function observeLocationType(buttonSwitch) {
    const config = {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    };
    const elementToObserve = buttonSwitch;
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.target.className.includes("active")) {
          switch (mutation.target.firstElementChild.textContent) {
            case "Loot Trips":
              manageLocationStyleObserver.disconnect();
              const elements = document.querySelectorAll(".emissionColor");
              elements.forEach((element) => {
                element.remove();
              });
              lootTripFunction(buttonSwitch);
              break;
            case "Heists":
              heistsFunction(buttonSwitch);
              break;
          }
        }
      }
    });
    observer.observe(elementToObserve, config);
  }
  // function of lootTrip and Heists
  function lootTripFunction(buttonSwitch) {}
  function heistsFunction(buttonSwitch) {
    const locationUl = buttonSwitch.nextElementSibling.firstElementChild;
    let childList = [];
    const [rillaEmissionColor, apeEmissionColor] = parseBaselineData();

    for (const location of locationUl.children) {
      const child = location.firstElementChild;
      childList.push(child);
    }
    childList.forEach(async (child) => {
      const parent = child.parentElement;
      const locationName =
        child.firstElementChild.firstElementChild.children[1].textContent;
      const currentId = locationsId[locationName];
      const locationData = cleanBaseline.filter(
        (item) => item.locationId === currentId
      );
      const currentlocationEmission = await parseLocationStats(locationData);
      child.addEventListener("mouseenter", () => {
        createTooltip(child, currentlocationEmission);
      });
      const apeColor = getColor(
        locationData[0].amountToEmitPerUser,
        apeEmissionColor
      );
      const rillaColor = getColor(
        locationData[0].gorillaAmountToEmitPerUser,
        rillaEmissionColor
      );

      const apeLine = document.createElement("div");
      apeLine.style.height = "5px";
      apeLine.style.borderRadius = "20px";
      apeLine.style.marginLeft = "5%";
      apeLine.style.width = "40%";
      apeLine.style.backgroundColor = apeColor;
      apeLine.style.display = "inline-block";

      const rillaLine = document.createElement("div");
      rillaLine.style.height = "5px";
      rillaLine.style.borderRadius = "20px";
      rillaLine.style.marginRight = "5%";
      rillaLine.style.width = "40%";
      rillaLine.style.backgroundColor = rillaColor;
      rillaLine.style.display = "inline-block";

      const barsContainer = document.createElement("div");
      barsContainer.className = "emissionColor";
      // barsContainer.style.transform = "translateY(5px)";
      barsContainer.style.width = "100%";
      barsContainer.style.display = "flex";
      barsContainer.style.justifyContent = "space-between";
      barsContainer.appendChild(apeLine);
      barsContainer.appendChild(rillaLine);

      parent.insertBefore(barsContainer, child);
    });
    manageLocationStyle(locationUl);
  }
  function parseBaselineData() {
    let toParseObject = Object.values(
      baseline.reduce((acc, current) => {
        if (current.hasOwnProperty("locationId")) {
          if (
            !acc[current.locationId] ||
            new Date(acc[current.locationId].periodStart) <
              new Date(current.periodStart)
          ) {
            acc[current.locationId] = current;
          }
        }
        return acc;
      }, {})
    );
    cleanBaseline = toParseObject;
    return emissionValueScale(toParseObject);
  }

  function emissionValueScale(toParseObject) {
    const emissionColor = (values) => {
      const sortedValues = values.sort((a, b) => a - b);
      const categories = {
        Red: sortedValues.slice(0, 2),
        Orange: sortedValues.slice(2, 4),
        Yellow: sortedValues.slice(4, 6),
        Green: sortedValues.slice(6),
      };
      return categories;
    };
    const rillaEmissionArray = [];
    const apeEmissionArray = [];
    for (const elem of toParseObject) {
      rillaEmissionArray.push(elem.gorillaAmountToEmitPerUser);
      apeEmissionArray.push(elem.amountToEmitPerUser);
    }
    const rillaEmissionColor = emissionColor(rillaEmissionArray);
    const apeEmissionColor = emissionColor(apeEmissionArray);
    return [rillaEmissionColor, apeEmissionColor];
  }
  function getColor(value, object) {
    for (const [color, values] of Object.entries(object)) {
      if (values.includes(value.toString())) {
        switch (color) {
          case "Red":
            return "#FF3E41";

          case "Orange":
            return "#FF7700";

          case "Yellow":
            return "#F7D002";

          case "Green":
            return "#0acd0a";
          default:
            return null;
        }
      }
    }
    return null;
  }
  function manageLocationStyle(locationUl) {
    const config = {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    };
    manageLocationStyleObserver = new MutationObserver(
      (mutationsList, observer) => {
        for (let mutation of mutationsList) {
          if (mutation.target.className.includes("selected")) {
            for (const location of locationUl.children) {
              const elem =
                location.firstElementChild.className === "emissionColor"
                  ? location.children[1]
                  : location.firstElementChild;
              if (!location.className.includes("selected")) {
                unselectedClass = location.className;
                location.style.opacity = "1";
                location.style.transition = "opacity .25s ease-in-out";
                elem.style.opacity = ".5";
                elem.style.trelem;
                ("opacity .25s ease-in-out");
              } else {
                location.style.opacity = "1";
                location.style.transition = "opacity .25s ease-in-out";
                elem.style.opacity = "1";
                elem.style.transition = "opacity .25s ease-in-out";
              }
            }
          }
        }
      }
    );
    manageLocationStyleObserver.observe(locationUl, config);
  }
  async function parseLocationStats(activeLocationData) {
    const currentLocationInfo = locationsData.filter(
      (item) => item.id === activeLocationData[0].locationId
    );

    function rillaEmission() {
      const apesRatio =
        (currentLocationInfo[0].activeChimpCount +
          currentLocationInfo[0].activeOrangutanCount) /
        1000;
      const epochEmission = Number(
        activeLocationData[0].gorillaAmountToEmitPerUser
      ); // multiply with reputation stats ( 60 Rep. point would be : result * 1.6)
      const hourlyRillaEmission = epochEmission * 4;
      return Math.round(hourlyRillaEmission);
    }
    function apesEmission() {
      const hourlyApeEmission =
        Number(activeLocationData[0].amountToEmitPerUser) * 4;
      return Math.round(hourlyApeEmission);
    }
    return { rilla: rillaEmission(), apes: apesEmission() };
  }
  function createTooltip(elem, value) {
    let tooltip = document.querySelector(".emissionTooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "emissionTooltip";
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "white";
      tooltip.style.color = "black";
      tooltip.style.transition = "opacity 0.3s";
      tooltip.style.borderRadius = "5px";
      tooltip.style.fontFamily = "SofiaSans,sans-serif";
      tooltip.style.border = "2px solid rgb(0, 0, 0)";
      tooltip.style.boxShadow = "rgba(0, 0, 0, 0.6) 0px 10px 10px";
      tooltip.style.fontWeight = "bold";
      tooltip.style.padding = "5px";
      tooltip.style.zIndex = "9999";
      const target =
        elem.parentElement.parentElement.parentElement.parentElement
          .parentElement.parentElement;
      target.appendChild(tooltip);
    }

    tooltip.style.opacity = "1";
    tooltip.innerHTML = `
    <div>
    <div className="apeData">
    APE Emission : ${value.apes} $KIWI/h
    </div>
    <div className="rillaData">
    RILLA Emission : ${value.rilla} $KIWI/h (Without Reputation bonus)
    </div>
    </div>
    `;

    const updateTooltipPosition = () => {
      const elementRect = elem.getBoundingClientRect();
      tooltip.style.left = `${elementRect.right + window.scrollX + 10}px`;
      const tooltipHeight = tooltip.offsetHeight;
      tooltip.style.top = `${
        elementRect.top +
        window.scrollY +
        elementRect.height / 2 -
        tooltipHeight / 2
      }px`;
    };

    updateTooltipPosition();
    const scrollableParent = findScrollableParent(elem);
    if (scrollableParent) {
      scrollableParent.addEventListener("scroll", updateTooltipPosition);
    }

    elem.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  }

  function findScrollableParent(element) {
    let parent = element.parentNode;
    while (parent && parent !== document.body) {
      if (parent.scrollHeight > parent.offsetHeight) {
        return parent;
      }
      parent = parent.parentNode;
    }
    return window;
  }
}
function apesFunction() {}
function jailbreakFunction() {
  waitForElem(() => searchElement("Active Jailbreaks"))
    .then((result) => {
      const ul = result.children[1];
      const jailBreakData = parseJailbreakData();
      for (const activeJailBreak of ul.children) {
        const imgSRC = activeJailBreak.firstElementChild.src;
        const activeJailBreakData = jailBreakData.filter(
          (item) =>
            imgSRC.includes(item.leftParentNft.image) ||
            imgSRC.includes(item.rightParentNft.image)
        );
        if (activeJailBreakData) {
          console.log(activeJailBreakData);
          const endDate = formatDate(activeJailBreakData);
          console.log(endDate);
          console.log(activeJailBreak);
          activeJailBreak.addEventListener("mouseenter", () => {
            createTooltip(activeJailBreak, endDate);
          });
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
  function formatDate(data) {
    const date = new Date(data[0].endedAt);
    const dateFormat = new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // Utilise le format 12h avec AM/PM
    });
    const formatedDate = dateFormat.format(date);
    return `End date : ${formatedDate}`;
  }
  function parseJailbreakData() {
    let activeJailBreak = [];
    const actualDate = Date.now();
    for (const elem of jailbreak) {
      const endDate = new Date(elem.endedAt).getTime();
      if (endDate > actualDate) {
        activeJailBreak.push(elem);
      }
    }
    return activeJailBreak;
  }
  function createTooltip(elem, endDate) {
    let tooltip = document.querySelector(".emissionTooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "emissionTooltip";
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "white";
      tooltip.style.color = "black";
      tooltip.style.transition = "opacity 0.3s";
      tooltip.style.borderRadius = "5px";
      tooltip.style.fontFamily = "SofiaSans,sans-serif";
      tooltip.style.border = "2px solid rgb(0, 0, 0)";
      tooltip.style.boxShadow = "rgba(0, 0, 0, 0.6) 0px 10px 10px";
      tooltip.style.fontWeight = "bold";
      tooltip.style.padding = "5px";
      tooltip.style.zIndex = "9999";
      const target =
        elem.parentElement.parentElement.parentElement.parentElement;
      target.appendChild(tooltip);
    }

    tooltip.style.opacity = "1";
    tooltip.textContent = endDate;

    const updateTooltipPosition = () => {
      const elementRect = elem.getBoundingClientRect();
      tooltip.style.left = `${elementRect.left - tooltip.offsetWidth - 10}px`;
      const tooltipHeight = tooltip.offsetHeight;
      tooltip.style.top = `${
        elementRect.top +
        window.scrollY +
        elementRect.height / 2 -
        tooltipHeight / 2
      }px`;
    };

    updateTooltipPosition();
    const scrollableParent = findScrollableParent(elem);
    if (scrollableParent) {
      scrollableParent.addEventListener("scroll", updateTooltipPosition);
    }

    elem.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });

    function findScrollableParent(element) {
      let parent = element.parentNode;
      while (parent && parent !== document.body) {
        if (parent.scrollHeight > parent.offsetHeight) {
          return parent;
        }
        parent = parent.parentNode;
      }
      return window;
    }
  }
}
function landFunction() {}

//s3 elem
function startObservingWithdraw() {
  //   ↓↓ location of the withdraw / deposit Tab ↓↓
  const elem1 = searchElement("Settings");
  const elem2 = elem1.parentElement.previousElementSibling;
  const elementToObserve = elem2;
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

// need update for s3
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

//need update for s3
// ↓↓ show profile from notification center ↓↓
function searchPlayer(walletAdress, playerName) {
  waitForElem(() => searchElement("Hub"))
    .then(async (elem) => {
      elem.click();
      const elem_1 = await waitForElem(() => searchElement("Social"));
      elem_1.parentElement.click();
      const elem_2 = await waitForElem(() => searchElement("Player search"));
      elem_2.children[0].click();
      const elem_3 = await waitForElem(() =>
        searchPlaceholder("Player Search")
      );
      let inputEvent = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      );
      inputEvent.set.call(elem_3, walletAdress);
      elem_3.dispatchEvent(new Event("input", { bubbles: true }));
      const elem_4 = await waitForElem(() => searchElement(playerName));
      elem_4.click();
      addInviteButtonInProfile();
    })
    .catch((error) => {
      console.error(error);
    });
}

// need update for s3
function openProfileFromGang(username, wallet, closeBtn) {
  closeBtn.click();
  waitForElem(() => searchElement("Hub"))
    .then(async (elem) => {
      elem.click();
      const elem_1 = await waitForElem(() => searchElement("Social"));
      elem_1.parentElement.click();
      const elem_2 = await waitForElem(() => searchElement("Player search"));
      elem_2.children[0].click();
      const elem_3 = await waitForElem(() =>
        searchPlaceholder("Player Search")
      );
      let inputEvent = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      );
      inputEvent.set.call(elem_3, wallet);
      elem_3.dispatchEvent(new Event("input", { bubbles: true }));
      const elem_4 = await waitForElem(() => {
        if (
          searchElement(username) &&
          searchElement(username).className.includes("_friend")
        ) {
          return searchElement(username);
        }
      });
      elem_4.click();
      addInviteButtonInProfile();
    })
    .catch((error) => {
      console.error(error);
    });
}

(async function () {
  const option = { method: "GET", credentials: "include" };
  const cops = await fetch("https://api.theheist.game/nft/my-robbers", option);
  const robbers = await fetch("https://api.theheist.game/nft/my-cops", option);

  if (cops) gorilla = cops.json();
  if (robbers) chimpTang = robbers.json();
})();

// retrieve all data from dif location lootTrip / heist ...
async function getLocationData() {
  const option = { withCredentials: true };
  axios
    .get("https://api.theheist.game/jail-break?limit=100&offset=0", option)
    .then((result) => {
      jailbreak = result.data;
    })
    .catch((err) => {
      console.error(err);
    });
  axios
    .get("https://api.theheist.game/heist/baseline", option)
    .then((result) => {
      baseline = result.data;
    })
    .catch((err) => {
      console.error(err);
    });
  axios
    .get("https://api.theheist.game/location", option)
    .then((result) => {
      locationsData = result.data;
    })
    .catch((err) => {
      console.error(err);
    });
}
