"use client";

import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useDeckInterface } from "../hooks/useDeckInterface";
import { useAuth } from "../hooks/useFirebase";

export default function AddCard() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text");
  const { createCard, getDecks } = useDeckInterface();
  const [decks, setDecks] = useState([]);
  const { user } = useAuth();
  const [response, setResponse] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentDeck, setCurrentDeck] = useState(0);
  console.log(text);

  async function verifyCard() {
    //TODO DECK CONFIGURATION
    if (decks.length == 0) {
      return;
    }
    let deckId = decks[currentDeck]?.id;
    await createCard({ deckId, prompt, answer, tags: [] }).then(() => {
      window.close();
    });
  }

  useEffect(() => {
    async function loadDecks() {
      const tempDecks = await getDecks();
      setDecks(tempDecks);
    }

    user && loadDecks();
  }, [user]);

  useEffect(() => {
    setPrompt(response?.prompt);
    setAnswer(response?.answer);
  }, [response]);

  useEffect(() => {
    if (!text) return;

    const fetchOpenAIResponse = async () => {
      if (!text || typeof text !== "string" || text.trim() === "") {
        console.error("Text content is missing or invalid.");
        return;
      }

      console.log("Text from URL:", text);

      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      try {
        const apiResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `The goal of this project is to create educational and informational flashcards that help the user learn about any given text.
Return JSON objects that might be useful for the front and back of flash cards. Extract facts and information and arrange them in helpful ways so that the front of the card has a topic and the back has a fact about it. label the front and back as prompt and answer respectfully. 
If a single word has been inputted, auto generate a answer for the answer section and the prompt is the word inputted. 
If a paragraph has been entered, make sure to create cards that do not overlap facts within each other.
If a large paragraph has been entered, you must use discretion to determine what information is beyond the scope of the flashcards.
Do not create duplicate cards.
Every prompt and answer pair must be in the form of either a question and answer or a term and definition.
You must filter the prompt and answer to remove any unnecessary details and descriptors that would not provide any extra understanding in a flashcard setting.
If no answer is found for a given prompt, auto generate using chatgpt.
Do not create randomly generated json objects.
Do not create json objects that start with '{ "prompt":' and do not end with anything. Every json object should be complete and relevant to the given input.
Try to make prompts into questions and an answer is an answer. Try to frame the sentences in the prompt to be 

Here are some example inputs and outputs:

INPUT: Kevin was born in 1962 in Salem, MA.
OUTPUT: {prompt: "What year was Kevin born?", answer: "1962"}

INPUT: chewgy
OUTPUT: {prompt: "chewgy", answer: "Outdated style, typically of millennials"}

INPUT: casa
OUTPUT: {prompt: "casa", answer: "Spanish for house"}

INPUT: Pong is a table tennis–themed twitch arcade sports video game
OUTPUT: {prompt:"What is Pong", answer:"A table tennis themed arcade game"}

INPUT: Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games.
OUTPUT: {prompt: "What 2013 action-adventure game was developed by Rockstar?", answer: "Grand Theft Auto V"}

INPUT: Subaru started off as Fuji Heavy Industries. Fuji Heavy Industries led to the rise of Subaru.
OUTPUT: {prompt: "What company started off as Fuji Heavy Industries?", answer: "Subaru"}`,
            },
            {
              role: "user",
              content: text,
            },
          ],
          temperature: 0,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        const assistantMessage = apiResponse.choices[0].message;

        if (assistantMessage && assistantMessage.content) {
          setResponse(JSON.parse(assistantMessage.content));
        }

        console.log(response);
      } catch (error) {
        console.error("Error fetching OpenAI response:", error);
      }
    };

    fetchOpenAIResponse();
  }, [text]);

  return (
    <div className="m-10">
      <h1 className="pb-8 text-center text-indigo-600 font-semibold text-xl">
        Create a flashcard
      </h1>
      <div className="space-y-2">
        <p>
          <span className="text-indigo-900 font-semibold">Question:</span>{" "}
          {prompt}
        </p>
        <p className="pb-6">
          <span className="text-indigo-900 font-semibold">Answer:</span>{" "}
          {answer}
        </p>
      </div>
      {decks.length > 0 && (
        <form>
          <label
            htmlFor="location"
            className="block text-sm font-medium leading-6 text-indigo-900"
          >
            Choose a deck to add this flashcard to
          </label>
          <select
            defaultValue={currentDeck}
            onChange={(e) => setCurrentDeck(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {decks.map((deck, i) => {
              return (
                <option key={i} value={i}>
                  {deck.name}
                </option>
              );
            })}
          </select>
        </form>
      )}
      <button
        type="button"
        onClick={() => verifyCard()}
        className="mt-6 w-full justify-center inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <CheckCircleIcon
          className="-ml-0.5 mr-1.5 h-5 w-5 text-green-500"
          aria-hidden="true"
        />
        Create flashcard
      </button>
      {/* <CheckCircleIcon class="h-6 w-6" onClick={() => verifyCard()} /> */}
    </div>
  );
}
