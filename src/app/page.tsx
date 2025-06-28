"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");

  return (
    <div className="max-w-3xl m-auto pt-32 flex flex-col gap-3.5">
      <div>
        <p className="text-2xl">
          Welcome to the Arkham Horror Proxy Generator!
        </p>
        <p className="text-sm">
          Yust paste the card names or codes that you want to generate proxies
          for.
        </p>
      </div>
      <form
        className="flex flex-col gap-3.5"
        method="POST"
        action="/api/make-pdf"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          name="content"
          className="w-full h-96 resize-none border border-gray-300 rounded-md p-4"
          placeholder="4x Unexpected Courage"
        />
        <button
          className="bg-teal-700 p-2.5 rounded-md hover:cursor-pointer w-full"
          type="submit"
          formTarget="_blank"
        >
          Generate Proxies (in a new tab so you don&apos;t lose your list )
        </button>
      </form>
    </div>
  );
}
