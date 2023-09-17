"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDeckInterface } from "../hooks/useDeckInterface";

export function Card({ cardId, deckId }) {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const { getCard } = useDeckInterface();

  useEffect(() => {
    async function loadCardData() {
      const card = await getCard({ deckId, cardId });
      setPrompt(card.prompt);
      setAnswer(card.answer);
    }
    loadCardData();
  }, []);

  const flipVariants = {
    prompt: { rotateY: 0 },
    answer: { rotateY: 180 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <motion.div
        onClick={() => setShowAnswer(!showAnswer)}
        className="relative w-64 h-48 mx-auto"
        initial="prompt"
        animate={showAnswer ? "answer" : "prompt"}
        transition={{ duration: 0.5 }}
      >
        {/* Front of the card (with the prompt) */}
        <motion.div
          variants={{
            prompt: { opacity: 1, rotateY: 0 },
            answer: { opacity: 0, rotateY: -180 },
          }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2 bg-white rounded-md shadow-lg text-center text-xl"
        >
          {prompt}
        </motion.div>

        {/* Back of the card (with the answer) */}
        <motion.div
          variants={{
            prompt: { opacity: 0, rotateY: 180 },
            answer: { opacity: 1, rotateY: 0 },
          }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2 bg-white rounded-md shadow-lg text-center text-xl"
        >
          {/* Unmirror the content */}
          <div className="transform rotate-y-180">{answer}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
