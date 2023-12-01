/*
- Locations Stats     ok
- Max Withdraw Amount     OK
- Chance Per Ticket Raffle    OK
- Actual Best Location    Pending
- Add Live Price For COCO and NANA    Pendin
- * AUTO SEND AND CLAIM BOT*   Pending
- Private Chat session ?

*/
let gangData;
let newData;
let data;
let getMoneyId;
let withdrawClick = false;
let getMoneyIdLoc;
let withdrawLoc;
let checkValue = 0;
let maxAmountLoc;
let cocoMax;
let nanaMax;
let chimpPercentage;
let tangPercentage;
let newLiStat;
let updateLiStats;
let newLiChimp;
let updateLiChimp;
let newLiTang;
let updateLiTang;
let getUl;
let CocoTabsList;
let CocoTabsClicked = false;
let CocoEmissionsLoc;
let waitForLoad;
let waitForLoad2;
let ChimpDoc;
let TangLoc;
let cocoDistribution;
let spaceHTML;
let buttonMax;
let getNanaTotal;
let getCocoTotal;
let cleanedCoco;
let cleanedNana;
let Amount;
let yesCoco = false;
let yesNana = false;
let interval1;
let inHub = false;
let roundRaffle1;
let roundRaffle2;
let hubHtml = false;
let locCheck = false;
let clientWalletAdress;
let walletToInvite;

initFunctions();
function initFunctions() {
  let chat = setInterval(() => {
    const element = document.querySelector(
      "#root > div._gamePage_1kclx_1 > footer > div._feed_ztp6w_1._feed_d1rj9_182._feed--show_d1rj9_187 > div > div._tabs_ztp6w_30 > button._tab_ztp6w_30"
    );
    if (element) {
      if (!element.classList.contains("undefined")) {
        sendInviteInGame();
        clearInterval(chat);
      }
    }
  }, 50);
  let location = setInterval(() => {
    const location1 = document.querySelector(
      "#root > div._gamePage_1kclx_1 > div.react-transform-wrapper.transform-component-module_wrapper__7HFJe._mapWrapper_1vun4_1 > div > div:nth-child(6) > div._locationTooltipWrapper_1vun4_107 > div > div > div > div._locationTitle_axp6f_21.MuiBox-root.css-0 > h2"
    );
    if (location1) {
      clearInterval(location);
      startObservingWithdraw();
      startObservingHub();
    }
  }, 50);
  let notif = setInterval(() => {
    const notifPath = document.querySelector(
      "#root > div._gamePage_1kclx_1 > header > div > div._gameScreenTitle_d1rj9_25.MuiBox-root.css-0 > div._topRightSideWrapper_d1rj9_48 > div"
    );
    if (notifPath) {
      clearInterval(notif);
      notifTracker();
      notifSound();
    }
  }, 50);

  let gang = setInterval(() => {
    const gangBtn = document.querySelector(
      "#root > div._gamePage_1kclx_1 > header > div > div._profileWrapper_gvh7y_1._profile_d1rj9_191 > div._col_gvh7y_15 > div._row_gvh7y_9 > button._button_30qjg_1._gangsButton_gvh7y_49"
    );
    if (gangBtn) {
      clearInterval(gang);
      gangMenu();
    }
  }, 50);
}

const walletAddressRegex =
  /https:\/\/api\.theheist\.game\/nft\/robbers\/wallet-top-performing\/([\w]+)/;

