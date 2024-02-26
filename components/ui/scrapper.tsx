"use client";
import React, { useState } from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { Input } from "./input";
import { Button } from "./button";


export function Scrapper() {
    const [url, setUrl] = useState('');

    const submitSrappingRequest = async () => {
        fetch('/api/', {
            method: "POST",
            body: JSON.stringify({url}),
            headers: {
            "Content-Type": "application/json"
            }
        });
    }
    const handleUrlChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUrl(event.target.value);
    };
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          Web Scraper
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Note: This web scraper is running over a potato server.
          Takes about 1-2 mins to do all stuff, since I cannot store chromium image.
        </p>
        <Input type="url" placeholder="Enter a valid url" onChange={handleUrlChange} />
        <div className="text-center">
          <Button onClick={submitSrappingRequest} className="mx-auto my-4">Scrape</Button>
        </div>
      </BackgroundGradient>
    </div>
  );
}
