"use client"

import { useEffect, useRef, useState } from "react"
import { OTPInput, SlotProps } from "input-otp"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"

interface EnhancedOTPInputProps {
  triggerButton?: React.ReactNode;
  title?: string;
  description?: string;
  correctCode?: string;
  maxLength?: number;
  onSuccess?: (code: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EnhancedOTPInput({
  triggerButton,
  title = "Enter confirmation code",
  description = "Enter the 6-digit code to join the room",
  correctCode,
  onSuccess,
  isOpen,
  onOpenChange
}: EnhancedOTPInputProps = {}) {
  const [value, setValue] = useState("")
  const [hasGuessed, setHasGuessed] = useState<undefined | boolean>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (hasGuessed) {
      closeButtonRef.current?.focus()
      
      if (onSuccess) {
        const timer = setTimeout(() => {
          onSuccess(value)
        }, 800)
        return () => clearTimeout(timer)
      }
    }
  }, [hasGuessed, onSuccess, value])

  async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault?.()

    inputRef.current?.select()
    await new Promise((r) => setTimeout(r, 1_00))

    // If correctCode is provided, validate against it
    // Otherwise, assume the code is valid (validation will happen elsewhere)
    const isValid = correctCode ? (value === correctCode) : true;
    setHasGuessed(isValid)

    setValue("")
    setTimeout(() => {
      inputRef.current?.blur()
    }, 20)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && (
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
      )}
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Image src="/icon.png" alt="Roomble" width={32} height={32} className="w-full h-full object-contain" />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {hasGuessed ? "Code verified!" : title}
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {hasGuessed
                ? "Your code has been successfully verified."
                : description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {hasGuessed ? (
          <div className="text-center">
            <DialogClose asChild>
              <Button type="button" ref={closeButtonRef}>
                Close
              </Button>
            </DialogClose>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center py-6">
            <OTPInput
                id="confirmation-code"
                ref={inputRef}
                value={value}
                onChange={(val) => setValue(val.toUpperCase())}
                containerClassName="flex items-center gap-4 has-disabled:opacity-50"
                maxLength={6}
                onFocus={() => setHasGuessed(undefined)}
                render={({ slots }) => (
                  <div className="flex gap-1.5 xs:gap-2 sm:gap-3 px-2 py-1">
                    {slots.map((slot, idx) => (
                      <Slot key={idx} {...slot} />
                    ))}
                  </div>
                )}
                onComplete={onSubmit}
              />
            </div>
            {hasGuessed === false && (
              <p
                className="text-muted-foreground text-center text-xs"
                role="alert"
                aria-live="polite"
              >
                Invalid code. Please try again.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={
        "bg-background text-foreground flex h-12 w-10 sm:h-16 sm:w-12 md:h-20 md:w-16 items-center justify-center rounded-md font-medium shadow-md transition-all duration-200 border border-gray-500 dark:border-gray-200"}
    >
      {props.char !== null && (
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase">{props.char}</div>
      )}
    </div>
  )
}