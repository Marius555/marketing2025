import { parseDate, CalendarDate } from '@internationalized/date'

/**
 * Convert a string date (YYYY-MM-DD) to CalendarDate object
 * @param {string|null} dateString - Date string in YYYY-MM-DD format
 * @returns {CalendarDate|null} CalendarDate object or null
 */
export function stringToCalendarDate(dateString) {
  if (!dateString) return null

  try {
    return parseDate(dateString)
  } catch (error) {
    console.warn('Invalid date string:', dateString, error)
    return null
  }
}

/**
 * Convert CalendarDate object to string (YYYY-MM-DD)
 * @param {CalendarDate|null} calendarDate - CalendarDate object
 * @returns {string|null} Date string in YYYY-MM-DD format or null
 */
export function calendarDateToString(calendarDate) {
  if (!calendarDate) return null

  try {
    return calendarDate.toString()
  } catch (error) {
    console.warn('Invalid CalendarDate object:', calendarDate, error)
    return null
  }
}

/**
 * Convert form value (with start/end strings) to React Aria value (with CalendarDate objects)
 * @param {{start?: string, end?: string}|null} formValue - Form value with string dates
 * @returns {{start: CalendarDate, end?: CalendarDate}|null} React Aria compatible value
 */
export function formValueToAriaValue(formValue) {
  // Handle null, undefined, or missing formValue
  if (!formValue) return null

  // Handle case where start is empty or missing
  if (!formValue.start || formValue.start === '') return null

  const start = stringToCalendarDate(formValue.start)
  if (!start) return null

  const result = { start }

  // Only add end if it exists and is valid
  if (formValue.end && formValue.end !== '') {
    const end = stringToCalendarDate(formValue.end)
    if (end) {
      result.end = end
    }
  }

  return result
}

/**
 * Convert React Aria value (with CalendarDate objects) to form value (with string dates)
 * @param {{start: CalendarDate, end?: CalendarDate}|null} ariaValue - React Aria value
 * @returns {{start: string, end?: string}} Form compatible value
 */
export function ariaValueToFormValue(ariaValue) {
  if (!ariaValue || !ariaValue.start) {
    return { start: '', end: '' }
  }

  const start = calendarDateToString(ariaValue.start)
  if (!start) {
    return { start: '', end: '' }
  }

  const result = { start, end: '' }

  if (ariaValue.end) {
    const end = calendarDateToString(ariaValue.end)
    if (end) {
      result.end = end
    }
  }

  return result
}

/**
 * Get today's date as CalendarDate
 * @returns {CalendarDate} Today's date
 */
export function getTodayAsCalendarDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1 // getMonth() returns 0-11, CalendarDate expects 1-12
  const day = today.getDate()

  return new CalendarDate(year, month, day)
}

/**
 * Format a date range for display
 * @param {{start: string, end: string}} dateRange - Date range object
 * @returns {string} Formatted date range string
 */
export function formatDateRangeForDisplay(dateRange) {
  if (!dateRange || (!dateRange.start && !dateRange.end)) {
    return ''
  }

  if (dateRange.start && dateRange.end) {
    try {
      const startDate = new Date(dateRange.start + 'T00:00:00')
      const endDate = new Date(dateRange.end + 'T00:00:00')

      const startFormatted = startDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })

      const endFormatted = endDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })

      return `${startFormatted} - ${endFormatted}`
    } catch (error) {
      console.warn('Error formatting date range:', error)
      return `${dateRange.start} - ${dateRange.end}`
    }
  }

  if (dateRange.start) {
    try {
      const startDate = new Date(dateRange.start + 'T00:00:00')
      return startDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return dateRange.start
    }
  }

  return ''
}

/**
 * Validate a date range for campaign purposes
 * @param {{start: string, end: string}} dateRange - Date range object
 * @returns {{isValid: boolean, error?: string}} Validation result
 */
export function validateCampaignDateRange(dateRange) {
  if (!dateRange || !dateRange.start) {
    return { isValid: false, error: 'Start date is required' }
  }

  if (!dateRange.end) {
    return { isValid: false, error: 'End date is required' }
  }

  try {
    const startDate = new Date(dateRange.start + 'T00:00:00')
    const endDate = new Date(dateRange.end + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      return { isValid: false, error: 'Start date cannot be in the past' }
    }

    if (endDate <= startDate) {
      return { isValid: false, error: 'End date must be after start date' }
    }

    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: 'Invalid date format' }
  }
}