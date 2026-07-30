"use client"

import React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

import {
  AnimationStart,
  AnimationVariant,
  createAnimation,
} from "./theme/theme-animations"

export const THEME_TOGGLE_GIFS = [
  "/theme-gifs/gif-1.gif",
  "/theme-gifs/gif-2.gif",
  "/theme-gifs/gif-3.gif",
  "/theme-gifs/gif-4.gif",
  "/theme-gifs/gif-5.gif",
  "/theme-gifs/gif-6.gif",
]

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant
  start?: AnimationStart
  url?: string
  randomize?: boolean
}

export function ThemeToggleButton({
  variant = "circle-blur",
  start = "top-left",
  url = "",
  randomize = false
}: ThemeToggleAnimationProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getRandomAnimation = React.useCallback(() => {
    const variants: AnimationVariant[] = ["circle-blur", "circle", "gif"]
    const positions: AnimationStart[] = ["top-left", "top-right", "bottom-left", "bottom-right"]

    const randomVariant = variants[Math.floor(Math.random() * variants.length)]
    const randomPosition = positions[Math.floor(Math.random() * positions.length)]

    const randomGifUrl = randomVariant === "gif"
      ? THEME_TOGGLE_GIFS[Math.floor(Math.random() * THEME_TOGGLE_GIFS.length)]
      : ""

    return {
      variant: randomVariant,
      start: randomPosition,
      url: randomGifUrl
    }
  }, [])

  const styleId = "theme-transition-styles"

  const updateStyles = React.useCallback((css: string) => {
    if (typeof window === "undefined") return

    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = css
  }, [])

  const toggleTheme = React.useCallback(() => {
    if (!mounted) return

    let animVariant = variant
    let animStart = start
    let animUrl = url

    if (randomize) {
      const randomAnim = getRandomAnimation()
      animVariant = randomAnim.variant
      animStart = randomAnim.start

      if (randomAnim.variant === "gif" && randomAnim.url) {
        animUrl = randomAnim.url
      }
    }

    const animation = createAnimation(animVariant, animStart, animUrl)
    updateStyles(animation.css)

    if (typeof window === "undefined") return

    const switchTheme = () => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    try {
      document.startViewTransition(switchTheme)
    } catch {
      switchTheme()
    }
  }, [mounted, resolvedTheme, setTheme, variant, start, url, randomize, getRandomAnimation, updateStyles])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-9 p-0 h-9 relative group"
        name="Theme Toggle Button"
      >
        <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Theme Toggle</span>
      </Button>
    )
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="w-9 p-0 h-9 relative group"
      name="Theme Toggle Button"
    >
      <SunIcon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme Toggle</span>
    </Button>
  )
}