const locTarget = document.querySelector(
  "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper.Dialog_scrollPaper__BgbbA.css-ekeie0 > div > div"
);
const targetElement = document.querySelector(
  "body > div.MuiDialog-root.location_root__6XsDH.MuiModal-root.css-126xj0f"
);
//get client wallet adress for chating in the Heist Supervisor APP
function sendInviteInGame() {
  const profilePath = document.getElementsByClassName("_messageAvatar_1yjz4_8");
  for (let i = 0; i < profilePath.length; i++) {
    profilePath[i].addEventListener(
      "click",
      () => {
        window.addEventListener("getAdress", function (event) {
          if (event.detail) {
            clientWalletAdress = event.detail;
            console.log(clientWalletAdress);
            const injectButtonPath = document.querySelector(
              "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div > div > aside"
            );
            if (document.getElementById("sendInvite")) {
              document.getElementById("sendInvite").value = clientWalletAdress;
            } else {
              const newButton = document.createElement("button");
              newButton.id = "sendInvite";
              newButton.className =
                "_button_30qjg_1 _tradeButton_1pjcs_1 _tradeButton_ied2j_18 _button--yellow_30qjg_28";
              newButton.textContent = "Invite To Dm";
              newButton.style.marginBottom = "-16px";
              newButton.value = clientWalletAdress;
              injectButtonPath.insertBefore(
                newButton,
                injectButtonPath.firstChild
              );
            }
            function handleClick() {
              localStorage.setItem("adressToInvite", clientWalletAdress);
              window.postMessage({ type: "openInvitePopup" }, "*");
            }

            const sendButton = document.getElementById("sendInvite");
            sendButton.removeEventListener("click", handleClick);
            sendButton.addEventListener("click", handleClick, { once: true });
          }
        });
      },
      { once: true }
    );
  }
}
function maxWithdraw() {
  getCocoTotal = document.querySelector(
    "#root > div.GamePage_gamePage__FUXge > div.Corner_corner__HBNBd.gameLayout_topLeft__GGaQV.Corner_corner--top-left__D8HeK > div > div.profile_col__Pqzjm > div:nth-child(1) > div > button.Button_button__85C4R.ButtonWrapper_profileButton__Tyg29.ButtonWrapper_profileButton--white-text__VfKTR.Button_button--black__id2GF > div > div:nth-child(3) > span"
  );
  getNanaTotal = document.querySelector(
    "#root > div.GamePage_gamePage__FUXge > div.Corner_corner__HBNBd.gameLayout_topLeft__GGaQV.Corner_corner--top-left__D8HeK > div > div.profile_col__Pqzjm > div:nth-child(1) > div > button.Button_button__85C4R.ButtonWrapper_profileButton__Tyg29.ButtonWrapper_profileButton--white-text__VfKTR.Button_button--black__id2GF > div > div:nth-child(1) > span"
  );
  // withdraw menu
  withdrawLoc = document.querySelector(
    "#root > div._gamePage_1kclx_1 > header > div > div._profileWrapper_gvh7y_1._profile_1o38l_190 > div._withdrawDeposit_1mxp4_1 > div._submenuTabs_465f8_1"
  );
  maxAmountLoc = document.querySelector(
    "#root > div.GamePage_gamePage__FUXge > div.Corner_corner__HBNBd.gameLayout_topLeft__GGaQV.Corner_corner--top-left__D8HeK > div > div.WithdrawDepositSubmenu_withdrawDeposit__1FnqH > div.Submenu_submenuContent__pn1e3"
  );
  setTimeout(() => {
    //getMoneyIdLoc check if nana or coco is selected in withdraw menu
    getMoneyIdLoc = document.querySelector(
      "#root > div._gamePage_1kclx_1 > header > div > div._profileWrapper_gvh7y_1._profile_d1rj9_191 > div._withdrawDeposit_1mxp4_1 > div._submenuContent_465f8_45 > div:nth-child(3) > span > span"
    );
    getMoneyId = getMoneyIdLoc.getAttribute("aria-label");
  }, 100);

  if (getCocoTotal) {
    let arialLabelCoco = getCocoTotal.getAttribute("aria-label");
    let numberMatchCoco = arialLabelCoco.match(/([\d,]+)/);

    if (numberMatchCoco) {
      let Amount = numberMatchCoco[1];
    }
  }
  if (getNanaTotal) {
    let arialLabelNana = getNanaTotal.getAttribute("aria-label");
    let numberMatchNana = arialLabelNana.match(/([\d,]+)/);

    if (numberMatchNana) {
      let Amount = numberMatchNana[1];
      //cleanedNana = Amount.replace(/,/g, "");
    }
  }

  setTimeout(() => {
    if (getMoneyId.includes("COCO")) {
      yesCoco = true;
      const match = getMoneyId.match(/(\d|,)+/);
      const matchAmount = match[0];
      cleanedCoco = matchAmount.replace(/,/g, ".");
      Amount = cleanedCoco;
    }
    if (getMoneyId.includes("NANA")) {
      yesNana = true;
      const match = getMoneyId.match(/(\d|,)+/);
      const matchAmount = match[0];
      cleanedNana = matchAmount.replace(/,/g, ".");
      Amount = cleanedNana;
    }
  }, 150);
}

