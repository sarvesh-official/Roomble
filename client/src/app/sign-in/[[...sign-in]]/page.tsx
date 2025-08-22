"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import CircularText from "@/components/CircularText";
import {
  Palette,
  Users,
  Cloud,
  ShieldCheck,
} from 'lucide-react';

const Dither = dynamic(() => import("../../../components/Dither"), {
  ssr: false,
});

export default function Page() {
  
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      {/* Theme toggle button */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggleButton randomize={true} />
      </div>
      
      <style jsx>{`
        .login-btn {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }
        .login-btn:hover::before {
          left: 100%;
        }
      `}</style>
      
      <div className="z-10 w-full max-w-6xl">
        <div className="bg-gray-100 dark:bg-[#1a1919] backdrop-blur-sm overflow-hidden rounded-[20px] md:rounded-[30px] shadow-2xl border border-border/50">
          <div className="grid min-h-[500px] md:min-h-[600px] lg:min-h-[700px] lg:grid-cols-2">
            {/* Left Side */}
            <div className="brand-side relative m-0 rounded-none overflow-hidden text-foreground">
              {/* Dither component as background */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Darker Dither background */}
                <div className="w-full h-full">
                  <Dither
                    waveColor={[0.2, 0.2, 0.2]}
                    disableAnimation={false}
                    enableMouseInteraction={true}
                    mouseRadius={0.3}
                    colorNum={4}
                    waveAmplitude={0.3}
                    waveFrequency={3}
                    waveSpeed={0.05}
                  />
                </div>
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
              </div>
              
              {/* Content overlay */}
              <div className="relative z-10 p-4 sm:p-6 md:p-12 flex flex-col h-full">
                <div>
                  <div className="flex items-center gap-2 mb-6 md:mb-12">
                    <div className="size-8 overflow-hidden">
                      <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-semibold text-xl text-white dark:text-white">Roomble</span>
                  </div>
                  
                  <h1 className="mb-3 md:mb-4 text-3xl sm:text-4xl md:text-6xl font-medium text-white">
                    Welcome Back
                  </h1>
                  <p className="mb-6 sm:mb-8 md:mb-12 text-base sm:text-lg md:text-xl text-white/90">
                    Sign in to your account to continue your journey
                  </p>

                  <div className="space-y-4 sm:space-y-6">
                    {[
                      {
                        icon: <Users size={16} color="white" />,
                        title: 'Instant Connections',
                        desc: 'No registration required for quick rooms',
                      },
                      {
                        icon: <Cloud size={16} color="white" />,
                        title: 'Cloud Sync',
                        desc: 'Access your rooms from any device',
                      },
                      {
                        icon: <ShieldCheck size={16} color="white" />,
                        title: 'Secure Chats',
                        desc: 'End-to-end encryption for all messages',
                      },
                      {
                        icon: <Palette size={16} color="white" />,
                        title: 'Customizable',
                        desc: 'Personalize your chat experience',
                      },
                    ].map(({ icon, title, desc }, i) => (
                      <div
                        key={i}
                        className="feature-item flex items-center"
                      >
                        <div className="mr-3 sm:mr-4 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                          {icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{title}</div>
                          <div className="text-xs sm:text-sm text-white/80">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Clerk Auth */}
            <div className="relative flex flex-col justify-center p-6 md:p-12 lg:p-10">
              {/* CircularText in top right */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 md:-mt-12 md:-mr-12 lg:-mt-16 lg:-mr-16 z-10 scale-75 md:scale-90 lg:scale-100">
                <CircularText 
                  text="Welcome Back • Sign In • " 
                  spinDuration={15} 
                  onHover="speedUp"
                  className="text-primary dark:text-primary font-bold"
                />
              </div>
              
              <div className="mx-auto w-full max-w-md">
                {/* Clerk SignIn component */}
                <SignIn redirectUrl="/" afterSignInUrl="/dashboard" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
