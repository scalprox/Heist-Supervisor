import { db, app, auth } from "./initFirebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { query, doc, getDocs, collection, where } from "firebase/firestore";
import {
  onAuthStateChanged,
  authStateChangeCallback,
  unsubscribeAuthStateChange,
} from "firebase/auth/web-extension";

const functions = getFunctions(app);
let walletAdress;
const sendInvitation = httpsCallable(functions, "sendInvitation");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "notification") {
    walletAdress = message.adress;
    (() => {
      const authStateChangeCallback = (user) => {
        if (user && user.emailVerified) {
          send();
        } else {
          showNotification("error", "Error : You'r not logged in.", "3000");
          setTimeout(() => {
            window.close();
          }, 3000);
        }
        unsubscribe();
      };
      const unsubscribe = onAuthStateChanged(auth, authStateChangeCallback);
    })();
  }
});

function buttonLoadingAnim(button) {
  const idName = button.id;
  const disabledButton = button;
  disabledButton.style.backgroundColor = "#444444";
  disabledButton.style.color = "#888888";
  disabledButton.textContent = "Pending...";
  disabledButton.className = "button99";
  disabledButton.id = "disabled" + idName;
}

function showNotification(type, message, duration = 5000) {
  const notifElem = document.createElement("div");
  notifElem.className = "notification";
  if (type === "error") {
    notifElem.innerHTML = `
      
        <img src="../app/assets/errorLogo.png" class="stateLogo"
      
      <p>${message}</p>
      `;
  } else if (type === "valide") {
    notifElem.innerHTML = `
      
        <img src="../app/assets/validLogo.png" class="stateLogo"
      
      <p>${message}</p>
      `;
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

async function initSend(invitedUsername, invitedUid) {
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

async function send() {
  const docRef = collection(db, "users");
  const q = query(docRef, where("wallet", "==", walletAdress));
  const qResult = await getDocs(q);

  if (qResult.size === 0) {
    showNotification("error", "Error : un-registered Adress.", 2500);
    setTimeout(() => {
      window.close();
    }, 3000);
  } else {
    qResult.forEach((doc) => {
      const uid = doc.data().uid;
      const username = doc.data().username;
      const path = document.getElementById("dynamicContent");
      path.innerHTML = `
    <h2>Comfirm send invite to ${username}.</h2>
    <button class="button" id="SendInvite">send invite</button>
    `;
      const buttonSend = document.getElementById("SendInvite");
      buttonSend.addEventListener("click", () => {
        buttonLoadingAnim(buttonSend);
        initSend(username, uid).then((result) => {
          if (result === "sent") {
            showNotification("valide", "Invitation sent successfully.", 2500);
            setTimeout(() => {
              window.close();
            }, 3000);
          } else if (result === "already exist") {
            showNotification("error", "Error : Session already Exist.", 2500);
            setTimeout(() => {
              window.close();
            }, 3000);
          } else {
            showNotification("error", "Server Error try later.", 2500);
            setTimeout(() => {
              window.close();
            }, 3000);
          }
        });
      });
    });
  }
}
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "testMessage") {
    console.log("Test message received");
  }
});
