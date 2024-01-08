const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "heist.supervisor@gmail.com",
    pass: "sgoe zqqa bztz dggm",
  },
});

admin.initializeApp();

/**
 * send email with received data
 * @param {Object} data
 * @return {Promise<Object>}
 */
async function sendMail(data) {
  const bid = data.bid;
  const topBid = data.topBid;
  const token = data.token;
  const remainTime = data.remainTime;
  const username = data.username;
  const userMail = data.userMail;
  const mailOptions = {
    from: "heist.supervisor@gmail.com",
    to: userMail,
    subject: "Track Auction",
    text: `Hey ${username} !
    We have a bad news...
    You got outbided on you auction.
    New bid is now : ${bid}   $${token}.
    Top bidder is now : ${topBid}
    Remaining time : ${remainTime} `,
  };

  return mailTransport
      .sendMail(mailOptions)
      .then(() => {
        return {success: true};
      })
      .catch((error) => {
        console.error("cant send email", error);
        return {error: error};
      });
}
/**
 * Retrieve auction data from the provided URL.
 * @param {string} url - The URL to fetch auction data from.
 * @return {Promise<object>} A promise that resolves to the auction data object.
 */
async function getAuctionData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
/**
 * Échappe les caractères spéciaux dans une chaîne pour
 * @param {string} unsafe - La chaîne à échapper.
 * @return {string} La chaîne échappée.
 */
function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
}
/**
 * Vérifie si un message est valide en s'assurant qu'il ne
 * contient que des caractères autorisés.
 * @param {string} msg - Le message à vérifier.
 * @return {boolean} Vrai si le message est valide, faux sinon.
 */
function isValidMessage(msg) {
  return /^[a-zA-Z0-9\s.,'!?éè]*$/u.test(msg);
}
/**
 * add timestamp
 * @param {string} timeStamp
 * @return {string} cleaned timestamp
 */
function cleanTimeStamp(timeStamp) {
  const receivedTimeStamp = new Date(timeStamp);
  const now = new Date();
  if (receivedTimeStamp < now) {
    const diff = receivedTimeStamp - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Time remaining : ${days} day. ${hours}:${minutes}h`;
  } else return "past";
}
exports.sendInvitation = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }
  const message = escapeHtml(data.message);
  if (
    !message ||
    typeof message !== "string" ||
    message.length > 100 ||
    !isValidMessage(message)
  ) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Message invalide.",
    );
  }
  const sessionId = context.auth.uid + data.uid2;
  const query = admin
      .firestore()
      .collection("privateMessage")
      .where("sessionUid", "==", sessionId)
      .limit(1);
  return query.get().then((snapshot) => {
    if (snapshot.empty === true) {
      return admin
          .firestore()
          .collection("privateMessage")
          .add({
            sessionUid: sessionId,
            sendBy: context.auth.uid,
            sendTo: data.uid2,
            player1: data.player1,
            player2: data.player2,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            accepted: false,
          })
          .then((result) => {
            functions.logger.log("invitation sent!!");
            console.log("new session created !");
            return {status: "sent"};
          })
          .catch((error) => {
            throw new functions.https.HttpsError("unknown", error.message);
          });
    } else {
      console.log("session already exist!!!");
      return {status: "already exist"};
    }
  });
});

exports.acceptInvitation = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }
  const session = data.sessionId;
  const doc = admin.firestore().collection("privateMessage").doc(session);
  return doc
      .update({
        accepted: true,
      })
      .then((result) => {
        console.log("good");
        return {status: "accepted"};
      })
      .catch((error) => {
        return {status: error};
      });
});

exports.sendMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }
  let displayName;
  const message = escapeHtml(data.message);
  const session = data.sessionId;
  const userId = context.auth.uid;
  try {
    const userRecord = await admin.auth().getUser(userId);
    displayName = userRecord.displayName;
  } catch (error) {
    return {status: "Error : unable to get DisplayName"};
  }
  const docRef = admin
      .firestore()
      .collection("privateMessage")
      .doc(session)
      .collection("chat");
  return docRef
      .add({
        text: message,
        player: displayName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      .then((result) => {
        return {status: "Successfully Send Message"};
      })
      .catch((error) => {
        return {status: error};
      });
});

exports.scheduledSendEmail = functions.pubsub
    .schedule("every 10 minutes")
    .onRun(async (context) => {
      const document = [];
      const storedData = {}; // store data for each auction
      const urls = new Set(); // store all auction urls once
      // get all doc of user tracking true ↓↓
      try {
        const querySnap = await admin
            .firestore()
            .collectionGroup("AuctionTrack")
            .where("track", "==", true)
            .get();
        querySnap.forEach((doc) => {
          const url = doc.data().auctionUrl;
          if (url) {
            urls.add(url);
            document.push({data: doc.data(), docId: doc.id});
          }
        });
      } catch (error) {
        console.error("error while retrieving firestore :" + error);
      }
      // get data from api ↓↓
      for (const urlQuerry of urls) {
        try {
          console.log(urlQuerry);
          const auctionData = await getAuctionData(urlQuerry);
          for (const elem of auctionData) {
            const id = elem.plotId;
            storedData[id] = elem;
          }
        } catch (error) {
          console.error("unable to retrieve data from api : " + error);
        }
      }
      // make user tracked auction match with data and send mail ↓↓
      try {
        for (const elem of document) {
          const auctionId = elem.data.plotId;
          const winningWallet = storedData[auctionId].highestBid.walletId;
          // if userwallet is == winning auction wallet then register in db
          if (elem.data.userWallet === winningWallet) {
            const docRef = admin
                .firestore()
                .collectionGroup("AuctionTrack")
                .doc(elem.docId);
            docRef.update({isWinning: true});
          }
          // if user isWinning : true (in db)
          // check if userWallet == winning auction wallet
          // if not then send a mail cause he got outBided
          if (
            elem.data.isWinning === true &&
          elem.data.userWallet != winningWallet
          ) {
            const bidAmount = storedData[auctionId].highestBid.amount;
            const remainTime = cleanTimeStamp(
                storedData[auctionId].postponedEndDate,
            );
            const tokenType = storedData[auctionId].tokenType;
            const mailData = {
              token: tokenType,
              remainTime: remainTime,
              topBid: winningWallet,
              bid: bidAmount,
              username: elem.data.username,
              userMail: elem.data.userMail,
            };
            sendMail(mailData);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

exports.registerTrack = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }
  const plotId = data.plotId;
  const auctionURL = data.auctionURL;
  const userId = context.auth.uid;
  const userMail = context.auth.token.email;
  const userWallet = data.userWallet;

  const docRef = admin.firestore().collection("vip").doc(userId);
  try {
    const userRecord = await admin.auth().getUser(userId);
    const username = userRecord.displayName;
    const snap = await docRef.get();
    if (snap.exists) {
      const subToTrack = docRef.collection("AuctionTrack").doc();
      const newData = {
        auctionUrl: auctionURL,
        userWallet: userWallet,
        username: username,
        userMail: userMail,
        track: true,
        isWinning: false,
        plotId: plotId,
      };
      await subToTrack.set(newData);
      return {success: true};
    } else return {vip: false};
  } catch (error) {
    console.error(error);
    return "error";
  }
});
