"use client";
import React, { useEffect, useState } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Card } from "../components/Card";
import dayjs from "dayjs";
import { useAuth } from "../hooks/useFirebase";

export default function Practice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const { getCards } = useDeckInterface();
  const { user } = useAuth();

  useEffect(() => {
    console.log("useeffect practice page");
    async function loadCards() {
      let tempCards = await getCards({ deckId });
      let currentTime = dayjs(new Date());

      /*tempCards = tempCards.filter((card) => {
        let showNext = dayjs(card.showNext);
        if (!showNext) {
          return true;
        }

        return showNext <= currentTime;
      });*/

      tempCards = tempCards.map((card) => {
        return <Card cardId={card.id} deckId={deckId} />;
      });
      setCards(tempCards);
    }
    console.log("HERE");
    user && loadCards();
  }, [user]);
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
