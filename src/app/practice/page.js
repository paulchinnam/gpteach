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
import DeckTracker from "../components/DeckTracker";

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
      <div className="h-screen bg-blue-400">
        <div className="flex items-center p-4">
          <div className="w-1/3">
            <button
              className="flex items-center gap-2 text-blue-100 hover:text-blue-900 duration-100"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeftIcon class="h-6 w-6" />
              <p className="">Back to dashboard</p>
            </button>
          </div>
          <div className="w-1/3"></div>
          <div className="w-1/3 text-right">
            <p className="capitalize text-white font-semibold">
              {deckName} deck
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-28">
          <div className="flex flex-col items-center gap-16">
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
            <div>
              <DeckTracker deckLength={cards.length} />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10 gap-10">
          {cards.length > 0 && showIcons && (
            <>
              <div className="shadow-lg">
                <button className="bg-red-500/80 px-4 py-2 rounded-l-md text-white text-sm hover:bg-red-500 duration-100 hover:duration-100">
                  <div className="flex items-center">
                    <XCircleIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    <p>Wrong</p>
                  </div>
                </button>
                <button className="bg-yellow-500/80 px-4 py-2 text-white text-sm hover:bg-yellow-500 duration-100 hover:duration-100">
                  <div className="flex items-center">
                    <MinusCircleIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    <p>OK</p>
                  </div>
                </button>
                <button className="bg-green-600/80 px-4 py-2 rounded-r-md text-white text-sm hover:bg-green-600 duration-100 hover:duration-100">
                  <div className="flex items-center">
                    <CheckCircleIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    <p>Correct</p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
