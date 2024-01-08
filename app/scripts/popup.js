import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  authStateChangeCallback,
  unsubscribeAuthStateChange,
  signOut,
  updateProfile,
} from "firebase/auth";
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
} from "firebase/firestore";
import { auth, app, db } from "./initFirebase";
import DOMPurify from "dompurify";
import CryptoJS from "crypto-js";

// Firebase Functions
const functions = getFunctions(app);
const acceptInvitation = httpsCallable(functions, "acceptInvitation");
const sendInvitation = httpsCallable(functions, "sendInvitation");
const sendMessage = httpsCallable(functions, "sendMessage");

let logged;
let activePage;
let buttonBack;
let cleanedCoco;
let cleanedNana;
let cleanedSolana;
let content0;
let email;
let password;
let user;
let delay;
let cooldown;
let infoSubmit;
let invitedUid;
let invitedUsername;

const birdeyeKey = localStorage.getItem("apiKey");
const username = localStorage.getItem("username");
const uid = localStorage.getItem("uid");

function registerInDB(walletInput, nameInput) {
  const uid = localStorage.getItem("uid");
  const documentRef = doc(db, "users", uid);
  let data = {};

  if (typeof walletInput !== "undefined") data.wallet = walletInput;
  if (typeof nameInput !== "undefined") data.username = nameInput;

  updateDoc(documentRef, data);
}

function checkIfLogged(callback) {
  const authStateChangeCallback = (user) => {
    let logged = false;
    if (user && user.emailVerified) {
      logged = true;
      const uid = user.uid;
      const username = user.displayName;
      localStorage.setItem("uid", uid);
      localStorage.setItem("username", username);
      localStorage.setItem("logged", logged);
      if (activePage !== "homePage") {
        homeLogged();
      }
      if (document.getElementById("buttonSignIn")) {
        document.getElementById("buttonSignIn").remove();
      }
    } else {
      localStorage.setItem("logged", logged);
    }

    callback(logged);
    unsubscribe();
  };
  const unsubscribe = onAuthStateChanged(auth, authStateChangeCallback);
}

function homeLogged() {
  activePage = "homePage";
  content0 = document.getElementById("dynamicContent");
  content0.style.opacity = 0;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../../public/popupLogged.html", true);
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
  user = auth.currentUser;
}

