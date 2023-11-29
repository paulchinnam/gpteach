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
        <div className="card-front bg-white w-full h-full absolute flex justify-center items-center rounded-2xl p-10 text-center shadow-xl">
          <div className="absolute top-6 right-6 text-gray-400 flex items-center gap-2">
            <p>Click to flip</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <p className="text-2xl text-center text-gray-900">{prompt}</p>
        </div>
        <div className="card-back bg-white w-full h-full absolute flex items-center justify-center rounded-2xl p-10 text-center shadow-xl">
          <div className="absolute top-6 right-6 text-gray-400 flex items-center gap-2">
            <p>Click to flip</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <p className="text-2xl text-gray-900">{answer}</p>
        </div>
      </div>
    </div>
  );
}
