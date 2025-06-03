import React, { useRef, useEffect } from "react"

const MatchDateTimePicker = ({ selectedDate, setSelectedDate, selectedTime, setSelectedTime, setError }) => {
  const calendarRef = useRef(null)

  useEffect(() => {
    const calendar = calendarRef.current

    if (!calendar) return

    const onDateChange = (e) => {
      const date = e.target.value || e.detail 
      if (!date) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const selected = new Date(date)
      selected.setHours(0, 0, 0, 0)

      if (selected < today) {
        setError("Nie możesz wybrać przeszłej daty!")
        calendar.value = ""
        setSelectedDate("")
      } else {
        setSelectedDate(date)
        setError("") 
      }
    }

    calendar.addEventListener("change", onDateChange)

    return () => {
      calendar.removeEventListener("change", onDateChange)
    }
  }, [setSelectedDate, setError])

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value)
  }

  return (
    <div className="flex flex-col gap-4">
      <calendar-date
        ref={calendarRef}
        className="cally bg-base-100 border border-base-300 shadow-lg rounded-box"
      >
        <svg
          aria-label="Previous"
          className="fill-current size-4"
          slot="previous"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
        </svg>
        <svg
          aria-label="Next"
          className="fill-current size-4"
          slot="next"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
        </svg>
        <calendar-month></calendar-month>
      </calendar-date>

      <input
        type="time"
        className="input w-[18rem]"
        value={selectedTime}
        onChange={handleTimeChange}
        required
      />
    </div>
  )
}

export default MatchDateTimePicker