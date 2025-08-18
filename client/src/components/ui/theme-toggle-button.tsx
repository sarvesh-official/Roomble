"use client"

import React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { AnimationStart, AnimationVariant, createAnimation } from "./theme/theme-animations"
import { getRandomThemeAnimation } from "@/lib/utils"

// Animation configuration is now imported from utils.ts

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant
  start?: AnimationStart
  showLabel?: boolean
  url?: string
  randomize?: boolean
}

export function ThemeToggleButton({
  variant = "circle-blur",
  start = "top-left",
  showLabel = false,
  url = "",
  randomize = false
}: ThemeToggleAnimationProps) {
  const { theme, setTheme } = useTheme()
  const [currentVariant, setCurrentVariant] = React.useState<AnimationVariant>(variant)
  const [currentStart, setCurrentStart] = React.useState<AnimationStart>(start)
  const [currentUrl, setCurrentUrl] = React.useState<string>(url)

  const styleId = "theme-transition-styles"

  const updateStyles = React.useCallback((css: string, name: string) => {
    if (typeof window === "undefined") return

    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = css
  }, [])

  // Use the utility function from utils.ts
  const getRandomAnimation = React.useCallback(() => {
    return getRandomThemeAnimation()
  }, [])

  const toggleTheme = React.useCallback(() => {
    // If randomize is true, get random animation settings
    if (randomize) {
      const randomAnimation = getRandomAnimation()
      setCurrentVariant(randomAnimation.variant)
      setCurrentStart(randomAnimation.start)
      setCurrentUrl(randomAnimation.url)
      
      const animation = createAnimation(
        randomAnimation.variant, 
        randomAnimation.start, 
        randomAnimation.url
      )
      updateStyles(animation.css, animation.name)
    } else {
      const animation = createAnimation(currentVariant, currentStart, currentUrl)
      updateStyles(animation.css, animation.name)
    }

    if (typeof window === "undefined") return

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light")
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    document.startViewTransition(switchTheme)
  }, [theme, setTheme, randomize, currentVariant, currentStart, currentUrl, getRandomAnimation, updateStyles])

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
      <span className="sr-only">Theme Toggle </span>
    </Button>
  )
}
