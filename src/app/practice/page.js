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
  const { getCards, calculateInterval, updateCardMetrics, calculateEase } =
    useDeckInterface();
  const { user } = useAuth();

  async function markCorrect() {
    let q = cards[0]?.incorrect ? 0 : 5;
    await updateCardMetrics({
      deckId,
      cardId: cards[0].cardId,
      q,
      correctStreak: cards[0].correctStreak,
      ease: cards[0].ease,
    }).then(() => {
      const tempCards = [...cards];
      tempCards.shift();
      setCards(tempCards);
    });
  }

  async function markOkay() {
    console.log("mark okay");
    console.log(cards[0].cardId);
    let q = cards[0]?.incorrect ? 0 : 3;
    await updateCardMetrics({
      deckId,
      cardId: cards[0].cardId,
      q,
      correctStreak: cards[0].correctStreak,
      ease: cards[0].ease,
    }).then(() => {
      const tempCards = [...cards];
      tempCards.shift();
      setCards(tempCards);
    });
  }

  function markIncorrect() {
    const tempCards = [...cards];
    tempCards[0].incorrect = true;
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
        return {
          cardId: card.id,
          correctStreak: card.correctStreak,
          ease: card.ease,
          incorrect: false,
        };
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
        <p class="">You finished all your reviews in this deck! Nice work!</p>
      )}
      {cards.length > 0 && showIcons && (
        <>
          {
            <div>
              <CheckCircleIcon
                color="green"
                class="h-12 w-12"
                onClick={() => markCorrect()}
              />
              {cards[0].incorrect ? (
                1
              ) : (
                <p>
                  {calculateInterval(
                    cards[0].correctStreak + 1,
                    calculateEase(cards[0].ease, 5)
                  )}
                </p>
              )}
            </div>
          }
          {cards[0].incorrect == false && (
            <div>
              <MinusCircleIcon
                color="orange"
                class="h-12 w-12"
                onClick={() => markOkay()}
              />
              <p>
                {calculateInterval(
                  cards[0].correctStreak + 1,
                  calculateEase(cards[0].ease, 3)
                )}
              </p>
            </div>
          )}
          {cards[0].incorrect == false && (
            <div>
              <XCircleIcon
                color="red"
                class="h-12 w-12"
                onClick={() => markIncorrect()}
              />
              <p>1</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
