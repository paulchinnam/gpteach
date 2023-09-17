const { getFirestore } = require("firebase-admin/firestore");

module.exports = async (user) => {
  const { uid } = user;
  const db = getFirestore();

  const decksCollectionRef = db.collection("decks");
  const docToAdd = {
    name: "default",
    isDefault: true,
    uid,
  };
  await decksCollectionRef.add(docToAdd);
  return docToAdd;
};
