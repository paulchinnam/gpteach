"use client";

import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useDeckInterface } from "../hooks/useDeckInterface";
import { useAuth } from "../hooks/useFirebase";

export default function AddCard() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text");
  const { createCard, getDecks } = useDeckInterface();
  const [decks, setDecks] = useState([]);
  const { user } = useAuth();
  const [response, setResponse] = useState([]);
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
      let tempResponse = [...response];
      tempResponse.shift();
      if (tempResponse.length == 0) {
        window.close();
      }
      setResponse(tempResponse);
    });
  }

  async function rejectCard() {
    if (decks.length == 0) {
      return;
    }
    let tempResponse = [...response];
    tempResponse.shift();
    if (tempResponse.length == 0) {
      window.close();
    }
    setResponse(tempResponse);
  }

  useEffect(() => {
    async function loadDecks() {
      const tempDecks = await getDecks();
      setDecks(tempDecks);
    }

    user && loadDecks();
  }, [user]);

  useEffect(() => {
    console.log("setting response");
    if (response.length == 0) {
      console.log("nvm");
      return;
    }
    console.log("frfr", response);
    setPrompt(response[0].prompt);
    setAnswer(response[0].answer);
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
Return an array of 1+ JSON objects that might be useful for the front and back of flash cards. Extract facts and information and arrange them in helpful ways so that the front of the card has either a question or term and the back has either an answer to the question, or a definition for the term. label the front and back as prompt and answer respectfully. 
If a single word or term has been inputted, make that word the prompt value, and its definition (provided by you) the answer value.
If a paragraph has been entered, make sure to create cards that do not overlap facts within each other.
If a large paragraph has been entered, you must use discretion to determine what information is beyond the scope of the flashcards.
Do not create duplicate cards.
You must filter the prompt and answer to remove any unnecessary details and descriptors that would not provide any extra understanding in a flashcard setting.
If no answer is found for a given prompt, auto generate using chatgpt.
Do not create randomly generated json objects.
If the input is not in English, and you can provide a translation, store the input as the prompt and the English translation as the answer.
If the input is not in English, and you can use the input word in an example sentence, store an additional card in the JSON array with an example sentence as the prompt and the translation as the answer.
Do not create json objects that start with '{ "prompt":' and do not end with anything. Every json object should be complete and relevant to the given input.
Try to format all cards that aren't term/definition pairs as question/answer pairs. 
You must return JSON objects stored in an array.
The array you return MUST have both opening and closing brackets.
The JSON objects within the array you return MUST have opening and closing curly brackets.
The prompt and answer values within the JSON objects you return MUST be wrapped within BOTH opening AND closing quotes. They also MUST be separated by a comma.

Here are some example inputs and outputs:

INPUT: Kevin was born in 1962 in Salem, MA.
OUTPUT: [{prompt: "What year was Kevin born?", answer: "1962"}, {prompt: "Where was Kevin born?", answer: "Salem, MA"}]

INPUT: chewgy
OUTPUT: [{prompt: "chewgy", answer: "Outdated style, typically of millennials"}]

INPUT: casa
OUTPUT: [{prompt: "casa", answer: "house"}, {prompt: "me gusta tu casa", answer: "I like your house"}]

INPUT: Pong is a table tennis–themed twitch arcade sports video game
OUTPUT: [{prompt:"What is Pong?", answer:"A table tennis themed arcade game"}]

INPUT: Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games.
OUTPUT: [{prompt: "What 2013 action-adventure game was developed by Rockstar?", answer: "Grand Theft Auto V"}]

INPUT: Earl Rudolph "Bud" Powell (September 27, 1924 – July 31, 1966)[1] was an American jazz pianist and composer. Along with Charlie Parker, Thelonious Monk, Kenny Clarke and Dizzy Gillespie, Powell was a leading figure in the development of modern jazz. His virtuosity led many to call him the Charlie Parker of the piano.[2] Powell was also a composer, and many jazz critics credit his works and his playing as having "greatly extended the range of jazz harmony".[3]
OUTPUT: [{prompt: "Who was Earl Bud Powell?", answer: "an American jazz pianist and composer"}, {prompt: "Which jazz pianist, alongside Charlie Parker, Thelonious Monk, Kenny Clark, and Dizzy Gillespie, was a leading figure in the development of modern jazz?", answer: "Charlie Parker"}]

INPUT: Subaru started off as Fuji Heavy Industries. Fuji Heavy Industries led to the rise of Subaru.
OUTPUT: [{prompt: "What company started off as Fuji Heavy Industries?", answer: "Subaru"}]`,
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

        let assistantMessage = apiResponse.choices[0].message.content;
        const parsed = JSON.parse(assistantMessage);
        console.log(assistantMessage);
        console.log(parsed);
        setResponse(parsed);
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
      <button
        type="button"
        onClick={() => rejectCard()}
        className="mt-6 w-full justify-center inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <XCircleIcon
          className="-ml-0.5 mr-1.5 h-5 w-5 text-red-600"
          aria-hidden="true"
        />
        Reject flashcard
      </button>
      {/* <CheckCircleIcon class="h-6 w-6" onClick={() => verifyCard()} /> */}
    </div>
  );
}
