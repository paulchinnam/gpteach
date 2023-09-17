"use client";
import React, { useEffect, useState } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";

export function Card({ cardId, deckId }) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const { getCard } = useDeckInterface();

  useEffect(() => {
    async function loadCardData() {
      const card = getCard({ deckId, cardId });
      setPrompt(card?.prompt);
      setAnswer(card?.amswer);
    }
  }, []);
  return (
    <div onClick={() => setShowAnswer(true)}>
      {showAnswer ? <p>{prompt}</p> : <p>{answer}</p>}
    </div>
  );
}
