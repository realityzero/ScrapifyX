"use client";
import React from "react";
import { AnimatedTooltip } from "./animated-tooltip";
const people = [
  {
    id: 1,
    name: "Neshantt Sikri",
    designation: "Software Engineer",
    image:
      "https://avatars.githubusercontent.com/u/33288462?v=4",
  },
];

export function NavbarContent() {
  return (
    <div className="flex flex-row items-center justify-center w-full">
        <p className="text-black dark:text-white mr-2">
            Scrapify-X made with &#9749; by 
        </p>
        <AnimatedTooltip items={people} />
    </div>
  );
}
