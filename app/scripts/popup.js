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

/*const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");*/
const functions = getFunctions(app);
const acceptInvitation = httpsCallable(functions, "acceptInvitation");
const sendInvitation = httpsCallable(functions, "sendInvitation");
const sendMessage = httpsCallable(functions, "sendMessage");
let logged;

let activePage;
let bouton0;
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

/*async function checkIfDocumentExists() {
  const key = "uid";
  const uid = localStorage.getItem(key);
  const docRef = doc(db, "users", uid); // Spécifiez le chemin du document que vous souhaitez vérifier
  const walletDocRef = db.collection("users").doc(uid);

  try {
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.log("Le document existe.");
      // Faites ce que vous voulez si le document existe
    } else {
      console.log("Le document n'existe pas.");
      // Faites ce que vous voulez si le document n'existe pas
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la vérification du document :",
      error
    );
    // Gérez l'erreur ici
  }
}*/
const birdeyeKey = localStorage.getItem("apiKey");
const username = localStorage.getItem("username");
const uid = localStorage.getItem("uid");
function registerInDB(walletInput, nameInput) {
  const uid = localStorage.getItem("uid");
  const documentRef = doc(db, "users", uid);
  let data = {
    wallet: walletInput,
    username: nameInput,
  };
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
      if (document.getElementById("signButton")) {
        document.getElementById("signButton").remove();
      }
    } else {
      localStorage.setItem("logged", logged);
    }

    // Appeler la fonction de callback avec l'état de connexion
    callback(logged);

    // Se désabonner immédiatement après la première exécution
    unsubscribe();
  };

  // Ajouter l'écouteur onAuthStateChanged et obtenir la fonction de désabonnement
  const unsubscribe = onAuthStateChanged(auth, authStateChangeCallback);
}

/*
// Exemple d'utilisation
checkIfLogged((isLoggedIn) => {
  if (isLoggedIn) {
    console.log("L'utilisateur est connecté");
  } else {
    console.log("L'utilisateur n'est pas connecté");
  }
});*/

// Fonction pour afficher la page d'accueil lorsqu'un utilisateur est connecté
function homeLogged() {
  activePage = "homePage";
  content0 = document.getElementById("buttonList");
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
}

