import {
  onAuthStateChanged,
  authStateChangeCallback,
  unsubscribeAuthStateChange,
  updateProfile,
  signOut,
  signInWithCustomToken,
} from "firebase/auth/web-extension";
import { getFunctions, httpsCallable } from "firebase/functions";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  updateDoc,
  where,
  deleteDoc,
  getDocs,
  QuerySnapshot,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  documentId,
} from "firebase/firestore";
import { auth, app, db } from "./initFirebase";
import DOMPurify from "dompurify";

// Firebase Functions
const functions = getFunctions(app);
const acceptInvitation = httpsCallable(functions, "acceptInvitation");
const sendInvitation = httpsCallable(functions, "sendInvitation");
const sendMessage = httpsCallable(functions, "sendMessage");
const askForNewAuthToken = httpsCallable(functions, "askForNewAuthToken");

let logged;
let activePage;
let buttonBack;
let content0;
let userContext;
let userId;
let infoSubmit;
let invitedUid;
let invitedUsername;

const username = localStorage.getItem("username");

function checkIfLogged(callback) {
  const authStateChangeCallback = async (user) => {
    let logged = false;
    if (user) {
      logged = true;
      userContext = user;
      userId = user.uid;
      if (activePage !== "homePage") {
        backHome();
      }
    }

    callback(logged);
    unsubscribe();
  };
  const unsubscribe = onAuthStateChanged(auth, authStateChangeCallback);
}

function backHome() {
  activePage = "homePage";
  content0 = document.getElementById("dynamicContent");
  content0.style.opacity = 0;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../../public/nativeContent.html", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      setTimeout(() => {
        content0.innerHTML = DOMPurify.sanitize(xhr.responseText);
        content0.style.opacity = 1;
      }, 200);
    }
  };
  xhr.send();
  setTimeout(homePage, 300);
}

function backButton() {
  buttonBack = document.getElementById("buttonBack");
  content0 = document.getElementById("dynamicContent");
  if (
    activePage === "sendInvitePage" ||
    activePage === "manageChanelPage" ||
    activePage === "invitationPage"
  ) {
    buttonBack.addEventListener(
      "click",
      () => {
        content0.style.opacity = 0;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../../public/privateMessage.html", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            setTimeout(() => {
              content0.innerHTML = DOMPurify.sanitize(xhr.responseText);
              content0.style.opacity = 1;
            }, 200);
          }
        };
        xhr.send();
        setTimeout(privateMessagePage, 300);
      },
      { once: true }
    );
  } else if (activePage === "chatingPage") {
    buttonBack.addEventListener(
      "click",
      () => {
        content0.style.opacity = 0;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../../public/privateMessage.html", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            setTimeout(() => {
              content0.innerHTML = DOMPurify.sanitize(xhr.responseText);
              content0.style.opacity = 1;
            }, 200);
          }
        };
        xhr.send();
        setTimeout(() => {
          let manifest = chrome.runtime.getManifest();
          let version = manifest.version;
          document.getElementById("headerElem").innerHTML = DOMPurify.sanitize(`
        <img src="../app/assets/logo_256.png" draggable="false" />
        <div style="display: table-column">
        <h1 style="margin-bottom: 5px;">Heist Supervisor</h1>
        <h2 style="font-size: medium; margin: 0px; text-align: right;" id="version">${version}</h2>
    </div>
        `);
        }, 300);
        setTimeout(privateMessagePage, 300);
      },
      { once: true }
    );
  } else {
    buttonBack.addEventListener(
      "click",
      () => {
        backHome();
      },
      { once: true }
    );
  }
}
//  ↓↓ Used to show a notification in the popup, type always need to be  ( info / error / valid).  eg showNotification("valid", "Logged with success", 3000) ↓↓
function showNotification(type, message, duration = 5000) {
  const notifElem = document.createElement("div");
  notifElem.className = "notification";
  if (type === "info") {
    notifElem.innerHTML = DOMPurify.sanitize(`
       <img src="../app/assets/infoLogo.png" class="stateLogo"
    
    <p>${message}</p>
    `);
  }
  if (type === "error") {
    notifElem.innerHTML = DOMPurify.sanitize(`
    
      <img src="../app/assets/errorLogo.png" class="stateLogo"
    
    <p>${message}</p>
    `);
  } else if (type === "valid") {
    notifElem.innerHTML = DOMPurify.sanitize(`
    
      <img src="../app/assets/validLogo.png" class="stateLogo"
    
    <p>${message}</p>
    `);
  }
  const container = document.getElementById("notifContent");
  container.appendChild(notifElem);
  setTimeout(() => {
    notifElem.classList.add("slideIn");
  }, 100);
  if (duration > 0) {
    setTimeout(() => {
      notifElem.classList.remove("slideIn");
      notifElem.classList.add("slideOut");
      notifElem.addEventListener("transitionend", function handler() {
        notifElem.removeEventListener("transitionend", handler);
        container.removeChild(notifElem);
      });
    }, duration);
  }
}

