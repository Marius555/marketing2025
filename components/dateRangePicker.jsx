"use client"

import { CalendarIcon } from "lucide-react"
import { forwardRef, useState, useRef, useEffect } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"

import { cn } from "@/lib/utils"
import { RangeCalendar } from "./ui/calendar-rac"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formValueToAriaValue, ariaValueToFormValue, formatDateRangeForDisplay } from "@/lib/dateUtils"

const DateRangePicker = forwardRef(function DateRangePicker({
  label = "Campaign Duration",
  description,
  errorMessage,
  isInvalid = false,
  isRequired = false,
  value,
  onChange,
  onBlur,
  className,
  ...props
}, ref) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const calendarRef = useRef(null)

  // Convert form value to React Aria calendar value
  console.log('📅 DateRangePicker render - received props:', { value, onChange: !!onChange, onBlur: !!onBlur, label })
  const calendarValue = formValueToAriaValue(value)
  console.log('📅 Converted to calendar value:', calendarValue)

  // Handle calendar date selection
  const handleCalendarChange = (newAriaValue) => {
    console.log('📅 DateRangePicker handleCalendarChange called:', newAriaValue)
    const formValue = ariaValueToFormValue(newAriaValue)
    console.log('📅 Converted to form value:', formValue)
    if (onChange) {
      console.log('📅 Calling onChange with form value:', formValue)
      onChange(formValue)
    }

    // Close calendar if both start and end dates are selected
    if (newAriaValue && newAriaValue.start && newAriaValue.end) {
      console.log('📅 Complete date range selected, closing calendar')
      setIsOpen(false)
    }
  }

  // Handle clicking outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        console.log('📅 Clicking outside calendar, closing')
        setIsOpen(false)
        // Only call onBlur if we're actually closing due to outside click
        setTimeout(() => {
          if (onBlur) {
            onBlur()
          }
        }, 0)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onBlur])

  // Format the current value for display
  const displayValue = formatDateRangeForDisplay(value)

  // Set minimum date to today for campaigns
  const minValue = today(getLocalTimeZone())

  const handleInputClick = () => {
    setIsOpen(true)
  }

  const handleCalendarClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className={cn("space-y-2", className)} ref={ref} {...props}>
      {/* Label */}
      <label className="text-foreground text-sm font-medium">
        {label}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </label>

      {/* Input with Calendar Button */}
      <div className="relative" ref={containerRef}>
        <Input
          type="text"
          value={displayValue}
          placeholder="Select campaign duration..."
          readOnly
          onClick={handleInputClick}
          className={cn(
            "pr-10 cursor-pointer",
            isInvalid && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleInputClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
        >
          <CalendarIcon size={16} />
        </Button>

        {/* Calendar Popover */}
        {isOpen && (
          <div
            className="absolute top-full left-0 z-[9999] mt-1 bg-background border rounded-md shadow-lg p-2"
            onClick={handleCalendarClick}
            ref={calendarRef}
          >
            <RangeCalendar
              value={calendarValue}
              onChange={handleCalendarChange}
              minValue={minValue}
              allowsNonContiguousRanges={false}
            />
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground text-xs">
          {description}
        </p>
      )}

      {/* Error Message */}
      {isInvalid && errorMessage && (
        <p className="text-destructive text-xs">
          {errorMessage}
        </p>
      )}
    </div>
  )
})

DateRangePicker.displayName = "DateRangePicker"

export default DateRangePicker
