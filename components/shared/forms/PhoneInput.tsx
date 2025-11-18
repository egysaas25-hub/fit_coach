"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils/cn"

interface CountryCode {
  code: string
  name: string
  flag: string
  dialCode: string
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "EG", name: "Egypt", flag: "🇪🇬", dialCode: "+20" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966" },
  { code: "AE", name: "UAE", flag: "🇦🇪", dialCode: "+971" },
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  countryCode: string
  onCountryCodeChange: (code: string) => void
  error?: string
  disabled?: boolean
  label?: string
  placeholder?: string
}

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  error,
  disabled = false,
  label = "Phone Number",
  placeholder = "Enter phone number",
  className
}: PhoneInputProps & { className?: string }) {
  const selectedCountry = COUNTRY_CODES.find(c => c.dialCode === countryCode) || COUNTRY_CODES[0]

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const cleaned = e.target.value.replace(/\D/g, "")
    onChange(cleaned)
  }

  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return ""
    // Simple formatting - just return the digits
    return phone
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor="phone-input" className="text-white">{label}</Label>}
      <div className="flex gap-2">
        {/* Only show country selector if countryCode is provided */}
        {countryCode && (
          <Select value={countryCode} onValueChange={onCountryCodeChange} disabled={disabled}>
            <SelectTrigger className="w-[140px] bg-gray-800 border-gray-600 text-white">
              <SelectValue>
                <span className="flex items-center gap-2">
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span>{selectedCountry.dialCode}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {COUNTRY_CODES.map((country) => (
                <SelectItem key={country.code} value={country.dialCode} className="text-white hover:bg-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-gray-400">{country.dialCode}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <div className="flex-1">
          <Input
            id="phone-input"
            type="tel"
            inputMode="numeric"
            value={formatPhoneDisplay(value)}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "bg-gray-800 border-gray-600 text-white placeholder:text-gray-400",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={!!error}
            aria-describedby={error ? "phone-error" : undefined}
          />
        </div>
      </div>
      {error && (
        <p id="phone-error" className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