async function homePage() {
  const connectButton = document.getElementById("buttonSignIn");
  const getData = await getLocalData(["publicAdress"]);
  const publicAdress = getData.publicAdress;
  checkIfLogged((isLoggedIn) => {
    console.log(isLoggedIn);
    if (isLoggedIn) {
      connectButton.textContent = reduceWalletAdress(publicAdress);
      connectButton.className = "connectedButton";
      connectButton.style.cursor = "default";
      connectButton.disabled = true;
    } else {
      connectButton.textContent = "connect";
      connectButton.addEventListener("click", handleConnectClick);
      connectButton.click();
    }
  });
  activePage = "homePage";
  const openDocBtn = document.getElementById("docButton");
  document.getElementById("loadingOverlayHome").style.display = "none";
  document.getElementById("dynamicContent").style.display = "flex";
  const buttonPricePage = document.getElementById("buttonPricePage");
  const content1 = document.getElementById("dynamicContent");
  const buttonDM = document.getElementById("buttonDM");
  const registerButton = document.getElementById("registerWebsite");
  if (registerButton) {
    registerButton.addEventListener("click", () => {
      window.open("https://heist-supervisor.web.app/", "_blank");
    });
  }
  if (openDocBtn) {
    openDocBtn.addEventListener(
      "click",
      () => {
        window.open(
          "https://heist-supervisor.gitbook.io/heist-supervisor/",
          "_blank"
        );
      },
      { once: true }
    );
  }

  document.getElementById("inGameMiscButton").addEventListener(
    "click",
    () => {
      showNotification("error", "Element disabled for now", 3000);
      // content1.style.opacity = 0;
      // const xhr = new XMLHttpRequest();
      // xhr.open("GET", "../../public/miscOptions.html", true);
      // xhr.onreadystatechange = function () {
      //   if (xhr.readyState === 4 && xhr.status === 200) {
      //     setTimeout(() => {
      //       content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
      //       content1.style.opacity = 1;
      //     }, 200);
      //   }
      // };
      // xhr.send();
      // setTimeout(inGameMiscOptions, 400);
    },
    { once: true }
  );
  buttonDM.addEventListener("click", () => {
    try {
      checkIfLogged(async (isLoggedIn) => {
        if (isLoggedIn) {
          buttonLoadingAnim(buttonDM);
          const username = localStorage.getItem("username");
          if (username) {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "../../public/privateMessage.html", true);
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                setTimeout(() => {
                  content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
                  content1.style.opacity = 1;
                }, 200);
              }
            };
            xhr.send();
            setTimeout(privateMessagePage, 300);
          } else {
            const docRef = doc(db, "users", userId);
            const snap = await getDoc(docRef);
            if (snap.exists) {
              const data = snap.data();
              if (data.username) {
                localStorage.setItem(data.username);
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "../../public/privateMessage.html", true);
                xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4 && xhr.status === 200) {
                    setTimeout(() => {
                      content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
                      content1.style.opacity = 1;
                    }, 200);
                  }
                };
                xhr.send();
                setTimeout(privateMessagePage, 300);
              } else {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "../../public/setUsername.html", true);
                xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4 && xhr.status === 200) {
                    setTimeout(() => {
                      content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
                      content1.style.opacity = 1;
                    }, 200);
                  }
                };
                xhr.send();
                setTimeout(setUsername, 300);
              }
            }
          }
        } else {
          showNotification("error", "You need to Log-in First.", 3000);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });

  buttonPricePage.addEventListener("click", () => {
    checkIfLogged((isLoggedIn) => {
      if (isLoggedIn) {
        content1.style.opacity = 0;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../../public/pricePage.html", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            setTimeout(() => {
              content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
              content1.style.opacity = 1;
            }, 200);
          }
        };
        xhr.send();
        setTimeout(pricePage, 300);
      } else {
        showNotification("error", "You need to Log-in First.", 3000);
        return;
      }
    });
  });
}

