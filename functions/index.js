const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
/**
 * Échappe les caractères spéciaux dans une chaîne pour
 * prévenir des attaques XSS.
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
exports.sendInvitation = functions.https.onCall((data, context) => {
  // Vérifier si l'utilisateur est authentifié
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }
  const message = escapeHtml(data.message);
  if (
    !message ||
    typeof message !== "string" ||
        message.length >100 ||
        !isValidMessage(message)
  ) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Message invalide.",
    );
  }
  const sessionId = context.auth.uid + data.uid2;
  const query = admin.firestore().collection("privateMessage")
      .where("sessionUid", "==", sessionId)
      .limit(1);
  return query.get()
      .then((snapshot) => {
        if (snapshot.empty === true) {
          return admin.firestore().collection("privateMessage").add({
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
  // Sauvegarder le message dans Firestore
});

exports.acceptInvitation = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }
  const session = data.sessionId;
  const doc = admin.firestore().collection("privateMessage").doc(session);
  return doc.update({
    accepted: true,
  })
      .then((result)=>{
        console.log("good");
        return {status: "accepted !"};
      })
      .catch((error)=>{
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
  const docRef = admin.firestore()
      .collection("privateMessage")
      .doc(session)
      .collection("chat");
  return docRef.add({
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
