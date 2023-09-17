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
  getDoc,
} from "firebase/firestore";

export function useDeckInterface() {
  const db = useFirestore();
  const { user } = useAuth();

  async function createDeck({ name }) {
    try {
      const decksCollectionRef = collection(db, "decks");
      return await addDoc(decksCollectionRef, { name, uid: user.uid });
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteDeck({ deckId }) {
    const deckRef = doc(db, "decks", deckId);
    return await deleteDoc(deckRef);
  }

  async function createCard({ deckId, prompt, answer, tags }) {
    if (!deckId) {
      const q = query(
        collection(db, "decks"),
        where("uid", "==", user.uid),
        where("isDefault", "==", true)
      );
      const defaultDecksSnap = await getDocs(q);
      const deckData = defaultDecksSnap.docs[0];
      deckId = deckData.id;
    }
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
    try {
      console.log(deckId);
      const cardsCollectionRef = collection(db, "decks", deckId, "cards");
      const cardsCollectionSnap = await getDocs(cardsCollectionRef);
      return cardsCollectionSnap.docs.map((card) => {
        return {
          id: card.id,
          ...card.data(),
        };
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function getCard({ deckId, cardId }) {
    const cardRef = doc(db, "decks", deckId, "cards", cardId);
    const cardSnap = await getDoc(cardRef);
    return cardSnap.data();
  }

  async function getDecks() {
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
    getCard,
    getDecks,
  };
}