function reduceWalletAdress(string) {
  if (string.length > 8) {
    return string.substring(0, 4) + "..." + string.substring(string.length - 4);
  }
  return string;
}
//need update for s3
function inGameMiscOptions() {
  backButton();
  const switches = document.querySelectorAll(".switch input");
  const ul = document.getElementById("miscOptionUl");
  const toolTip1 = document.getElementById("toolTip1");
  const toolTip2 = document.getElementById("toolTip2");
  const title1 = toolTip1.previousElementSibling;
  const title2 = toolTip2.previousElementSibling;
  title1.addEventListener("mouseenter", () => {
    const rect = title1.getBoundingClientRect();
    toolTip1.style.display = "block";
    toolTip1.style.left = rect.left + "px";
    toolTip1.style.top = rect.bottom + 10 + "px";
  });
  title2.addEventListener("mouseenter", () => {
    const rect = title2.getBoundingClientRect();
    toolTip2.style.display = "block";
    toolTip2.style.left = rect.left + "px";
    toolTip2.style.top = rect.bottom + 10 + "px";
  });
  title1.addEventListener("mouseout", () => {
    toolTip1.style.display = "none";
  });
  title2.addEventListener("mouseout", () => {
    toolTip2.style.display = "none";
  });
  chrome.storage.sync.get(null, function (data) {
    switches.forEach((switchElem, index) => {
      switchElem.checked = data["switchState" + index] || false;
    });
  });
  switches.forEach((switchElem) => {
    switchElem.addEventListener("change", function () {
      let states = {};
      switches.forEach((sw, idx) => {
        states["switchState" + idx] = sw.checked;
      });
      chrome.storage.sync.set(states, function () {
        console.log(states);
      });
    });
  });
}

