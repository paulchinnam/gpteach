import React from "react";
import { useAuth, useFirestore } from "./useFirebase";
import {
  Query,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";

export function useDeckInterface() {
  const db = useFirestore();
  const { user } = useAuth();

  async function createDeck({ name }) {
    const decksCollectionRef = collection(db, "decks");
    return await addDoc(decksCollectionRef, { name, uid: user.uid });
  }

  async function deleteDeck({ deckId }) {
    const deckRef = doc(db, "decks", deckId);
    return await deleteDoc(deckRef);
  }

  async function createCard({ deckId, prompt, answer, tags }) {
    const cardsCollectionRef = collection(db, "decks", deckId, "cards");
    return await addDoc(cardsCollectionRef, {
      prompt,
      answer,
      tags,
      lastShown: null,
      showNext: new Date(),
    });
  }

  async function deleteCard({ deckId, cardId }) {
    const cardRef = doc(db, "decks", deckId, "cards", cardId);
    return await deleteDoc(cardRef);
  }

  async function getCards({ deckId }) {
    const cardsCollectionSnap = await collection(
      db,
      "decks",
      deckId,
      "cards"
    ).get();
    return cardsCollectionSnap.map((card) => {
      return card.data();
    });
  }

  async function getDecks() {
    console.log(db);
    const q = query(collection(db, "decks"), where("uid", "==", user.uid));
    const decksSnap = await getDocs(q);
    return decksSnap.docs.map((deck) => {
      return {
        id: deck.id,
        ...deck.data(),
      };
    });
  }

  async function updateCard({
    deckId,
    cardId,
    prompt,
    answer,
    tags,
    lastShown,
    showNext,
  }) {
    const cardRef = doc(db, "decks", deckId, "cards", cardId);
    const cardToUpdate = {};

    if (prompt) cardToUpdate.prompt = prompt;
    if (answer) cardToUpdate.answer = answer;
    if (tags) cardToUpdate.tags = tags;
    if (lastShown) cardToUpdate.lastShown = lastShown;
    if (showNext) cardToUpdate.showNext = showNext;

    return await setDoc(cardRef, cardToUpdate, { merge: true });
  }

  return {
    createCard,
    deleteCard,
    updateCard,
    createDeck,
    deleteDeck,
    getCards,
    getDecks,
  };
}
