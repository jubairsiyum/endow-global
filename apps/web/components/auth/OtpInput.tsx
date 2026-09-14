'use client'

import { useRef } from 'react'

const OTP_LENGTH = 6

type OtpInputProps = {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  namePrefix?: string
}

export default function OtpInput({
  value,
  onChange,
  disabled = false,
  namePrefix = 'otp',
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const focusInput = (index: number) => {
    inputRefs.current[Math.max(0, Math.min(index, OTP_LENGTH - 1))]?.focus()
  }

  const applyDigits = (startIndex: number, rawValue: string) => {
    const digits = rawValue.replace(/\D/g, '').slice(0, OTP_LENGTH - startIndex)
    if (!digits) return

    const next = [...value]
    digits.split('').forEach((digit, offset) => {
      next[startIndex + offset] = digit
    })
    onChange(next)
    focusInput(Math.min(startIndex + digits.length, OTP_LENGTH - 1))
  }

  const handleChange = (index: number, rawValue: string) => {
    if (!rawValue) {
      const next = [...value]
      next[index] = ''
      onChange(next)
      return
    }
    applyDigits(index, rawValue)
  }

  return (
    <div className="mt-7 flex justify-center gap-2.5 sm:gap-3" role="group" aria-label="Verification code">
      {Array.from({ length: OTP_LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element
          }}
          name={`${namePrefix}-${index}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          value={value[index] ?? ''}
          disabled={disabled}
          aria-label={`Verification code digit ${index + 1}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onPaste={(event) => {
            event.preventDefault()
            applyDigits(index, event.clipboardData.getData('text'))
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !value[index] && index > 0) {
              focusInput(index - 1)
            } else if (event.key === 'ArrowLeft' && index > 0) {
              event.preventDefault()
              focusInput(index - 1)
            } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
              event.preventDefault()
              focusInput(index + 1)
            }
          }}
          className="h-13 w-11 rounded-xl border border-slate-200 bg-white text-center text-lg font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:opacity-50 sm:h-14 sm:w-12"
        />
      ))}
    </div>
  )
}
