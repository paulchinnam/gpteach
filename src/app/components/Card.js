"use client";
import React, { useEffect, useState } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";

export function Card({ cardId, deckId, setShowIcons }) {
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

  useEffect(() => {
    setShowIcons(showAnswer);
  }, [showAnswer]);

  return (
    <div className="card-container" onClick={() => setShowAnswer(!showAnswer)}>
      <div className={`card ${showAnswer ? "card-flip" : ""}`}>
        <div className="card-front bg-indigo-900 w-full h-full absolute flex justify-center items-center rounded-lg p-10 text-center">
          <p className="text-xl text-center text-white">{prompt}</p>
        </div>
        <div className="card-back bg-indigo-900 w-full h-full absolute flex items-center justify-center rounded-lg p-10 text-center">
          <p className="text-xl text-white">{answer}</p>
        </div>
      </div>
    </div>
  );
}
