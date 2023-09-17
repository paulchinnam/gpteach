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
  const [deckName, setDeckName] = useState("");
  const {
    getCards,
    calculateInterval,
    getDeck,
    updateCardMetrics,
    calculateEase,
  } = useDeckInterface();
  const { user } = useAuth();

  useEffect(() => {
    async function loadName() {
      const tempDeck = await getDeck({ deckId });
      setDeckName(tempDeck.name);
    }

    loadName();
  }, []);
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
      <div className="h-screen">
        <div className="flex items-center px-10 pt-16 pb-24">
          <button
            className="flex items-center gap-2 absolute"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeftIcon class="h-6 w-6 text-indigo-600" />
            <p className="text-indigo-900">Back to dashboard</p>
          </button>
          <h1 className="text-3xl w-full text-center capitalize">
            {deckName} deck
          </h1>
        </div>
        <div className="flex justify-center">
          {cards.length > 0 ? (
            <Card
              key={cards[0].cardId}
              setShowIcons={setShowIcons}
              cardId={cards[0].cardId}
              deckId={deckId}
            />
          ) : (
            <div className="">
              <p className="px-4 py-2 bg-green-100 border border-green-600 text-green-600 rounded-md mt-20">
                You finished all your reviews in this deck! Nice work!
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-10 gap-10">
          {cards.length > 0 && showIcons && (
            <>
              {
                <div className="text-center space-y-2">
                  {cards[0].incorrect ? (
                    1
                  ) : (
                    <p>
                      {calculateInterval(
                        cards[0].correctStreak + 1,
                        calculateEase(cards[0].ease, 5)
                      )}{" "}
                      days
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => markCorrect()}
                    className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <CheckCircleIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Easy!
                  </button>
                </div>
              }
              {cards[0].incorrect == false && (
                <div className="text-center space-y-2">
                  <p>
                    {calculateInterval(
                      cards[0].correctStreak + 1,
                      calculateEase(cards[0].ease, 3)
                    )}{" "}
                    days
                  </p>
                  <button
                    type="button"
                    onClick={() => markOkay()}
                    className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-600 duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <MinusCircleIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Okay
                  </button>
                </div>
              )}
              {
                <div className="text-center space-y-2">
                  <p>1 day</p>
                  <button
                    type="button"
                    onClick={() => markIncorrect()}
                    className="inline-flex items-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <XCircleIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Wrong
                  </button>
                </div>
              }
            </>
          )}
        </div>
      </div>
    </>
  );
}
