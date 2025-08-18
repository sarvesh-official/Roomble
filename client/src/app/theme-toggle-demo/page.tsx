"use client";

import React from "react";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";

export default function ThemeToggleDemoPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Theme Toggle Animations</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        This demo showcases various theme toggle animations using the View Transition API.
        Click on any toggle button to see the animation effect when switching between light and dark themes.
      </p>
      
      <div className="bg-secondary/30 rounded-xl p-8 mb-12">
        <div className="h-full w-full flex flex-wrap items-center justify-center gap-8 py-8">
          <ThemeToggleButton
            showLabel
            variant="gif"
            url="https://media.giphy.com/media/KBbr4hHl9DSahKvInO/giphy.gif?cid=790b76112m5eeeydoe7et0cr3j3ekb1erunxozyshuhxx2vl&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />
          <ThemeToggleButton
            showLabel
            variant="gif"
            url="https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />
          <ThemeToggleButton
            showLabel
            variant="gif"
            url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3JwcXdzcHd5MW92NWprZXVpcTBtNXM5cG9obWh0N3I4NzFpaDE3byZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/WgsVx6C4N8tjy/giphy.gif"
          />
          <ThemeToggleButton
            showLabel
            variant="gif"
            url="https://media.giphy.com/media/ArfrRmFCzYXsC6etQX/giphy.gif?cid=ecf05e47kn81xmnuc9vd5g6p5xyjt14zzd3dzwso6iwgpvy3&ep=v1_stickers_search&rid=giphy.gif&ct=s"
          />

          <ThemeToggleButton showLabel />
          <ThemeToggleButton showLabel variant="circle-blur" start="top-right" />
          <ThemeToggleButton showLabel variant="circle-blur" start="bottom-left" />
          <ThemeToggleButton showLabel variant="circle-blur" start="bottom-right" />

          <ThemeToggleButton showLabel variant="circle" start="top-left" />
          <ThemeToggleButton showLabel variant="circle" start="top-right" />
          <ThemeToggleButton showLabel variant="circle" start="bottom-left" />
          <ThemeToggleButton showLabel variant="circle" start="bottom-right" />

          <ThemeToggleButton showLabel variant="circle" start="center" />
          
          <div className="w-full flex justify-center mt-8">
            <ThemeToggleButton showLabel randomize={true} />
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto prose dark:prose-invert">
        <h2>About These Animations</h2>
        <p>
          These theme toggle animations are implemented using the View Transition API and React state management.
          The animations include:
        </p>
        <ul>
          <li><strong>Circle</strong> - A simple circular ripple effect</li>
          <li><strong>Circle Blur</strong> - A circular ripple with blur effect</li>
          <li><strong>Polygon</strong> - A morphing polygon animation</li>
          <li><strong>GIF</strong> - Custom GIF-based animations</li>
          <li><strong>Random</strong> - Randomly selects an animation type and configuration each time</li>
        </ul>
        
        <h2>Implementation</h2>
        <p>
          The animations are implemented using:
        </p>
        <ul>
          <li>React with hooks for state management</li>
          <li>next-themes for theme switching</li>
          <li>View Transition API for smooth transitions</li>
          <li>Tailwind CSS for styling</li>
        </ul>
      </div>
    </div>
  );
}
