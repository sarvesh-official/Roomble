"use client";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Sarvesh P",
    designation: "SDE Intern at Lowe's",
    image: "/profilepic.png",
    githubUrl: "https://github.com/sarvesh-official",
    portfolioUrl: "https://sarvee.dev"
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex items-center justify-center w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
