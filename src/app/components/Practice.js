"use client";
import React, { useEffect, useState } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";
import { getAuth } from "firebase/auth";

export function Practice({ deckId }) {
  const [cards, setCards] = useState([]);
  const { getCards } = useDeckInterface();
  const { user } = getAuth();

  useEffect(() => {
    async function loadCards() {
      const tempCards = getCards(deckId);
      setCards(tempCards);
    }

    user && loadCards();
  });
  return (
    <>
      {cards.map((card) => {
        return (
          <div>
            <p>{card.prompt}</p>
          </div>
        );
      })}
    </>
  );
}
