"use client";
import React, { useEffect, useState } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";

export function Card({ cardId, deckId }) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const { getCard } = useDeckInterface();

  useEffect(() => {
    console.log("rendering card");
    async function loadCardData() {
      const card = await getCard({ deckId, cardId });
      console.log(card);
      setPrompt(card.prompt);
      setAnswer(card.answer);
    }

    loadCardData();
  }, []);
  return (
    <div onClick={() => setShowAnswer(!showAnswer)}>
      {showAnswer ? <p>{answer}</p> : <p>{prompt}</p>}
    </div>
  );
}
