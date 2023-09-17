"use client";
import React, { useEffect, useState } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { Card } from "../components/Card";
import dayjs from "dayjs";
import { useAuth } from "../hooks/useFirebase";

export default function Practice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get("deckId");
  const [showIcons, setShowIcons] = useState(false);
  const [cards, setCards] = useState([]);
  const { getCards } = useDeckInterface();
  const { user } = useAuth();

  function markCorrect() {
    const tempCards = [...cards];
    tempCards.shift();
    setCards(tempCards);
    console.log(tempCards);
    console.log(cards);
  }

  function markIncorrect() {
    const tempCards = [...cards];
    tempCards.push(tempCards[0]);
    tempCards.shift();
    setCards(tempCards);
  }

  useEffect(() => {
    console.log("useeffect practice page");
    async function loadCards() {
      console.log("loading cards");
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
        return { cardId: card.id };
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
      {cards.length > 0 ? (
        <Card
          key={cards[0].cardId}
          setShowIcons={setShowIcons}
          cardId={cards[0].cardId}
          deckId={deckId}
        />
      ) : (
        <p>You finished all your reviews in this deck! Nice work!</p>
      )}
      {showIcons && (
        <>
          <CheckCircleIcon
            color="green"
            class="h-12 w-12"
            onClick={() => markCorrect()}
          />

          <MinusCircleIcon color="orange" class="h-12 w-12" />

          <XCircleIcon
            color="red"
            class="h-12 w-12"
            onClick={() => markIncorrect()}
          />
        </>
      )}
    </>
  );
}
