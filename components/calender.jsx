import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/components/ui/command";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";



const DateTimeCalendar = ({ 
  value, // This will be field.value from Controller
  onChange, // This will be field.onChange from Controller
  showTime = true,
  showDate = true,
  defaultTab = 'date',
  className = '',
  disabled = false,
  minDate,
  maxDate,
  ...props 
}) => {
  // Initialize with current date if no value provided
  const initialDate = value || new Date()
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedTime, setSelectedTime] = useState({
    hours: initialDate.getHours(),
    minutes: initialDate.getMinutes()
  })
  const [currentMonth, setCurrentMonth] = useState(initialDate)
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setSelectedTime({
        hours: value.getHours(),
        minutes: value.getMinutes()
      })
      setCurrentMonth(value)
    }
  }, [value])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString()
  }

  const isDateDisabled = (date) => {
    if (disabled) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  const selectDate = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    
    if (isDateDisabled(newDate)) return
    
    // Preserve the current time when selecting a new date
    newDate.setHours(selectedTime.hours, selectedTime.minutes, 0, 0)
    
    setSelectedDate(newDate)
    
    // Immediately update the form field
    if (onChange) {
      onChange(newDate)
    }
  }

  const handleTimeChange = (type, value) => {
    const newTime = {
      ...selectedTime,
      [type]: parseInt(value)
    }
    
    setSelectedTime(newTime)
    
    // Create new date with updated time
    const newDate = new Date(selectedDate)
    newDate.setHours(newTime.hours, newTime.minutes, 0, 0)
    
    setSelectedDate(newDate)
    
    // Immediately update the form field
    if (onChange) {
      onChange(newDate)
    }
  }

  const setQuickTime = (hours, minutes) => {
    const newTime = { hours, minutes }
    setSelectedTime(newTime)
    
    // Create new date with updated time
    const newDate = new Date(selectedDate)
    newDate.setHours(hours, minutes, 0, 0)
    
    setSelectedDate(newDate)
    
    // Immediately update the form field
    if (onChange) {
      onChange(newDate)
    }
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Previous month's trailing days
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(currentMonth.getMonth() - 1)
    const daysInPrevMonth = getDaysInMonth(prevMonth)
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day)
      const isDisabled = isDateDisabled(date)
      
      days.push(
        <button
          key={`prev-${day}`}
          type="button"
          disabled={isDisabled}
          className={`w-10 h-10 rounded-lg transition-colors ${
            isDisabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => !isDisabled && (navigateMonth(-1), selectDate(day))}
        >
          {day}
        </button>
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = isSameDay(date, selectedDate)
      const isTodayDate = isToday(date)
      const isDisabled = isDateDisabled(date)

      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => !isDisabled && selectDate(day)}
          className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
            isDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : isSelected
              ? 'bg-blue-500 text-white shadow-lg scale-105'
              : isTodayDate
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {day}
        </button>
      )
    }

    // Next month's leading days
    const totalCells = 42 // 6 rows × 7 days
    const remainingCells = totalCells - days.length
    
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonth = new Date(currentMonth)
      nextMonth.setMonth(currentMonth.getMonth() + 1)
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day)
      const isDisabled = isDateDisabled(date)
      
      days.push(
        <button
          key={`next-${day}`}
          type="button"
          disabled={isDisabled}
          className={`w-10 h-10 rounded-lg transition-colors ${
            isDisabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={() => !isDisabled && (navigateMonth(1), selectDate(day))}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const formatTime = (hours, minutes) => {
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const generateTimeOptions = (max) => {
    return Array.from({ length: max }, (_, i) => i)
  }

  const resetToNow = () => {
    const now = new Date()
    setSelectedDate(now)
    setSelectedTime({
      hours: now.getHours(),
      minutes: now.getMinutes()
    })
    setCurrentMonth(now)
    
    if (onChange) {
      onChange(now)
    }
  }

  return (
    <div className={`max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden ${className}`} {...props}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          {showDate && showTime && (
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('date')}
                disabled={!showDate}
                type="button"
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === 'date' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('time')}
                disabled={!showTime}
                type="button"
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === 'time' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Clock className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Selected Date & Time Display */}
        <div className="text-center">
          {showDate && (
            <div className="text-2xl font-bold text-white mb-1">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          )}
          {showTime && (
            <div className="text-lg text-white/90">
              {formatTime(selectedTime.hours, selectedTime.minutes)}
            </div>
          )}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-6">
        {(activeTab === 'date' || !showTime) && showDate && (
          <div className="space-y-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth(-1)}
                disabled={disabled}
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                disabled={disabled}
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarDays()}
            </div>
          </div>
        )}

        {(activeTab === 'time' || !showDate) && showTime && (
          <div className="space-y-6">
            {/* Time Display */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {formatTime(selectedTime.hours, selectedTime.minutes)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Selected time
              </div>
            </div>

            {/* Time Selectors */}
            <div className="grid grid-cols-2 gap-4">
              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hours
                </label>
                <select
                  value={selectedTime.hours}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                  disabled={disabled}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generateTimeOptions(24).map(hour => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Minutes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minutes
                </label>
                <select
                  value={selectedTime.minutes}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                  disabled={disabled}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generateTimeOptions(60).map(minute => (
                    <option key={minute} value={minute}>
                      {minute.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Time Options */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Select</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '9:00 AM', hours: 9, minutes: 0 },
                  { label: '12:00 PM', hours: 12, minutes: 0 },
                  { label: '6:00 PM', hours: 18, minutes: 0 },
                  { label: '9:00 PM', hours: 21, minutes: 0 },
                  { label: 'Now', hours: new Date().getHours(), minutes: new Date().getMinutes() },
                  { label: 'Midnight', hours: 0, minutes: 0 }
                ].map(time => (
                  <button
                    key={time.label}
                    type="button"
                    onClick={() => setQuickTime(time.hours, time.minutes)}
                    disabled={disabled}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex space-x-3">
          <button
            onClick={resetToNow}
            disabled={disabled}
            type="button"
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Now
          </button>
          <button 
            onClick={() => onChange && onChange(null)}
            disabled={disabled}
            type="button"
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default DateTimeCalendar












{/* <DateTimeCalendar
  // Date control
  value={selectedDate}              // Date object - current selected date
  onChange={handleDateChange}       // Function - called when date changes
  
  // Time control  
  timeValue={selectedTime}          // Object - { hours: 14, minutes: 30 }
  onTimeChange={handleTimeChange}   // Function - called when time changes
  
  // Display options
  showTime={true}                   // Boolean - show time picker
  showDate={true}                   // Boolean - show date picker
  defaultTab="date"                 // String - "date" or "time"
  
  // State & validation
  disabled={false}                  // Boolean - disable all interactions
  minDate={new Date()}             // Date - minimum selectable date
  maxDate={futureDate}             // Date - maximum selectable date
  
  // Styling
  className="custom-class"          // String - additional CSS classes
/> */}