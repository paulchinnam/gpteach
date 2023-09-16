"use client";
import React, { useEffect, useState } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import { getAuth } from "firebase/auth";

export default function Practice() {
  const router = useRouter();
  const deckId = router.query?.deckId;

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
      <ArrowLeftIcon
        class="h-6 w-6"
        onClick={() => router.push("/dashboard")}
      />
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
