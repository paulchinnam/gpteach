"use client";

import { useState, useEffect, useDeferredValue } from "react";
import { useDeckInterface } from "../hooks/useDeckInterface";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useFirebase";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

export default function Dashboard() {
  const { getCards, getDecks, createDeck } = useDeckInterface();
  const [decks, setDecks] = useState([]);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("useeffect dash");
    async function loadDecks() {
      const tempDecks = await getDecks();
      setDecks(tempDecks);
    }

    user && loadDecks();
  }, [user]);

  function createNewDeck(e) {
    e.preventDefault();
    createDeck({ name: newDeckName });
    setNewDeckName("");
    setShowCreateDeck(false);
  }

  return (
    <main className="flex justify-center p-20">
      <div>
        <label className="sr-only">URL</label>
        <input
          type="url"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="enter a url"
        />
      </div>

      {decks.map((deck) => {
        return (
          <div
            key={deck.id}
            onClick={() => router.push(`/practice/?deckId=${deck.id}`)}
          >
            <p>{deck.name}</p>
          </div>
        );
      })}
      <PlusCircleIcon class="h-6 w-6" onClick={() => setShowCreateDeck(true)} />
      {showCreateDeck && (
        <form>
          <input
            placeholder="Deck Name"
            type="string"
            id="name"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
          ></input>
          <button onClick={(e) => createNewDeck(e)}>Create New Deck</button>
        </form>
      )}
    </main>
  );
}
