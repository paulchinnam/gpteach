"use client";

import { useEffect, useState } from "react";
import OpenAI from "openai";
import { useSearchParams } from "next/navigation";

const AddCard = () => {
  const searchParams = useSearchParams();
  const text = searchParams.get("text");

  const [response, setResponse] = useState(null);
  console.log(text);

  useEffect(() => {
    if (!text) return;

    const fetchOpenAIResponse = async () => {
      if (!text || typeof text !== "string" || text.trim() === "") {
        console.error("Text content is missing or invalid.");
        return;
      }

      console.log("Text from URL:", text);

      const openai = new OpenAI({
        apiKey: "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",
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
Do not create duplicate cards.
Make sure all cards have complete sentences for answers.
Every prompt must have an answer.
If no answer is found for a given prompt, auto generate using chatgpt.
Do not create randomly generated json objects.
Do not create json objects that start with '{ "prompt":' and do not end with anything. Every json object should be complete and relevant to the given input.
Try to make prompts into questions and an answer is an answer. Try to frame the sentences in the prompt to be 

Here are some example inputs and outputs:

INPUT: Kevin was born in 1962 in Salem, MA.
OUTPUT: {prompt: "Kevin's birth year", answer: "1962"}

INPUT: chewgy
OUTPUT: {prompt: "chewgy", answer: "Outdated style, typically of millennials"}

INPUT: casa
OUTPUT: {prompt: "casa", answer: "Spanish for house"}

INPUT: Subaru started off as Fuji Heavy Industries. Fuji Heavy Industries led to the rise of Subaru.
OUTPUT: {prompt: "Subaru", answer: "Started as Fuji Heavy Industries"}`,
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
    <div>
      <h1>OpenAI Response:</h1>
      <p>Front: {response?.prompt}</p>
      <p>Back: {response?.answer}</p>
    </div>
  );
};

export default AddCard;
