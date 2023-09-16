"use client";
import { useState } from "react";
import cheerio from "cheerio";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  const handleScrape = async () => {
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/${url}`
      );
      const html = await response.text();

      const $ = cheerio.load(html);

      const mainText = $("body").text();

      const scrapedData = {
        url,
        mainText,
      };

      setResult(JSON.stringify(scrapedData, null, 2));
    } catch (error) {
      console.log("Error fetching URL: ", error);
    }
  };

  return (
    <main className="flex justify-center pt-20">
      <div className="text-center">
        <div className="flex gap-2">
          <div>
            <label className="sr-only">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="enter a url"
            />
          </div>
          <button
            type="button"
            onClick={handleScrape}
            className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            scrape
          </button>
        </div>
        <h1 className="text-lg pt-20">Main Content</h1>
        <p>{result}</p>
      </div>
    </main>
  );
}