function homeNotLog() {
  activePage = "homePage";
  content0 = document.getElementById("dynamicContent");
  content0.style.opacity = 0;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../../public/popupNotLog.html", true);
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
    activePage === "editUserDataPage " ||
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
        if (localStorage.getItem("logged") == "true") {
          homeLogged();
        } else {
          homeNotLog();
        }
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

async function checkUsedWallet(wallet) {
  const docRef = collection(db, "users");
  const q = query(docRef, where("wallet", "==", wallet));
  const qResult = await getDocs(q);
  console.log(qResult.size);
  if (qResult.size > 0) {
    console.log("true");
    return true;
  } else {
    console.log("false");
    return false;
  }
}
function setWalletPage() {
  activePage = "setWalletPage";
  document
    .getElementById("submitPlayerInfo")
    .addEventListener("click", async () => {
      const walletInput = document.getElementById("playerWallet").value;
      const nameInput = document.getElementById("playerName").value;
      let isWalletUsed = await checkUsedWallet(walletInput);
      if (isWalletUsed === true) {
        showNotification(
          "error",
          "Wallet already registered with another account",
          5000
        );
        return;
      }
      try {
        updateProfile(user, { displayName: nameInput });
        registerInDB(walletInput, nameInput);
        localStorage.setItem("displayName", nameInput);
        infoSubmit = true;
        localStorage.setItem("infoSubmit", infoSubmit);
        document.getElementById("submitPlayerInfo").style.backgroundColor =
          "#00c377";
        setTimeout(homeLogged, 800);
      } catch (error) {
        console.error(error);
      }
    });
}

function homePage() {
  activePage = "homePage";
  const openDocBtn = document.getElementById("docButton");
  document.getElementById("loadingOverlayHome").style.display = "none";
  document.getElementById("dynamicContent").style.display = "flex";
  const buttonPricePage = document.getElementById("buttonPricePage");
  const content1 = document.getElementById("dynamicContent");
  const buttonDM = document.getElementById("buttonDM");
  const editUserDataBtn = document.getElementById("editUserDataButton");
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
  if (localStorage.getItem("logged") == "false") {
    if (document.getElementById("buttonSignOut")) {
      document.getElementById("buttonSignOut").addEventListener("click", () => {
        document.getElementById("buttonSignOut").remove();
      });
    }

    document.getElementById("buttonSignIn").addEventListener(
      "click",
      () => {
        content1.style.opacity = 0;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../../public/sign.html", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            setTimeout(() => {
              content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
              content1.style.opacity = 1;
            }, 200);
          }
        };
        xhr.send();
        setTimeout(signPage, 400);
      },
      { once: true }
    );
  }
  document.getElementById("inGameMiscButton").addEventListener(
    "click",
    () => {
      content1.style.opacity = 0;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "../../public/miscOptions.html", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          setTimeout(() => {
            content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
            content1.style.opacity = 1;
          }, 200);
        }
      };
      xhr.send();
      setTimeout(inGameMiscOptions, 400);
    },
    { once: true }
  );
  buttonDM.addEventListener("click", () => {
    checkIfLogged((isLoggedIn) => {
      if (isLoggedIn) {
        buttonLoadingAnim(buttonDM);
        (async function () {
          const uid = localStorage.getItem("uid");
          let docRef = doc(db, "users", uid);
          let snap = await getDoc(docRef);
          if (!snap.data().wallet) {
            content1.style.opacity = 0;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "../../public/setWallet.html", true);
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                setTimeout(() => {
                  content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
                  content1.style.opacity = 1;
                }, 200);
              }
            };
            xhr.send();
            setTimeout(setWalletPage, 300);
          } else {
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
          }
        })();
      } else {
        showNotification("error", "You need to Log-in First.", 3000);
      }
    });
  });
  editUserDataBtn.addEventListener("click", () => {
    checkIfLogged((isLoggedIn) => {
      if (isLoggedIn) {
        content1.style.opacity = 0;

        const xhr = new XMLHttpRequest();
        xhr.open("GET", "../../public/updateUserData.html", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            setTimeout(() => {
              content1.innerHTML = DOMPurify.sanitize(xhr.responseText);
              content1.style.opacity = 1;
            }, 200);
          }
        };
        xhr.send();
        setTimeout(editUserDataPage, 300);
      } else {
        showNotification("error", "You need to Log-in First.", 3000);
        return;
      }
    });
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
  if (logged) {
    setTimeout(() => {
      document.getElementById("buttonSignOut").addEventListener("click", () => {
        signOut(auth);
        homeNotLog();
        logged = false;
        localStorage.setItem("logged", logged);

        setTimeout(homePage, 300);
      });
    }, 400);
  }
}

function filterString(string) {
  if (string.length > 10) {
    return string.substring(0, 5) + "..." + string.substring(string.length - 5);
  }
  return string;
}

