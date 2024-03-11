window.heistSupervisor = window.heistSupervisor || {};
window.heistSupervisor.getData = function () {
  const uid = localStorage.getItem("uid");
  const hash = localStorage.getItem("hash");
  const publicAdress = localStorage.getItem("publicAdress");
  const userData = { uid: uid, hash: hash, publicAdress: publicAdress };
  console.log(userData);
  window.postMessage({ type: "firebaseUserData", userData: userData }, "*");
};