function LocationStats() {
  if (inHub === true) {
    updateLiStats = document.querySelector("#STATS");
    updateLiChimp = document.querySelector("#percentChimp");
    updateLiTang = document.querySelector("#percentTang");
    // path to to the top list of location ( safe House, federal reserve....) in the location menu
    CocoTabsList = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div > div._center_19qbs_8 > header > div > div"
    );
    if (CocoTabsList) {
      CocoTabsList.addEventListener("click", function handleClick() {
        if (!CocoTabsClicked) {
          waitForLoad2 = setInterval(LocationStats, 200);
          CocoTabsList.removeEventListener("click", handleClick);
          CocoTabsClicked = true;
        }
      });
    }
    // path to the location ul container
    getUl = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div > div._center_19qbs_8 > div._main_19qbs_28 > aside > div._asideContainer_13mm0_1 > ul"
    );
    //path to coco emission value
    CocoEmissionsLoc = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div > div._center_19qbs_8 > div._main_19qbs_28 > aside > div._asideContainer_13mm0_1 > ul > li:nth-child(4) > span._value_13mm0_78"
    );
    //path to number of Tang value
    TangLoc = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div > div._center_19qbs_8 > div._main_19qbs_28 > aside > div._asideContainer_13mm0_1 > ul > li:nth-child(2) > span._value_13mm0_78"
    );
    //path to number of Chimp value
    ChimpDoc = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div > div._center_19qbs_8 > div._main_19qbs_28 > aside > div._asideContainer_13mm0_1 > ul > li:nth-child(1) > span._value_13mm0_78"
    );
    if (ChimpDoc) {
      const CocoToNumber = CocoEmissionsLoc.textContent;
      const Coco = parseInt(CocoToNumber) * 1000;
      let Tangtxt = TangLoc.textContent;
      let Chimptxt = ChimpDoc.textContent;
      let Tang = parseInt(Tangtxt);
      let Chimp = parseInt(Chimptxt);

      tangPercentage = Math.round((Tang / (Tang + Chimp)) * 100);
      chimpPercentage = Math.round((Chimp / (Tang + Chimp)) * 100);

      cocoDistribution = Math.floor(Coco / (Tang + Chimp));

      if (updateLiTang) {
        updateLiTang.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
      <span class="_value_13mm0_78">${tangPercentage}%</span>
      <span class="_label_13mm0_87">Of Tangs</span>  
`;
      } else {
        newLiTang = document.createElement("li");
        newLiTang.className = "_asideListItem_13mm0_67";
        newLiTang.id = "percentTang";
        newLiTang.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
        <span class="_value_13mm0_78">${tangPercentage}%</span>
        <span class="_label_13mm0_87">Of Tangs</span>  
        `;
      }
      if (updateLiChimp) {
        updateLiChimp.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
      <span class="_value_13mm0_78">${chimpPercentage}%</span>
      <span class="_label_13mm0_87">Of Chimps</span>  
`;
      } else {
        newLiChimp = document.createElement("li");
        newLiChimp.className = "_asideListItem_13mm0_67";
        newLiChimp.id = "percentChimp";
        newLiChimp.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
        <span class="_value_13mm0_78">${chimpPercentage}%</span>
        <span class="_label_13mm0_87">Of Chimps</span>  
        `;
      }
      if (updateLiStats) {
        updateLiStats.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
        <span class="_value_13mm0_78">${cocoDistribution}</span>
        <span class="_label_13mm0_87">$COCO per TANG/CHIMP</span>
          

      `;
      } else {
        newLiStat = document.createElement("li");
        newLiStat.className = "_asideListItem_13mm0_67";
        newLiStat.id = "STATS";
        newLiStat.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
        <span class="_value_13mm0_78">${cocoDistribution}</span>
        <span class="_label_13mm0_87">$COCO per TANG/CHIMP</span>
      
      `;
      }
      if (getUl) {
        getUl.appendChild(newLiStat);
        getUl.appendChild(newLiChimp);
        getUl.appendChild(newLiTang);
      }
      // getUl.innerHTML += newLiStat;

      clearInterval(waitForLoad);
      clearInterval(waitForLoad2);
      CocoTabsClicked = false;
    }
  }
}
// Fonction pour initialiser l'observation
function startObservingLoc() {
  // Créez un observer avec une fonction de rappel
  const observer = new MutationObserver((mutationsList, observer) => {
    // Parcourez toutes les mutations détectées
    for (const mutation of mutationsList) {
      // Parcourez toutes les nœuds ajoutés dans cette mutation
      for (const addedNode of mutation.addedNodes) {
        // Vérifiez si l'élément ajouté a la classe spécifiée
        if (
          addedNode instanceof HTMLElement &&
          addedNode.classList.contains("_dialogContent_19qbs_1")
        ) {
          waitForLoad = setInterval(LocationStats, 200);
          elementLoadedCallback();
          observer.disconnect();
          setTimeout(startObservingLoc, 1000);
          return;
        }
      }
    }
  });
  LocationStats();
  // Commencez à observer les mutations dans le DOM
  observer.observe(document.body, { childList: true, subtree: true });
}
function WithdrawValue() {
  withdrawClick = true;
  maxWithdraw();
  if (yesCoco === true) {
    getMoneyIdLoc.textContent = Amount;
    yesCoco = false;
  }
  if (yesNana === true) {
    getMoneyIdLoc.textContent = Amount;
    yesNana = false;
  }
  //detect if there is a click in withdraw menu for reload maxWithdraw()
  withdrawLoc.addEventListener("click", () => {
    if (withdrawClick === true) {
      maxWithdraw();
    }
  });
}