async function pricePage() {
  activePage = "pricePage";
  buttonBack = document.getElementById("buttonBack");
  content0 = document.getElementById("dynamicContent");
  const kiwiButton = document.getElementById("tradekiwi");
  const nanaButton = document.getElementById("tradeNana");
  let elementsLoaded = 0;
  const parent = document.getElementById("loadingOverlayPrice");
  const newChild = document.createElement("p");
  newChild.textContent = elementsLoaded + "/3";
  newChild.id = "elementsLoaded";
  newChild.style.color = "#e2e8c0";
  newChild.style.fontFamily = "Bangers";
  parent.appendChild(newChild);
  try {
    const kiwi = await kiwiPrice();
    if (kiwi) {
      elementsLoaded++;
      document.getElementById("elementsLoaded").textContent =
        elementsLoaded + "/3";
    } else {
      const error = new Error("Failed to fetch");
      error.code = 429;
      error.status = "FETCH_FAILED";
      throw error;
    }
    const sol = await solanaPrice();
    if (sol) {
      elementsLoaded++;
      document.getElementById("elementsLoaded").textContent =
        elementsLoaded + "/3";
    } else {
      const error = new Error("Failed to fetch");
      error.code = 429;
      error.status = "FETCH_FAILED";
      throw error;
    }
    const nana = await nanaPrice();
    if (nana) {
      elementsLoaded++;
      document.getElementById("elementsLoaded").textContent =
        elementsLoaded + "/3";
    } else {
      const error = new Error("Failed to fetch");
      error.code = 429;
      error.status = "FETCH_FAILED";
      throw error;
    }

    if (kiwi && sol && nana) {
      document.getElementById("loadingOverlayPrice").style.display = "none";
      document.getElementById("dynamicContent").style.display = "flex";
    }

    kiwiButton.addEventListener("click", () => {
      window.open(
        "https://birdeye.so/token/74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ?chain=solana",
        "blank"
      );
    });
    nanaButton.addEventListener("click", () => {
      window.open(
        "https://birdeye.so/token/HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr?chain=solana",
        "_blank"
      );
    });
  } catch (error) {
    console.log(error.code);
    console.log(error.message);
    if (error.code === 429) {
      showNotification("error", "Too much request try again in a minute", 5000);
    }
  }
  backButton();
}
function setUsername() {
  const content1 = document.getElementById("dynamicContent");
  const submitButton = document.getElementById("submitPlayerInfo");
  submitButton.addEventListener("click", () => {
    try {
      const usernameInput = document.getElementById("playerName").value;
      if (usernameInput.length >= 3) {
        updateProfile(userContext, { displayName: usernameInput });
        localStorage.setItem("username", usernameInput);
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../../public/privateMessage.html", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            setTimeout(() => {
              content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
              content1.style.opacity = 1;
            }, 200);
          }
        };
        xhr.send();
        setTimeout(privateMessagePage, 300);
      } else
        showNotification(
          "error",
          "Username need to be more then 2 letter",
          3000
        );
    } catch (error) {
      console.error(error);
    }
  });
}
function privateMessagePage() {
  activePage = "privateMessagePage";
  buttonBack = document.getElementById("buttonBack");
  content0 = document.getElementById("dynamicContent");
  backButton();
  document.getElementById("buttonCreate").addEventListener("click", () => {
    activePage = "sendInvitePage";
    content0 = document.getElementById("dynamicContent");
    content0.style.opacity = 0;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../../public/sendInvite.html", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setTimeout(() => {
          content0.innerHTML = DOMPurify.sanitize(xhr.responseText);
          content0.style.opacity = 1;
        }, 200);
      }
    };
    xhr.send();
    setTimeout(() => {
      sendInvite();
    }, 300);
  });
  document.getElementById("buttonInvitation").addEventListener("click", () => {
    activePage = "invitationPage";
    content0 = document.getElementById("dynamicContent");
    content0.style.opacity = 0;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../../public/invitationPage.html", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setTimeout(() => {
          content0.innerHTML = DOMPurify.sanitize(xhr.responseText);
          content0.style.opacity = 1;
        }, 200);
      }
    };
    xhr.send();
    setTimeout(() => {
      getInvitation();
    }, 300);
  });
  document
    .getElementById("buttonManageChanel")
    .addEventListener("click", () => {
      activePage = "manageChanelPage";
      content0 = document.getElementById("dynamicContent");
      content0.style.opacity = 0;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "../../public/manageChanel.html", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          setTimeout(() => {
            content0.innerHTML = DOMPurify.sanitize(xhr.responseText);
            content0.style.opacity = 1;
          }, 200);
        }
      };
      xhr.send();
      setTimeout(() => {
        manageChanel();
      }, 300);
    });
}

