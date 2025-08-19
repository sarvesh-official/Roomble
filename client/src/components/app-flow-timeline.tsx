'use client';

import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function AppFlowTimeline() {
  const data = [
    {
      title: "Create a Room",
      content: (
        <div className="space-y-4">
          <p className="text-sm md:text-base text-muted-foreground">
            Start by creating your own room with a single click. No registration required - get started instantly.
          </p>
          <p className="text-sm md:text-base">
            Roomble makes it easy to create a new room for your meetings, study sessions, or casual hangouts.
            Just click the "Create Room" button and you'll get a unique room ID that you can share with others.
          </p>
        </div>
      ),
    },
    {
      title: "Join the Conversation",
      content: (
        <div className="space-y-4">
          <p className="text-sm md:text-base text-muted-foreground">
            Enter your room and start chatting immediately. Share the room ID with others to invite them to join.
          </p>
          <p className="text-sm md:text-base">
            Our intuitive chat interface makes communication seamless. Send text messages, share files, and
            express yourself with emojis. The chat history is preserved for the duration of your session.
          </p>
        </div>
      ),
    },
    {
      title: "Video Conferencing",
      content: (
        <div className="space-y-4">
          <p className="text-sm md:text-base text-muted-foreground">
            Connect face-to-face with crystal-clear video calls, screen sharing, and interactive features.
          </p>
          <p className="text-sm md:text-base">
            Roomble's video conferencing capabilities allow for high-quality video and audio communication.
            Toggle your camera and microphone, share your screen, and use interactive whiteboard features
            to collaborate effectively with your team or friends.
          </p>
        </div>
      ),
    },
    {
      title: "Join the Community",
      content: (
        <div className="space-y-4">
          <p className="text-sm md:text-base text-muted-foreground">
            Connect with other users, share ideas, and build a network of collaborators in the Roomble community.
          </p>
          <p className="text-sm md:text-base">
            Become part of our growing community of users who are passionate about effective communication.
            Share tips, suggest features, and participate in community events to enhance your Roomble experience.
            Our forums and social channels are active with discussions about remote work, online education, and more.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
