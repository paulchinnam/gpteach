const { getFirestore } = require("firebase-admin/firestore");

module.exports = async function createCardFromExtension(request) {
  const db = getFirestore();

  const { prompt, answer } = request.body;
  let { deckId } = request.body;
  const uid = request.auth.uid;

  if (!deckId) {
    const decksCollection = db.collection("decks");
    const q = decksCollection
      .where("uid", "==", uid)
      .where("isDefault", "==", true);
    const querySnap = await q.get();

    if (!querySnap.empty) {
      deckId = querySnap.docs[0].id;
    } else {
      throw new Error("No default deck has been initialized.");
    }
  }

  const cardsCollectionRef = db
    .collection("decks")
    .doc(deckId)
    .collection("cards");

  const cardToAdd = {
    prompt,
    answer,
    tags: [],
  };

  await cardsCollectionRef.add(cardToAdd);
  return cardToAdd;
};