function startObservingHub() {
  const elementToObserve = document.querySelector("#root");

  // Créez une instance de MutationObserver
  const observer = new MutationObserver((mutationsList, observer) => {
    // Parcourez toutes les mutations détectées
    for (const mutation of mutationsList) {
      // Vérifiez si l'attribut aria-hidden est défini sur "true" dans l'élément
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-hidden"
      ) {
        const isAriaHiddenTrue =
          mutation.target.getAttribute("aria-hidden") === "true";

        if (isAriaHiddenTrue) {
          inHub = true;
          setTimeout(nftRecruitment, 700);
          setTimeout(raffleTicket, 700);
          setTimeout(LocationStats, 700);
          initFunction();
        } else {
          setTimeout(gangMenu, 700);
          inHub = false;
        }
      }
    }
  });

  // Configurez l'observateur pour surveiller les changements de l'attribut aria-hidden
  const observerConfig = { attributes: true, attributeFilter: ["aria-hidden"] };

  // Commencez à observer l'élément
  observer.observe(elementToObserve, observerConfig);
}

function startObservingWithdraw() {
  // location of the withdraw / deposit Tab
  const elementToObserve = document.querySelector(
    "#root > div._gamePage_1kclx_1 > header > div > div._profileWrapper_gvh7y_1._profile_d1rj9_191 > div._col_gvh7y_15 > div._row_gvh7y_9 > div > button:nth-child(1)"
  );
  // Créez une fonction de rappel pour l'observateur
  const observerCallback = (mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
      // Vérifiez si la mutation concerne les classes de l'élément observé
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentClasses = elementToObserve.className;
        const containsProfileHidden = currentClasses.includes(
          "_button--black_30qjg_34"
        );

        // Vérifiez si la classe profile_hidden__Z+uMq est ajoutée ou supprimée
        if (!containsProfileHidden) {
          // La classe a été ajoutée
          withdrawClick = false;
          clearInterval(interval1);
        } else {
          interval1 = setInterval(WithdrawValue, 300);
        }
      }
    });
  };

  // Créez une instance de MutationObserver avec la fonction de rappel
  const observer = new MutationObserver(observerCallback);

  // Configurez l'observateur pour surveiller les changements d'attributs (classes)
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
    //path for append child
    const raffleLoc1 = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._itemRafflesWrapper_1tyqk_1365 > div.swiper.swiper-initialized.swiper-horizontal.swiper-pointer-events._offerSlider_15vt8_1._raffles_1tyqk_694 > div > div.swiper-slide._offerSlide_15vt8_1._offerSlide--featured_15vt8_64.swiper-slide-active > div > div._offerInfo_17ipg_88"
    );
    const raffleLoc2 = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._itemRafflesWrapper_1tyqk_1365 > div.swiper.swiper-initialized.swiper-horizontal.swiper-pointer-events._offerSlider_15vt8_1._raffles_1tyqk_694 > div > div.swiper-slide._offerSlide_15vt8_1._offerSlide--featured_15vt8_64.swiper-slide-next > div > div._offerInfo_17ipg_88"
    );
    // path where total item in the raffle
    const qtyRaffle1 = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._itemRafflesWrapper_1tyqk_1365 > div.swiper.swiper-initialized.swiper-horizontal.swiper-pointer-events._offerSlider_15vt8_1._raffles_1tyqk_694 > div > div.swiper-slide._offerSlide_15vt8_1._offerSlide--featured_15vt8_64.swiper-slide-active > div > div._offerInfo_17ipg_88 > div._offerStock_17ipg_106"
    );
    const qtyRaffle2 = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._itemRafflesWrapper_1tyqk_1365 > div.swiper.swiper-initialized.swiper-horizontal.swiper-pointer-events._offerSlider_15vt8_1._raffles_1tyqk_694 > div > div.swiper-slide._offerSlide_15vt8_1._offerSlide--featured_15vt8_64.swiper-slide-next > div > div._offerInfo_17ipg_88 > div._offerStock_17ipg_106"
    );
    //path where total ticket purchased by all players
    const qtyTicket1 = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._itemRafflesWrapper_1tyqk_1365 > div.swiper.swiper-initialized.swiper-horizontal.swiper-pointer-events._offerSlider_15vt8_1._raffles_1tyqk_694 > div > div.swiper-slide._offerSlide_15vt8_1._offerSlide--featured_15vt8_64.swiper-slide-active > div > div._infoContainer_17ipg_147 > div > div:nth-child(1) > p._value_17ipg_183._green_17ipg_194._soldOut_17ipg_197"
    );
    const qtyTicket2 = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_1tyqk_1._tabContent_75try_15 > div._main_1tyqk_169 > div._mainContent_1tyqk_241 > div._mainContentRight_1tyqk_249 > div._itemRafflesWrapper_1tyqk_1365 > div.swiper.swiper-initialized.swiper-horizontal.swiper-pointer-events._offerSlider_15vt8_1._raffles_1tyqk_694 > div > div.swiper-slide._offerSlide_15vt8_1._offerSlide--featured_15vt8_64.swiper-slide-next > div > div._infoContainer_17ipg_147 > div > div:nth-child(1) > p._value_17ipg_183._green_17ipg_194._soldOut_17ipg_197"
    );
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
        div1.className = "_offerStock_17ipg_106";
        div1.textContent = roundRaffle1 + "% chance per ticket";
        raffleLoc1.appendChild(div1);

        const div2 = document.createElement("div");
        div2.className = "_offerStock_17ipg_106";
        div2.textContent = roundRaffle2 + "% chance per ticket";
        raffleLoc2.appendChild(div2);
      }
    }
  }
}
function betterVault() {
  let vaultLoc = document.querySelector(
    "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper.Dialog_scrollPaper__BgbbA.css-ekeie0 > div > div.VaultContent_vault__8aZfl.socialHub_tabContent__PfGbX > div.Nfts_main__EjuLa > div > div"
  );
  if (vaultLoc) {
    vaultLoc.style.position = "relatives";
    vaultLoc.style.left = "-100px";
  }
}
function initFunction() {
  if (inHub === true) {
    const vaultButton = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper.Dialog_scrollPaper__BgbbA.css-ekeie0 > div > div.socialHub_navigation__nkHuP > div > div:nth-child(2) > button"
    );
    if (vaultButton) {
      vaultButton.addEventListener("click", () => {
        setTimeout(betterVault, 300);
      });
    }
  }
}
function notifSound() {
  let firstLauch = true;
  let event = new CustomEvent("notification");
  const notifCounter = document.querySelector(
    "#root > div._gamePage_1kclx_1 > header > div > div._gameScreenTitle_d1rj9_25.MuiBox-root.css-0 > div._topRightSideWrapper_d1rj9_48 > div > span"
  );
  let notif = parseFloat(notifCounter.textContent);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        notif = parseFloat(notifCounter.textContent);
        if (notif > 0) {
          window.dispatchEvent(event);
        }
      }
    });
  });

  const config = { childList: true, characterData: true, subtree: true };

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
          gangData = JSON.parse(realXHR.responseText);
        }
        if (
          realXHR.responseURL.includes(
            "https://api.theheist.game/notification/history?offset=0&limit=10"
          )
        ) {
          data = JSON.parse(realXHR.responseText);
        }
        if (
          realXHR.responseURL.includes(
            "https://api.theheist.game/notification/history?offset=10&limit=10"
          )
        ) {
          addNewNotif(JSON.parse(realXHR.responseText));
          setTimeout(openNotifProfile, 1000);
        }
      }
    };
    return realXHR;
  }
  window.XMLHttpRequest = newXHR;
  const elementToObserve = document.querySelector(
    "#root > div._gamePage_1kclx_1 > header > div > div._gameScreenTitle_d1rj9_25.MuiBox-root.css-0 > div._topRightSideWrapper_d1rj9_48 > div > div"
  );
  // Créez une fonction de rappel pour l'observateur
  const observerCallback = (mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
      // Vérifiez si la mutation concerne les classes de l'élément observé
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentClasses = elementToObserve.className;
        const classChange = currentClasses.includes("_active_xiugy_25");

        // Vérifiez si la classe profile_hidden__Z+uMq est ajoutée ou supprimée
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
      let wallet = data[i].walletId;
      searchPlayer(wallet, data[i].wallet.username);
    });
  }
}
function addNewNotif(newNotif) {
  let notifIndex = Object.keys(data).length;
  newNotif.forEach((item, index) => {
    data[notifIndex + index] = item;
  });
}