// Fonction pour afficher la page d'accueil lorsque l'utilisateur n'est pas connecté
function homeNotLog() {
  activePage = "homePage";
  content0 = document.getElementById("buttonList");
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
  bouton0 = document.getElementById("button0");
  content0 = document.getElementById("buttonList");
  if (
    activePage === "sendInvitePage" ||
    activePage === "manageChanelPage" ||
    activePage === "invitationPage"
  ) {
    bouton0.addEventListener(
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
    bouton0.addEventListener(
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
    bouton0.addEventListener(
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
function showNotification(type, message, duration = 5000) {
  //show notification
  const notifElem = document.createElement("div");
  notifElem.className = "notification";
  if (type === "error") {
    notifElem.innerHTML = DOMPurify.sanitize(`
    
      <img src="../app/assets/errorLogo.png" class="stateLogo"
    
    <p>${message}</p>
    `);
  } else if (type === "valide") {
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

function setWalletPage() {
  activePage = "setWalletPage";
  document.getElementById("submitPlayerInfo").addEventListener("click", () => {
    const walletInput = document.getElementById("playerWallet").value;
    const nameInput = document.getElementById("playerName").value;
    //---
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
      console.log(error);
    }
  });
}
function homePage() {
  const signButton = document.getElementById("signButton");
  document.getElementById("loadingOverlay").style.display = "none";
  document.getElementById("buttonList").style.display = "flex";
  activePage = "homePage";
  const bouton1 = document.getElementById("button1");
  const content1 = document.getElementById("buttonList");
  const bouton2 = document.getElementById("button2");

  if (localStorage.getItem("logged") == "false") {
    if (document.getElementById("button3")) {
      document.getElementById("button3").addEventListener("click", () => {
        document.getElementById("button3").remove();
      });
    }

    document.getElementById("signButton").addEventListener(
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
  bouton2.addEventListener("click", () => {
    checkIfLogged((isLoggedIn) => {
      if (isLoggedIn) {
        let launchLoad = buttonLoadingAnim(bouton2);
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
      return;
    });
  });

  bouton1.addEventListener("click", () => {
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
      document.getElementById("button3").addEventListener("click", () => {
        signOut(auth);
        homeNotLog();
        logged = false;
        localStorage.setItem("logged", logged);

        setTimeout(homePage, 300);
      });
    }, 400);
  }
}

// Fonction pour afficher la page de prix
function pricePage() {
  activePage = "pricePage";
  bouton0 = document.getElementById("button0");
  content0 = document.getElementById("buttonList");
  const cocoButton = document.getElementById("tradeCoco");
  const nanaButton = document.getElementById("tradeNana");
  const birdeyeKey = localStorage.getItem("apiKey");
  if (birdeyeKey) {
    cocoPrice();
    solanaPrice();
    nanaPrice();
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
            let testKey = await cocoPriceTest(inputKey);
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
              showNotification("valide", "Your Key is valid", 2000);
            } else {
              showNotification("error", "Error : Wrong ApiKey.", 5000);
              document.getElementById("apiKey").value = "";
            }
          } catch (error) {
            console.log(error);
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

// Fonction pour afficher la page de messages privés
function privateMessagePage() {
  activePage = "privateMessagePage";
  bouton0 = document.getElementById("button0");
  content0 = document.getElementById("buttonList");
  backButton();
  document.getElementById("buttonCreate").addEventListener("click", () => {
    activePage = "sendInvitePage";
    content0 = document.getElementById("buttonList");
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
    content0 = document.getElementById("buttonList");
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
      content0 = document.getElementById("buttonList");
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

// Fonction pour afficher la page de connexion/inscription
function signPage() {
  activePage = "signPage";
  backButton();
  let signinButton = document.getElementById("signinButton");
  let loginButton = document.getElementById("loginButton");
  let emailPath = document.getElementById("email");
  let passwordPath = document.getElementById("password");
  loginButton.addEventListener("click", () => {
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
            document.getElementById("errorContainer").innerHTML =
              DOMPurify.sanitize(`
            <p id="errorMessage" class="errorMessage" style="color:#f02d3d">Email is not verified yet</p>
            <button id="emailVerifButton" class="button" style="cursor: pointer">Resend Email ?</button>`);
            document.getElementById("emailVerifButton").addEventListener(
              "click",
              () => {
                if (cooldown && cooldown > 0) {
                  document.getElementById(
                    "emailVerifButton"
                  ).style.backgroundColor = "#f02d3d";
                }
                if (!cooldown || cooldown == 0) {
                  cooldown = 61;
                  function updateCooldown() {
                    if (activePage === "signPage") {
                      if (!document.getElementById("cooldown")) {
                        const cooldownPath =
                          document.getElementById("errorContainer");
                        const cooldownElem = document.createElement("div");
                        cooldownElem.id = "cooldown";
                        cooldownPath.appendChild(cooldownElem);
                      }
                    }
                    const cooldownElement = document.getElementById("cooldown");
                    if (cooldown === 0) {
                      clearInterval(cooldownInterval);
                    } else {
                      cooldown--;
                      if (cooldownElement) {
                        cooldownElement.textContent = cooldown;
                      }
                    }
                  }

                  updateCooldown();
                  const cooldownInterval = setInterval(updateCooldown, 1000);
                  document.getElementById(
                    "emailVerifButton"
                  ).style.backgroundColor = "#00c377";
                  sendEmailVerification(user);
                }
              },
              { once: true }
            );

            signOut(auth);
          } else {
            logged = true;
            showNotification("valide", "Logged successfully.", 5000);
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
        // ...
      })
      .catch((error) => {
        console.log(error);
        document.getElementById("errorMessage").style.color = "#f02d3d";
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode.includes("invalid-email")) {
          showNotification("error", "Error : Invalid Email.", 5000);
        }
        if (errorMessage.includes("invalid-login-credentials")) {
          showNotification("error", "Error : Wrong Email/Password.", 5000);
        }
        if (errorMessage.includes("auth/missing-password")) {
          showNotification("error", "Error : Missing Password.", 5000);
        }
      });
  });

  signinButton.addEventListener(
    "click",
    () => {
      email = emailPath.value;
      password = passwordPath.value;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          sendEmailVerification(auth.currentUser).then(() => {
            document.getElementById("errorMessage").style.color = "#00c377";
            document.getElementById("errorMessage").textContent =
              "please verify your email";
            // Email verification sent!
            // ...
            // verifyEmail();
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          document.getElementById("errorMessage").style.color = "#f02d3d";
          if (errorMessage.includes("auth/missing-password")) {
            showNotification("error", "Error : Missing Password.", 5000);
          }
          if (errorCode.includes("invalid-email")) {
            showNotification("error", "Error : Invalid Email.", 5000);
          }
          if (errorCode.includes("auth/weak-password")) {
            showNotification("error", "Error : Password is too weak.", 5000);
          }
          if (errorCode.includes("email-already-in-use")) {
            showNotification(
              "error",
              "Error : Email already registered.",
              5000
            );
          }
          // ..
        });
    },
    { once: true }
  );
}

function solanaPrice() {
  const birdeyeKey = CryptoJS.AES.decrypt(
    localStorage.getItem("apiKey"),
    localStorage.getItem("uid")
  ).toString(CryptoJS.enc.Utf8);
  const option = {
    method: "GET",
    headers: { "x-chain": "solana", "x-API-KEY": birdeyeKey },
  };
  fetch(
    "https://public-api.birdeye.so/public/multi_price?list_address=So11111111111111111111111111111111111111112",
    option
  )
    .then((response) => response.json())
    .then((data) => {
      let solanaChange =
        data.data.So11111111111111111111111111111111111111112.priceChange24h;
      let solana = data.data.So11111111111111111111111111111111111111112.value;
      let cleanedSolChange = parseFloat(solanaChange).toFixed(2);
      let cleanedSolana = parseFloat(solana).toFixed(3);
      let injectSol = document.getElementById("solPrice");
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
    })
    .catch((error) => {
      console.log(error);
    });
}

function cocoPriceTest(key) {
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
      // Vous pourriez choisir de retourner quelque chose ici en cas d'erreur.
    });
}
function cocoPrice() {
  const birdeyeKey = CryptoJS.AES.decrypt(
    localStorage.getItem("apiKey"),
    localStorage.getItem("uid")
  ).toString(CryptoJS.enc.Utf8);
  const option = {
    method: "GET",
    headers: { "x-chain": "solana", "x-API-KEY": birdeyeKey },
  };
  fetch(
    "https://public-api.birdeye.so/public/multi_price?list_address=74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ",
    option
  )
    .then((response) => response.json())
    .then((data) => {
      let cocoChange =
        data.data["74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ"]
          .priceChange24h;
      let cleanedCocoChange = parseFloat(cocoChange).toFixed(2);
      let coco =
        data.data["74DSHnK1qqr4z1pXjLjPAVi8XFngZ635jEVpdkJtnizQ"].value;
      cleanedCoco = parseFloat(coco).toFixed(6);
      let injectCoco = document.getElementById("cocoPrice");
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
    })
    .catch((error) => {
      console.log(error);
    });
}
function nanaPrice() {
  const birdeyeKey = CryptoJS.AES.decrypt(
    localStorage.getItem("apiKey"),
    localStorage.getItem("uid")
  ).toString(CryptoJS.enc.Utf8);
  let handled = false;
  const option = {
    method: "GET",
    headers: { "x-chain": "solana", "x-API-KEY": birdeyeKey },
  };
  fetch(
    "https://public-api.birdeye.so/public/multi_price?list_address=HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr",
    option
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401 && !handled) {
          showNotification("error", "Error : Wrong ApiKey.", 5000);
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
          document.getElementById("submitApiKey").addEventListener(
            "click",
            (event) => {
              event.preventDefault();
              const key = document.getElementById("apiKey").value;
              localStorage.setItem("apiKey", key);
              const child = document.getElementById("apiKeyForm");
              path.removeChild(child);
              nanaPrice();
              cocoPrice();
              solanaPrice();
            },
            { once: true }
          );
          handled = true;
          return;
        }

        throw new Error("Erreur lors de la requête");
      }
      return response.json();
    })
    .then((data) => {
      let nanaChange =
        data.data.HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr.priceChange24h;
      let cleanedNanaChange = parseFloat(nanaChange).toFixed(2);
      let nana = data.data.HxRELUQfvvjToVbacjr9YECdfQMUqGgPYB68jVDYxkbr.value;
      cleanedNana = parseFloat(nana).toFixed(6);
      let injectNana = document.getElementById("nanaPrice");
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
    })
    .catch((error) => {
      console.log(error);
    });
}
// Start private message page function
async function initSendInvitation() {
  const walletAdress = document.getElementById("walletAdress").value;

  if (!walletAdress) {
    return;
  }
  const docRef = collection(db, "users");
  const q = query(docRef, where("wallet", "==", walletAdress));
  const qResult = await getDocs(q);

  if (qResult.size === 0) {
    showNotification("error", "Error : un-registered Adress.", 5000);
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
    console.log(error);
    return;
  }
}
function sendInvite() {
  backButton();
  document.getElementById("sendInvite").addEventListener("click", () => {
    //sendFunction();
    const bouton = document.getElementById("sendInvite");
    let launchLoad = buttonLoadingAnim(bouton);
    initSendInvitation().then((result1) => {
      if (result1 === "sent") {
        showNotification("valide", "Invitation sent successfully.", 5000);
        bouton.style.color = "#313131";
        bouton.textContent = "Invitation Sent !";
        bouton.style.backgroundColor = "#00c377";
        setTimeout(() => {
          bouton.textContent = "send the invite";
          bouton.className = "button";
          bouton.style.backgroundColor = "#e2e8c0";
          bouton.id = "sendInvite";
        }, 2000);
        //
      } else if (result1 === "already exist") {
        showNotification("error", "Error : Session already Exist.", 5000);
        bouton.style.color = "#313131";
        bouton.textContent = "session already exist with player";
        bouton.style.backgroundColor = "#f45b69";
        setTimeout(() => {
          bouton.textContent = "send the invite";
          bouton.className = "button";
          bouton.style.backgroundColor = "#e2e8c0";
          bouton.id = "sendInvite";
        }, 2000);
      } else {
        setTimeout(() => {
          bouton.style.color = "#313131";
          bouton.textContent = "send the invite";
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
    console.log(error);
    return;
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
  const sendBy = [];
  const players = [];
  try {
    qResult.forEach((doc) => {
      sessionId.push(doc.id);
      sendBy.push(doc.data().sendBy);
      players.push(doc.data().player1);
    });
  } catch (error) {
    console.log(error);
  }
  for (let i = 0; i < players.length; i++) {
    const sendBy1 = sendBy[i];
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
          console.log(result);
        });
        document.getElementById(stringId).remove();
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
            "valide",
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
    console.log(error);
  }
}
async function activeChanel(docId, playerName) {
  activePage = "chatingPage";
  const ulPath = document.getElementById("messageUl");
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
    showNotification("valide", result.data.status, 2000);
    reloadMessage(docId);
    offButton.id = "sendButton";
    offButton.style.cursor = "pointer";
    offButton.className = "buttonSend";

    input.value = "";
    return result.data.status;
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    showNotification("error", "Error : unable to retrieve message", 5000);
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
    showNotification("error", "Error : unable to retrieve Message", 5000);
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
function buttonLoadingAnim(bouton) {
  const bouton1 = bouton;
  bouton1.style.backgroundColor = "#444444";
  bouton1.style.color = "#888888";
  bouton1.textContent = "Pending...";
  bouton1.className = "button99";
  bouton1.id = "bouton99";
}

// Ajoutez ici les écouteurs d'événements et le code qui doit s'exécuter au chargement de la page
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

    // Une fois que le premier changement est détecté, supprimez l'écouteur
    // pour qu'il ne soit plus appelé par la suite.
    unsubscribeAuthStateChange();
  };

  // Ajoutez l'écouteur onAuthStateChanged
  const unsubscribeAuthStateChange = onAuthStateChanged(
    auth,
    authStateChangeCallback
  );

  activePage = "homePage";
  let signButton = document.getElementById("signButton");
  let manifest = chrome.runtime.getManifest();
  let version = manifest.version;
  document.getElementById("version").textContent = "V " + version;
});
