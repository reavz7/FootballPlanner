"use client"

import { useRef, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import ButtonPrimary from "../components/ButtonPrimary"
import { createMatch } from "../services/api"
import { useNavigate } from "react-router-dom"
import SuccessAlert from "../components/SuccessAlert"
import ErrorAlert from "../components/ErrorAlert"
import Footer from "../components/Footer"

const CreateMatch = () => {
  const navigate = useNavigate()
  const calendarRef = useRef(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  })
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("12:00")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isParticipant, setIsParticipant] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      setError("Musisz być zalogowany, aby utworzyć mecz!")
      navigate("/login")
    }

    const calendar = calendarRef.current

    if (!calendar) return

    const onDateChange = (e) => {
      const date = e.target.value || e.detail // dostosuj wg eventu
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
        setError("") // Wyczyść błędy po prawidłowym wyborze daty
      }
    }

    calendar.addEventListener("change", onDateChange)

    return () => {
      calendar.removeEventListener("change", onDateChange)
    }
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value)
  }

  const handleParticipantChange = (e) => {
    setIsParticipant(e.target.checked)
    if (!e.target.checked) {
      setSelectedPosition("")
    }
  }

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!selectedDate) {
      setError("Wybierz datę meczu!")
      return
    }

    if (!formData.title || !formData.location) {
      setError("Tytuł i lokalizacja są wymagane!")
      return
    }

    // Łączenie daty i czasu w jeden obiekt Date lub string ISO
    const dateTimeString = `${selectedDate}T${selectedTime}:00` // np. "2025-05-19T18:30:00"
    const matchDateTime = new Date(dateTimeString)

    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      if (!token) {
        setError("Brak autoryzacji. Zaloguj się ponownie.")
        navigate("/login")
        return
      }

      const matchData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: matchDateTime.toISOString(),
        isParticipant: isParticipant,
        position: selectedPosition,
      }

      await createMatch(matchData, token)

      setSuccess("Mecz został pomyślnie utworzony!")

      // Resetuj formularz po udanym utworzeniu
      setFormData({
        title: "",
        description: "",
        location: "",
      })
      setSelectedDate("")
      calendarRef.current.value = ""

      // Przekierowanie po krótkim opóźnieniu, żeby użytkownik zobaczył komunikat sukcesu
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      setError(error.message || "Wystąpił błąd podczas tworzenia meczu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="pt-38 bg-black min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white text-4xl text-center uppercase font-medium mb-2">Stwórz mecz, zacznij grać.</h1>
          <p className="text-white text-center italic tracking-widest mb-1.5">Prosto i szybko.</p>
          <div className="flex justify-center">
            <div className="border-1 w-4xl border-white mb-4"></div>
          </div>
        </div>

        {success && (
          <div className="max-w-5xl mx-auto mb-4">
            <SuccessAlert text={success} />
          </div>
        )}

        {error && (
          <div className="max-w-5xl mx-auto mb-4">
            <ErrorAlert text={error} />
          </div>
        )}

        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="sm:grid sm:grid-cols-3 gap-12 w-full max-w-5xl mb-8 flex flex-col justify-center items-center sm:items-start">
            <div className="flex flex-col items-end  gap-7.5">
              <input
                type="text"
                name="title"
                placeholder="Nazwa meczu"
                className="input"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Lokalizacja meczu"
                className="input"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                className="textarea"
                placeholder="Opis (opcjonalnie)"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
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
            <div>
              <div className="form-control mt-4">
                <label className="cursor-pointer label justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={isParticipant}
                    onChange={handleParticipantChange}
                  />
                  <span className="label-text text-white">Chcę być także uczestnikiem meczu</span>
                </label>
              </div>

              {isParticipant && (
                <div className="mt-2 w-full">
                  <select
                    className="select select-bordered w-full"
                    value={selectedPosition}
                    onChange={handlePositionChange}
                    required={isParticipant}
                  >
                    <option value="" disabled>
                      Wybierz preferowaną pozycję
                    </option>
                    <option value="bramkarz">Bramkarz</option>
                    <option value="obrona">Obrona</option>
                    <option value="pomoc">Pomoc</option>
                    <option value="atak">Atak</option>
                  </select>
                </div>
              )}
              </div>
          </div>

          <div className="flex justify-center mb-30   ">
            <ButtonPrimary type={"submit"} text={loading ? "Tworzenie..." : "Stwórz mecz"} disabled={loading} />
          </div>
        </form>
      </div>
      <Footer/>
    </>
  )
}

export default CreateMatch