function inGameMiscOptions() {
  backButton();
  const switches = document.querySelectorAll(".switch input");
  const ul = document.getElementById("miscOptionUl");
  const toolTip1 = document.getElementById("toolTip1");
  const toolTip2 = document.getElementById("toolTip2");
  toolTip1.previousElementSibling.addEventListener("mousemove", (e) => {
    toolTip1.style.display = "block";
    toolTip1.style.left = e.clientX - 100 + "px";
    toolTip1.style.top = e.clientY - toolTip1.clientHeight - 10 + "px";
  });
  toolTip2.previousElementSibling.addEventListener("mousemove", (e) => {
    toolTip2.style.display = "block";
    toolTip2.style.left = e.clientX - 100 + "px";
    toolTip2.style.top = e.clientY - toolTip2.clientHeight - 10 + "px";
  });
  toolTip1.previousElementSibling.addEventListener("mouseout", () => {
    toolTip1.style.display = "none";
  });
  toolTip2.previousElementSibling.addEventListener("mouseout", () => {
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

async function editUserDataPage() {
  activePage = "editUserDataPage";
  backButton();
  try {
    const docRef = doc(db, "users", user.uid);
    const snap = await getDoc(docRef);
    const actualWallet = document.getElementById("walletText");
    if (snap.data()) {
      const walletAdress = filterString(snap.data().wallet);
      actualWallet.textContent = walletAdress;
    }
    const submitDataBtn = document.getElementById("submitDataBtn");

    submitDataBtn.addEventListener("click", () => {
      const walletInput = document.getElementById("playerWallet").value;
      if (walletInput) {
        //update wallet
        registerInDB(walletInput, undefined);
        showNotification("info", "Wallet adress updated", 3000);
        document.getElementById("buttonBack").click();
      } else {
        showNotification("error", "Error : Empty field.", 3000);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function pricePage() {
  activePage = "pricePage";
  buttonBack = document.getElementById("buttonBack");
  content0 = document.getElementById("dynamicContent");
  const cocoButton = document.getElementById("tradeCoco");
  const nanaButton = document.getElementById("tradeNana");
  const birdeyeKey = localStorage.getItem("apiKey");
  if (birdeyeKey) {
    (async () => {
      let elementsLoaded = 0;
      const parent = document.getElementById("loadingOverlayPrice");
      const newChild = document.createElement("p");
      newChild.textContent = elementsLoaded + "/3";
      newChild.id = "elementsLoaded";
      newChild.style.color = "#e2e8c0";
      newChild.style.fontFamily = "Bangers";
      parent.appendChild(newChild);
      const coco = await cocoPrice();
      if (coco) {
        elementsLoaded++;
        document.getElementById("elementsLoaded").textContent =
          elementsLoaded + "/3";
      }
      const sol = await solanaPrice();
      if (sol) {
        elementsLoaded++;
        document.getElementById("elementsLoaded").textContent =
          elementsLoaded + "/3";
      }
      const nana = await nanaPrice();
      if (nana) {
        elementsLoaded++;
        document.getElementById("elementsLoaded").textContent =
          elementsLoaded + "/3";
      }

      if (coco && sol && nana) {
        document.getElementById("loadingOverlayPrice").style.display = "none";
        document.getElementById("dynamicContent").style.display = "flex";
      }
    })();
  } else {
    const path = document.getElementById("priceContain");
    const form = document.createElement("form");
    form.id = "apiKeyForm";
    form.innerHTML = DOMPurify.sanitize(`
    <label for="apiKey">
      <input type="text" id="apiKey" required aria-invalid="true" placeholder="Insert Your Birdeye Api Key"/>
    </label>
    <button id="submitApiKey" class="button">Submit Api Key</button>
    `);
    path.appendChild(form);
    document
      .getElementById("submitApiKey")
      .addEventListener("click", (event) => {
        event.preventDefault();
        (async function testApiKey() {
          try {
            let inputKey = document.getElementById("apiKey").value;
            let testKey = await checkAPI(inputKey);
            if (testKey != null) {
              const key = document.getElementById("apiKey").value;
              const encryptedData = CryptoJS.AES.encrypt(
                key,
                localStorage.getItem("uid")
              ).toString();
              localStorage.setItem("apiKey", encryptedData);
              const child = document.getElementById("apiKeyForm");
              path.removeChild(child);
              cocoPrice();
              solanaPrice();
              nanaPrice();
              showNotification("valid", "Your Key is valid", 2000);
            } else {
              showNotification("error", "Error : Wrong ApiKey.", 3000);
              document.getElementById("apiKey").value = "";
            }
          } catch (error) {
            console.error(error);
          }
        })();
      });
  }
  cocoButton.addEventListener("click", () => {
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

  backButton();
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

function signPage() {
  activePage = "signPage";
  backButton();
  let SigninButton = document.getElementById("SigninButton");
  let LoginButton = document.getElementById("LoginButton");
  let emailPath = document.getElementById("email");
  let passwordPath = document.getElementById("password");
  LoginButton.addEventListener("click", () => {
    buttonLoadingAnim(LoginButton);
    setTimeout(() => {
      const disabledLoginButton = document.getElementById(
        "disabledLoginButton"
      );
      if (disabledLoginButton) {
        disabledLoginButton.className = "button";
        disabledLoginButton.textContent = "login";
        disabledLoginButton.style.margin = "10px";
        disabledLoginButton.style.color = "#313131";
        disabledLoginButton.style.backgroundColor = "#e2e8c0";
        disabledLoginButton.id = "LoginButton";
      }
    }, 5000);
    email = emailPath.value;
    password = passwordPath.value;
    user = auth.currentUser;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        user = userCredential.user;
        const uid = user.uid;
        const emailVerified = user.emailVerified;
        localStorage.setItem("uid", uid);
        localStorage.setItem("emailVerified", emailVerified);

        if (user) {
          if (user.emailVerified !== true) {
            showNotification("error", "Email not Verified", 3000);
            const errorContainer = document.getElementById("errorContainer");
            const newElem = document.createElement("button");
            newElem.id = "EmailVerifButton";
            newElem.className = "button";
            newElem.style.cursor = "pointer";
            newElem.textContent = "Resend Email";
            if (!document.getElementById("EmailVerifButton")) {
              errorContainer.appendChild(newElem);
            }
            const EmailVerifButton =
              document.getElementById("EmailVerifButton");
            EmailVerifButton.addEventListener(
              "click",
              () => {
                sendEmailVerification(user);
                console.log("clicked");
                buttonLoadingAnim(EmailVerifButton);
                setTimeout(() => {
                  const disabledEmailVerifButton = document.getElementById(
                    "disabledEmailVerifButton"
                  );
                  disabledEmailVerifButton.className = "button";
                  disabledEmailVerifButton.textContent = "signin";
                  disabledEmailVerifButton.style.color = "#313131";
                  disabledEmailVerifButton.style.backgroundColor = "#e2e8c0";
                  disabledEmailVerifButton.id = "Send email";
                }, 60000);
              },
              { once: true }
            );
            signOut(auth);
          } else {
            logged = true;
            showNotification("valid", "Logged successfully.", 3000);
            localStorage.setItem("logged", logged);
            async function setUid() {
              const userRefCheck = doc(db, "users", user.uid);
              const usersCheck = await getDoc(userRefCheck);
              if (!usersCheck.exists()) {
                const documentRef = doc(db, "users", user.uid);
                let data = {
                  uid: uid,
                };
                setDoc(documentRef, data);
              }
            }
            setUid();
            checkIfLogged((isLoggedIn) => {
              if (isLoggedIn) {
              }
            });
          }
        }
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode.includes("invalid-email")) {
          showNotification("error", "Error : Invalid Email.", 3000);
        }
        if (errorMessage.includes("invalid-login-credentials")) {
          showNotification("error", "Error : Wrong Email/Password.", 3000);
        }
        if (errorMessage.includes("auth/missing-password")) {
          showNotification("error", "Error : Missing Password.", 3000);
        }
      });
  });

  SigninButton.addEventListener(
    "click",
    () => {
      buttonLoadingAnim(SigninButton);
      email = emailPath.value;
      password = passwordPath.value;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser).then(() => {
            const disabledSigninButton = document.getElementById(
              "disabledSigninButton"
            );
            disabledSigninButton.className = "button";
            disabledSigninButton.textContent = "signin";
            disabledSigninButton.style.color = "#313131";
            disabledSigninButton.style.backgroundColor = "#e2e8c0";
            disabledSigninButton.id = "SigninButton";
            showNotification("info", "Check your mail for verification", 3000);
          });
        })
        .catch((error) => {
          const disabledSigninButton = document.getElementById(
            "disabledSigninButton"
          );
          disabledSigninButton.className = "button";
          disabledSigninButton.textContent = "signin";
          disabledSigninButton.style.color = "#313131";
          disabledSigninButton.style.backgroundColor = "#e2e8c0";
          disabledSigninButton.id = "SigninButton";
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage.includes("auth/missing-password")) {
            showNotification("error", "Error : Missing Password.", 3000);
          }
          if (errorCode.includes("invalid-email")) {
            showNotification("error", "Error : Invalid Email.", 3000);
          }
          if (errorCode.includes("auth/weak-password")) {
            showNotification("error", "Error : Password is too weak.", 3000);
          }
          if (errorCode.includes("email-already-in-use")) {
            showNotification(
              "error",
              "Error : Email already registered.",
              3000
            );
          }
        });
    },
    { once: true }
  );
}

async function solanaPrice() {
  try {
    const birdeyeKey = CryptoJS.AES.decrypt(
      localStorage.getItem("apiKey"),
      localStorage.getItem("uid")
    ).toString(CryptoJS.enc.Utf8);
    const option = {
      method: "GET",
      headers: { "x-chain": "solana", "x-API-KEY": birdeyeKey },
    };

    const response = await fetch(
      "https://public-api.birdeye.so/public/multi_price?list_address=So11111111111111111111111111111111111111112",
      option
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    let solanaChange =
      data.data["So11111111111111111111111111111111111111112"].priceChange24h;
    let cleanedSolChange = parseFloat(solanaChange).toFixed(2);
    let solana = data.data["So11111111111111111111111111111111111111112"].value;
    let cleanedSolana = parseFloat(solana).toFixed(6);

    let injectSol = document.getElementById("solPrice");
    injectSol.innerHTML = "";
    const spanElem = document.createElement("span");
    const imgElem = document.createElement("img");
    imgElem.src = "../app/assets/solLogo.png";
    imgElem.classList.add("logo");
    spanElem.appendChild(imgElem);
    const textContent = document.createTextNode(
      ` $SOL = ${cleanedSolana} (USD) ${cleanedSolChange}%`
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

function checkAPI(key) {
  const option = {
    method: "GET",
    headers: { "x-chain": "solana", "x-API-KEY": key },
  };

  return fetch(
    "https://public-api.birdeye.so/public/multi_price?list_address=74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ",
    option
  )
    .then((response) => response.json())
    .then((data) => {
      let cocoChange =
        data.data["74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ"]
          .priceChange24h;
      return cocoChange;
    })
    .catch((error) => {
      console.error(error);
    });
}
async function cocoPrice() {
  try {
    const birdeyeKey = CryptoJS.AES.decrypt(
      localStorage.getItem("apiKey"),
      localStorage.getItem("uid")
    ).toString(CryptoJS.enc.Utf8);
    const option = {
      method: "GET",
      headers: { "x-chain": "solana", "x-API-KEY": birdeyeKey },
    };

    const response = await fetch(
      "https://public-api.birdeye.so/public/multi_price?list_address=74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ",
      option
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    let cocoChange =
      data.data["74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ"].priceChange24h;
    let cleanedCocoChange = parseFloat(cocoChange).toFixed(2);
    let coco = data.data["74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ"].value;
    let cleanedCoco = parseFloat(coco).toFixed(6);

    let injectCoco = document.getElementById("cocoPrice");
    injectCoco.innerHTML = "";
    const spanElem = document.createElement("span");
    const imgElem = document.createElement("img");
    imgElem.src = "../app/assets/cocoLogo.png";
    imgElem.classList.add("logo");
    spanElem.appendChild(imgElem);
    const textContent = document.createTextNode(
      ` $COCO = ${cleanedCoco} (USD) ${cleanedCocoChange}%`
    );
    injectCoco.appendChild(spanElem);
    injectCoco.appendChild(textContent);

    if (cleanedCocoChange <= 0) {
      injectCoco.style.color = "#f45b69";
    } else {
      injectCoco.style.color = "#00c377";
    }

    return true;
  } catch (error) {
    console.error("Error fetching the coco price:", error);
    return false;
  }
}

async function nanaPrice() {
  try {
    const birdeyeKey = CryptoJS.AES.decrypt(
      localStorage.getItem("apiKey"),
      localStorage.getItem("uid")
    ).toString(CryptoJS.enc.Utf8);
    const option = {
      method: "GET",
      headers: { "x-chain": "solana", "x-API-KEY": birdeyeKey },
    };

    const response = await fetch(
      "https://public-api.birdeye.so/public/multi_price?list_address=HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr",
      option
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    let nanaChange =
      data.data["HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr"].priceChange24h;
    let cleanedNanaChange = parseFloat(nanaChange).toFixed(2);
    let nana = data.data["HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr"].value;
    let cleanedNana = parseFloat(nana).toFixed(6);

    let injectNana = document.getElementById("nanaPrice");
    injectNana.innerHTML = "";
    const spanElem = document.createElement("span");
    const imgElem = document.createElement("img");
    imgElem.src = "../app/assets/nanaLogo.png";
    imgElem.classList.add("logo");
    spanElem.appendChild(imgElem);
    const textContent = document.createTextNode(
      ` $NANA = ${cleanedNana} (USD) ${cleanedNanaChange}%`
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
    where("sendTo", "==", uid)
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
  backButton();
  const docRef = collection(db, "privateMessage");
  const q1 = query(
    docRef,
    where("sendBy", "==", uid),
    where("accepted", "==", true)
  );
  const q2 = query(
    docRef,
    where("sendTo", "==", uid),
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

document.addEventListener("DOMContentLoaded", () => {
  const authStateChangeCallback = (user) => {
    if (user) {
      if (user.emailVerified) {
        logged = true;
        const uid = user.uid;
        const username = user.displayName;
        localStorage.setItem("uid", uid);
        localStorage.setItem("username", username);
        localStorage.setItem("logged", logged);

        homeLogged();
      }
    } else {
      logged = false;
      localStorage.setItem("logged", logged);

      homeNotLog();
    }
    unsubscribeAuthStateChange();
  };
  const unsubscribeAuthStateChange = onAuthStateChanged(
    auth,
    authStateChangeCallback
  );

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
