const functions = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { onCall } = require("firebase-functions/v2/https");

initializeApp();

exports.createDefaultDeck = functions
  .runWith({
    timeoutSeconds: 30,
    memory: "128MB",
  })
  .auth.user()
  .onCreate(require("./createDefaultDeck"));

exports.createCardFromExtension = onCall(
  {
    timeoutSeconds: 30,
    memory: "128MB",
  },
  require("./createCardFromExtension")
);
