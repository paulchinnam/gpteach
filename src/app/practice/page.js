"use client";
import React, { useEffect, useState } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Card } from "../components/Card";

import { getAuth } from "firebase/auth";
import dayjs from "dayjs";

export default function Practice() {
  const router = useRouter();
  const deckId = router.query?.deckId;

  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const { getCards } = useDeckInterface();
  const { user } = getAuth();

  useEffect(() => {
    async function loadCards() {
      const tempCards = getCards(deckId);
      let currentTime = dayjs(new Date());

      tempCards = tempCards.filter((card) => {
        let showNext = dayjs(card.showNext);
        if (!showNext) {
          return true;
        }
        return showNext <= currentTime;
      });

      tempCards = tempCards.map((card) => {
        return <Card cardId={card.id} deckId={deckId} />;
      });

      setCards(tempCards);
    }

    user && loadCards();
  });
  return (
    <>
      <ArrowLeftIcon
        class="h-6 w-6"
        onClick={() => router.push("/dashboard")}
      />
      {cards.length > 0 && cards[currentCard]}
    </>
  );
}