function searchPlayer(walletAdress, playerName) {
  const hubBtn = document.querySelector(
    "#root > div._gamePage_1kclx_1 > header > div > div._profileWrapper_gvh7y_1._profile_d1rj9_191 > div._col_gvh7y_15 > div._row_gvh7y_9 > button._button_30qjg_1._dialogButton_y0mou_1._hubButton_gvh7y_67"
  );

  hubBtn.click();
  let checkLoad = setInterval(() => {
    const searchBtn = document.querySelector(
      "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_raey6_1._tabContent_75try_15 > div._sidebar_raey6_37 > div._peelCityStats_raey6_49 > div > div:nth-child(2) > button"
    );
    if (searchBtn) {
      clearInterval(checkLoad);
      searchBtn.click();
      let checkLoad2 = setInterval(() => {
        const placeHolder = document.querySelector(
          "body > div:nth-child(5) > div.MuiDialog-container.MuiDialog-scrollPaper.css-ekeie0 > div > div._textfieldWrapper_4ppwh_1._playerSearchInputWrapper_4m2f6_139 > input"
        );
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
              }
            }
          }, 30);
        }
      }, 30);
    }
  }, 30);
}
function gangMenu() {
  console.log("reloaded");
  const gangBtn = document.querySelector(
    "#root > div._gamePage_1kclx_1 > header > div > div._profileWrapper_gvh7y_1._profile_d1rj9_191 > div._col_gvh7y_15 > div._row_gvh7y_9 > button._button_30qjg_1._gangsButton_gvh7y_49"
  );

  gangBtn.addEventListener(
    "click",
    () => {
      console.log("inside");
      let interval = setInterval(() => {
        const elementToObserve = document.querySelector(
          "body > div.MuiDialog-root._dialogRoot_a1f8c_1.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > main > div._left_1wbk4_23"
        );
        const alreadyInGang = document.querySelector(
          "body > div.MuiDialog-root._dialogRoot_a1f8c_1.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > main > div._left_1wbk4_23._left--65_1wbk4_29"
        );
        if (alreadyInGang) {
          console.log("elem2");
          clearInterval(interval);
          getGangPlayer();
          const observerCallback = (mutationsList, observer) => {
            mutationsList.forEach((mutation) => {
              if (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
              ) {
                const currentClasses = elementToObserve.className;
                const classChange =
                  currentClasses.includes("_left--65_1wbk4_29");

                if (classChange) {
                  getGangPlayer();
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
        } else if (elementToObserve) {
          console.log("elem1");
          clearInterval(interval);
          const observerCallback = (mutationsList, observer) => {
            mutationsList.forEach((mutation) => {
              if (
                mutation.type === "attributes" &&
                mutation.attributeName === "class"
              ) {
                const currentClasses = elementToObserve.className;
                const classChange =
                  currentClasses.includes("_left--65_1wbk4_29");

                if (classChange) {
                  getGangPlayer();
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

function getGangPlayer() {
  let interval = setInterval(() => {
    const playerListPath = document.querySelector(
      "body > div.MuiDialog-root._dialogRoot_a1f8c_1.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > main > div._left_1wbk4_23._left--65_1wbk4_29 > div > div._left_pcv7l_11"
    );
    if (playerListPath) {
      console.log(gangData);
      const playerPath = document.querySelector(
        "body > div.MuiDialog-root._dialogRoot_a1f8c_1.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > main > div._left_1wbk4_23._left--65_1wbk4_29 > div > div._left_pcv7l_11 > div._scrollable_1t6tk_1._memberScroll_pcv7l_52"
      );
      playerPath.removeChild(playerPath.children[0]);
      clearInterval(interval);
      let membershipsIndex = 0;
      for (let i = 0; i < playerPath.children.length; i++) {
        playerPath.children[i].style.cursor = "pointer";
        membershipsIndex = i;
        if (gangData.memberships[i].status === "Left") {
          membershipsIndex++;
        }
        let item = playerPath.children[i];
        let member = gangData.memberships[membershipsIndex];
        item.addEventListener("click", () => {
          let playerName = member.wallet.username;
          let wallet = member.walletId;
          console.log(wallet);
          console.log(playerName);
          openProfileFromGang(playerName, wallet);
        });

        // ajouter la fonction recherche de l'user
      }
    }
  }, 300);
}
function openProfileFromGang(username, wallet) {
  let interval1 = setInterval(() => {
    const closeGang = document.querySelector(
      "body > div.MuiDialog-root._dialogRoot_a1f8c_1.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > header > div._banner_1e33g_9 > div._topRightCorner_1e33g_52 > div._right_1e33g_60 > button._button_30qjg_1._closeButton_gzrf2_1._closeButton_1e33g_75._button--gray_30qjg_31"
    );
    if (closeGang) {
      clearInterval(interval1);
      closeGang.click();
      let interval2 = setInterval(() => {
        const hubBtn = document.querySelector(
          "#root > div._gamePage_1kclx_1 > header > div > div._profileWrapper_gvh7y_1._profile_d1rj9_191 > div._col_gvh7y_15 > div._row_gvh7y_9 > button._button_30qjg_1._dialogButton_y0mou_1._hubButton_gvh7y_67"
        );
        if (hubBtn) {
          clearInterval(interval2);
          hubBtn.click();
          let interval3 = setInterval(() => {
            const searchPlayerBtn = document.querySelector(
              "body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper._scrollPaper_gnyli_18.css-ekeie0 > div > div._socialContent_raey6_1._tabContent_75try_15 > div._sidebar_raey6_37 > div._peelCityStats_raey6_49 > div > div:nth-child(2) > button"
            );
            if (searchPlayerBtn) {
              clearInterval(interval3);
              searchPlayerBtn.click();
              let interval4 = setInterval(() => {
                const placeHolder = document.querySelector(
                  "body > div:nth-child(5) > div.MuiDialog-container.MuiDialog-scrollPaper.css-ekeie0 > div > div._textfieldWrapper_4ppwh_1._playerSearchInputWrapper_4m2f6_139 > input"
                );
                if (placeHolder) {
                  clearInterval(interval4);
                  let inputEvent = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value"
                  );
                  inputEvent.set.call(placeHolder, wallet);
                  placeHolder.dispatchEvent(
                    new Event("input", { bubbles: true })
                  );
                  let interval5 = setInterval(() => {
                    const playerPath = document.querySelector(
                      "#player-scroller > div.infinite-scroll-component__outerdiv > div > div > div"
                    );
                    if (playerPath) {
                      if (playerPath.textContent == username) {
                        clearInterval(interval5);
                        playerPath.click();
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
//     see admin panel
/*
function test() {
  (function (originalXHR) {
    function newXHR() {
      const xhr = new originalXHR();

      xhr.realSend = xhr.send;
      xhr.send = function () {
        xhr.realOnreadystatechange = xhr.onreadystatechange;
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            // Intercepter la réponse ici
            if (
              xhr.responseURL.includes("https://api.theheist.game/gang/170")
            ) {
              var response = JSON.parse(xhr.responseText);
              response.myMembership.isLeader = true;
              response.memberships[4].isLeader = true;
              console.log("applied");
              Object.defineProperty(xhr, "responseText", {
                value: JSON.stringify(response),
              });
            }
            if (xhr.responseURL.includes("https://api.theheist.game/auth/me")) {
              var response = JSON.parse(xhr.responseText);
              if (response.id) {
                response.isAdmin = true; // Modifier la propriété
                Object.defineProperty(xhr, "responseText", {
                  value: JSON.stringify(response),
                });
              }
            }
          }
          if (xhr.realOnreadystatechange)
            xhr.realOnreadystatechange.apply(this, arguments);
        };
        xhr.realSend.apply(this, arguments);
      };

      return xhr;
    }

    window.XMLHttpRequest = newXHR;
  })(window.XMLHttpRequest);
}
test();*/