async function connectUser() {
  try {
    const getData = await getLocalData(["uid", "hash"]);
    const { uid, hash } = getData;
    if (uid && hash) {
      try {
        const result = await askForNewAuthToken({ uid: uid, hash: hash });
        if (result.data.error) {
          let errorMessage = "Unable to authentificate";
          switch (result.data.error) {
            case "sent-data-unusable":
              errorMessage = "Register yourself with the connect website.";
              break;
            case "internal-error":
              errorMessage = "Unable to auth with provided DATA.";
              break;
            case "dont-own-token":
              errorMessage = "You are not allowed to access.";
              break;
            default:
              break;
          }
          showNotification("error", errorMessage, 5000);
          return false;
        } else if (result.data.token) {
          const token = result.data.token.toString();
          await signInWithCustomToken(auth, token);
          showNotification("valid", "Logged !", 3000);
          return true;
        }
      } catch (err) {
        showNotification("error", "unable to authentificate", 3000);
        console.error(err);
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function solanaPrice() {
  try {
    const option = {
      method: "GET",
      headers: { accpet: "application/json" },
    };

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true",
      option
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    let solanaChange = data["solana"].usd_24h_change;
    let cleanedSolChange = parseFloat(solanaChange).toFixed(2);
    let solana = data["solana"].usd;
    let cleanedSolana = parseFloat(solana).toFixed(3);

    let injectSol = document.getElementById("solPrice");
    injectSol.innerHTML = "";
    const spanElem = document.createElement("span");
    const imgElem = document.createElement("img");
    imgElem.src = "../app/assets/solLogo.png";
    imgElem.classList.add("logo");
    spanElem.appendChild(imgElem);
    const textContent = document.createTextNode(
      ` $SOL = $${cleanedSolana} (USD) ${cleanedSolChange}%`
    );
    injectSol.appendChild(spanElem);
    injectSol.appendChild(textContent);

    if (cleanedSolChange <= 0) {
      injectSol.style.color = "#f45b69";
    } else {
      injectSol.style.color = "#00c377";
    }

    return true;
  } catch (error) {
    console.error("Error fetching the solana price:", error);
    return false;
  }
}

async function kiwiPrice() {
  try {
    const option = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=kiwi-token-2&vs_currencies=usd&include_24hr_change=true",
      option
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    let kiwiChange = data["kiwi-token-2"].usd_24h_change;
    let cleanedkiwiChange = parseFloat(kiwiChange).toFixed(2);
    let kiwi = data["kiwi-token-2"].usd;
    let cleanedkiwi = parseFloat(kiwi).toFixed(6);

    let injectkiwi = document.getElementById("kiwiPrice");
    injectkiwi.innerHTML = "";
    const spanElem = document.createElement("span");
    const imgElem = document.createElement("img");
    imgElem.src = "../app/assets/kiwiLogo.png";
    imgElem.classList.add("logo");
    spanElem.appendChild(imgElem);
    const textContent = document.createTextNode(
      ` $KIWI = $${cleanedkiwi} (USD) ${cleanedkiwiChange}%`
    );
    injectkiwi.appendChild(spanElem);
    injectkiwi.appendChild(textContent);

    if (cleanedkiwiChange <= 0) {
      injectkiwi.style.color = "#f45b69";
    } else {
      injectkiwi.style.color = "#00c377";
    }

    return true;
  } catch (error) {
    console.error("Error fetching the kiwi price:", error);
    return false;
  }
}

async function nanaPrice() {
  try {
    const option = {
      method: "GET",
      headers: { accept: "application/json" },
    };

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=nana-token&vs_currencies=usd&include_24hr_change=true",
      option
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    let nanaChange = data["nana-token"].usd_24h_change;
    let cleanedNanaChange = parseFloat(nanaChange).toFixed(2);
    let nana = data["nana-token"].usd;
    let cleanedNana = parseFloat(nana).toFixed(6);

    let injectNana = document.getElementById("nanaPrice");
    injectNana.innerHTML = "";
    const spanElem = document.createElement("span");
    const imgElem = document.createElement("img");
    imgElem.src = "../app/assets/nanaLogo.png";
    imgElem.classList.add("logo");
    spanElem.appendChild(imgElem);
    const textContent = document.createTextNode(
      ` $NANA = $${cleanedNana} (USD) ${cleanedNanaChange}%`
    );
    injectNana.appendChild(spanElem);
    injectNana.appendChild(textContent);

    if (cleanedNanaChange <= 0) {
      injectNana.style.color = "#f45b69";
    } else {
      injectNana.style.color = "#00c377";
    }

    return true;
  } catch (error) {
    console.error("Error fetching the nana price:", error);
    return false;
  }
}
//  ↓↓ Start private message page function ↓↓
async function initSendInvitation() {
  const walletAdress = document.getElementById("walletAdress").value;

  if (!walletAdress) {
    showNotification("error", "You need to enter a valid adress", 3000);
    return;
  }
  const docRef = collection(db, "users");
  const q = query(docRef, where("wallet", "==", walletAdress));
  const qResult = await getDocs(q);

  if (qResult.size === 0) {
    showNotification("error", "Error : un-registered Adress.", 3000);
    return;
  } else {
    qResult.forEach((doc) => {
      invitedUid = doc.data().uid;
      invitedUsername = doc.data().username;
    });
  }
  const username = localStorage.getItem("username");
  try {
    const result = await sendInvitation({
      message: walletAdress,
      player1: username,
      player2: invitedUsername,
      uid2: invitedUid,
    });
    return result.data.status;
  } catch (error) {
    console.error(error);
  }
}
function sendInvite() {
  backButton();
  document.getElementById("sendInvite").addEventListener("click", () => {
    const bouton = document.getElementById("sendInvite");
    buttonLoadingAnim(bouton);
    initSendInvitation().then((result1) => {
      if (result1 === "sent") {
        showNotification("valid", "Invitation sent successfully.", 3000);
        bouton.style.color = "#313131";
        bouton.className = "button";
        bouton.textContent = "send invite";
        bouton.style.backgroundColor = "#e2e8c0";
        bouton.id = "sendInvite";
        //
      } else if (result1 === "already exist") {
        showNotification("error", "Error : Session already Exist.", 3000);
        bouton.style.color = "#313131";
        bouton.className = "button";
        bouton.style.backgroundColor = "#e2e8c0";
        bouton.id = "sendInvite";
        bouton.textContent = "send invite";
      } else {
        setTimeout(() => {
          bouton.style.color = "#313131";
          bouton.className = "button";
          bouton.style.backgroundColor = "#e2e8c0";
          bouton.id = "sendInvite";
        }, 2000);
      }
    });
  });
}

async function initAcceptInvitation(sessionId1) {
  try {
    const result = await acceptInvitation({
      sessionId: sessionId1,
    });
    return result.data.status;
  } catch (error) {
    console.error(error);
  }
}

async function getInvitation() {
  backButton();
  const listPath = document.getElementById("invitationList");

  const docRef = collection(db, "privateMessage");
  const q = query(
    docRef,
    where("accepted", "==", false),
    where("sendTo", "==", userId)
  );

  const qResult = await getDocs(q);
  const sessionId = [];
  const players = [];
  try {
    qResult.forEach((doc) => {
      sessionId.push(doc.id);
      players.push(doc.data().player1);
    });
  } catch (error) {
    console.error(error);
  }
  for (let i = 0; i < players.length; i++) {
    const sessionId1 = sessionId[i];
    const player1 = players[i];
    const createLi = document.createElement("li");
    let stringId = "session" + sessionId;
    createLi.className = "invitationElement";
    createLi.id = stringId;
    createLi.innerHTML = DOMPurify.sanitize(`
    <span class="username" id="userName">${player1}</span>
    <div style="transform: translateY(4px)">
      <button id="create${sessionId1}" class="button">accept</button>
      <button id="delete${sessionId1}" class="button">Decline</button>
    </div>
    `);
    listPath.appendChild(createLi);
    document
      .getElementById("create" + sessionId1)
      .addEventListener("click", () => {
        let result = initAcceptInvitation(sessionId1).then((result) => {
          if (result != "accepted") {
            showNotification("error", "Error while accept request", 3000);
          } else {
            document.getElementById(stringId).remove();
          }
        });
      });
    document
      .getElementById("delete" + sessionId1)
      .addEventListener("click", () => {
        deleteDoc(doc(db, "privateMessage", sessionId1));
        document.getElementById(stringId).remove();
      });
  }
}

async function manageChanel() {
  try {
    backButton();
    const docRef = collection(db, "privateMessage");
    const q1 = query(
      docRef,
      where("sendBy", "==", userId),
      where("accepted", "==", true)
    );
    const q2 = query(
      docRef,
      where("sendTo", "==", userId),
      where("accepted", "==", true)
    );
    const qResult1 = await getDocs(q1);
    const qResult2 = await getDocs(q2);
    const qResult = [...qResult1.docs, ...qResult2.docs];
    const docId = [];
    const player1 = [];
    const player2 = [];
    const listPath = document.getElementById("chanelList");
    try {
      qResult.forEach((doc1, index) => {
        docId.push(doc1.id);
        player1.push(doc1.data().player1);
        player2.push(doc1.data().player2);
        for (let i = 0; i < docId.length; i++) {
          let player;
          const playerN1 = player1[i];
          const playerN2 = player2[i];
          const docIdN1 = docId[i];
          const createLi = document.createElement("li");
          createLi.id = docIdN1;
          createLi.className = "invitationElement";
          if (playerN1 === username) {
            createLi.innerHTML = DOMPurify.sanitize(`
          <span class="username" id="userName">${playerN2}</span>
      <div style="transform: translateY(4px)">
        <button id="join${docIdN1}" class="button">chat</button>
        <button id="close${docIdN1}" class="button">Close</button>
      </div>
          `);
            player = playerN2;
          } else if (playerN2 === username) {
            createLi.innerHTML = DOMPurify.sanitize(`
          <span class="username" id="userName">${playerN1}</span>
      <div style="transform: translateY(4px)">
        <button id="join${docIdN1}" class="button">chat</button>
        <button id="close${docIdN1}" class="button">Close</button>
      </div>
          `);
            player = playerN1;
          }
          listPath.appendChild(createLi);
          const closeButton = document.getElementById("close" + docIdN1);
          const joinButton = document.getElementById("join" + docIdN1);
          let isAwaitingConfirmation = false;

          const handleDelete = () => {
            deleteDoc(doc(db, "privateMessage", docIdN1));
            closeButton.removeEventListener("click", handleDelete);
            document.getElementById(docIdN1).remove();
            showNotification(
              "valid",
              "chanel with <" + player + ">has been closed",
              3000
            );
          };

          closeButton.addEventListener("click", () => {
            if (!isAwaitingConfirmation) {
              isAwaitingConfirmation = true;
              closeButton.textContent = "sure ?";
              closeButton.style.backgroundColor = "#f45b69";

              setTimeout(() => {
                if (isAwaitingConfirmation) {
                  closeButton.addEventListener("click", handleDelete);
                }
              }, 500);

              setTimeout(() => {
                if (isAwaitingConfirmation) {
                  closeButton.textContent = "close";
                  closeButton.style.backgroundColor = "#e2e8c0";
                  closeButton.removeEventListener("click", handleDelete);
                  isAwaitingConfirmation = false;
                }
              }, 3000);
            }
          });
          joinButton.addEventListener(
            "click",
            () => {
              content0.style.opacity = 0;
              const xhr = new XMLHttpRequest();
              xhr.open("GET", "../../public/chatingPage.html", true);
              xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                  setTimeout(() => {
                    content0.innerHTML = DOMPurify.sanitize(xhr.responseText);
                    content0.style.opacity = 1;
                  }, 200);
                }
              };
              xhr.send();
              setTimeout(() => {
                document.getElementById("headerElem").innerHTML =
                  DOMPurify.sanitize(``);
              }, 200);
              setTimeout(() => {
                activeChanel(docIdN1, player);
              }, 300);
            },
            { once: true }
          );
        }
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

async function activeChanel(docId, playerName) {
  activePage = "chatingPage";
  const sendButton = document.getElementById("sendButton");
  const inputField = document.getElementById("messageInput");
  setTimeout(() => listenNewMessage(docId), 2000);
  backButton();
  getMessage(docId);
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !document.getElementById("offButton")) {
      sendButton.id = "offButton";
      sendButton.className = "offButton";
      sendButton.style.cursor = "default";
      initSendMessage(docId);
      inputField.value = "";
    }
  });
  sendButton.addEventListener("click", () => {
    sendButton.id = "offButton";
    sendButton.className = "offButton";
    sendButton.style.cursor = "default";
    initSendMessage(docId);
    inputField.value = "";
  });
}

async function initSendMessage(docId) {
  const offButton = document.getElementById("offButton");
  const input = document.getElementById("messageInput");
  if (!input.value) {
    showNotification("error", "Error : can't send empty message", 3000);
    offButton.id = "sendButton";
    offButton.style.cursor = "pointer";
    offButton.className = "buttonSend";
    return;
  }
  try {
    const result = await sendMessage({
      message: input.value,
      sessionId: docId,
    });
    showNotification("valid", result.data.status, 2000);
    reloadMessage(docId);
    offButton.id = "sendButton";
    offButton.style.cursor = "pointer";
    offButton.className = "buttonSend";

    input.value = "";
    return result.data.status;
  } catch (error) {
    console.error(error);
  }
}

async function listenNewMessage(docId) {
  try {
    const snap = onSnapshot(
      collection(db, "privateMessage", docId, "chat"),
      (doc) => {
        if ((doc.type = "added")) {
          reloadMessage(docId);
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function getMessage(docId) {
  const ulPath = document.getElementById("messageUl");
  const currentChanel = docId;
  let docMessage = [];
  ulPath.innerHTML = DOMPurify.sanitize(``);
  const username = localStorage.getItem("username");

  try {
    const docRef = collection(db, "privateMessage", currentChanel, "chat");
    const q = query(docRef, orderBy("createdAt"));
    const qAllMessage = await getDocs(q);
    docMessage = qAllMessage.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    showNotification("error", "Error : unable to retrieve message", 3000);
    return;
  }
  docMessage.forEach((message) => {
    if (!document.getElementById(message.id)) {
      const li = document.createElement("li");
      li.id = message.id;
      li.textContent = message.text;
      if (message.player === username) {
        li.className = "player1";
      } else {
        li.className = "player2";
      }
      ulPath.appendChild(li);
      ulPath.scrollTop = ulPath.scrollHeight;
    }
  });
}

async function reloadMessage(docId) {
  const ulPath = document.getElementById("messageUl");
  const currentChanel = docId;
  let docMessage = [];
  const username = localStorage.getItem("username");

  try {
    const docRef = collection(db, "privateMessage", currentChanel, "chat");
    const q = query(docRef, orderBy("createdAt"));
    const qAllMessage = await getDocs(q);
    docMessage = qAllMessage.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    showNotification("error", "Error : unable to retrieve Message", 3000);
    return;
  }
  docMessage.forEach((message) => {
    if (!document.getElementById(message.id)) {
      const li = document.createElement("li");
      li.id = message.id;
      li.textContent = message.text;

      if (message.player === username) {
        li.className = "player1";
      } else {
        li.className = "player2";
      }
      ulPath.appendChild(li);
      ulPath.scrollTop = ulPath.scrollHeight;
    }
  });
}
// End private message page function

function buttonLoadingAnim(button) {
  const idName = button.id;
  const disabledButton = button;
  disabledButton.style.backgroundColor = "#444444";
  disabledButton.style.color = "#888888";
  disabledButton.textContent = "Pending...";
  disabledButton.className = "button99";
  disabledButton.id = "disabled" + idName;
}

async function handleConnectClick() {
  try {
    const connectButton = document.getElementById("buttonSignIn");
    connectButton.removeEventListener("click", handleConnectClick);
    buttonLoadingAnim(connectButton);
    const getData = await getLocalData(["publicAdress"]);
    const publicAdress = getData.publicAdress;
    console.log(publicAdress);
    const askConnect = await connectUser();
    console.log(askConnect);
    if (askConnect) {
      const disabledButton = document.getElementById("disabledbuttonSignIn");
      disabledButton.textContent = reduceWalletAdress(publicAdress);
      disabledButton.disabled = true;
      disabledButton.className = "connectedButton";
      disabledButton.style = "";
      disabledButton.style.marginTop = "auto";
      disabledButton.id = "buttonSignIn";
    } else {
      const disabledButton = document.getElementById("disabledbuttonSignIn");
      disabledButton.className = "button";
      disabledButton.textContent = "connect";
      disabledButton.id = "buttonSignIn";
      document
        .getElementById("buttonSignIn")
        .addEventListener("click", handleConnectClick);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getLocalData(querry) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(querry, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  homePage();

  activePage = "homePage";
  let manifest = chrome.runtime.getManifest();
  let storedVersion = localStorage.getItem("AppVersion");
  let version = manifest.version;
  if (!storedVersion) {
    localStorage.setItem("AppVersion", version);
  }
  if (storedVersion != version) {
    showNotification("info", "App have been updated.", 3000);
    localStorage.setItem("AppVersion", version);
  }
  document.getElementById("version").textContent = "V " + version;
});
