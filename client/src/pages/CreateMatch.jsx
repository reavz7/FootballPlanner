"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ButtonPrimary from "../components/ButtonPrimary"
import SuccessAlert from "../components/SuccessAlert"
import ErrorAlert from "../components/ErrorAlert"
import { createMatch } from "../services/api"
import MatchBasicInfo from "../components/MatchBasicInfo"
import MatchDateTimePicker from "../components/MatchDateTimePicker"
import ParticipationSection from "../components/ParticipationSection"

const CreateMatch = () => {
  const navigate = useNavigate()
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
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
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

    // Sprawdź czy wybrany czas nie jest w przeszłości
    const now = new Date()
    const selected = new Date(`${selectedDate}T${selectedTime}`)
    if (selected < now) {
      setError("Nie możesz wybrać daty i czasu, które już minęły!")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")

      if (!token) {
        setError("Brak autoryzacji. Zaloguj się ponownie.")
        navigate("/login")
        return
      }

      // Tworzenie ISO string z uwzględnieniem strefy czasowej
      const dateTimeString = `${selectedDate}T${selectedTime}:00`
      const matchDateTime = new Date(dateTimeString)
      
      // Obliczenie offsetu strefy czasowej (w minutach)
      const tzOffset = matchDateTime.getTimezoneOffset()
      
      // Korygujemy datę o offset strefy czasowej
      // Jeśli mamy np. -120 minut (UTC+2), dodajemy 120 minut, aby zrekompensować
      const correctedDateTime = new Date(matchDateTime.getTime() - tzOffset * 60000)
      
      const matchData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: correctedDateTime.toISOString(), // ISO string zawsze używa UTC (Z)
        isParticipant: isParticipant,
        position: selectedPosition,
      }

      console.log("Wysyłanie daty:", correctedDateTime.toISOString()) // debug
      await createMatch(matchData, token)

      setSuccess("Mecz został pomyślnie utworzony!")

      // Resetuj formularz po udanym utworzeniu
      setFormData({
        title: "",
        description: "",
        location: "",
      })
      setSelectedDate("")

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
            <MatchBasicInfo formData={formData} handleInputChange={handleInputChange} />
            
            <MatchDateTimePicker 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              setError={setError}
            />
            
            <ParticipationSection 
              isParticipant={isParticipant}
              setIsParticipant={setIsParticipant}
              selectedPosition={selectedPosition}
              setSelectedPosition={setSelectedPosition}
            />
          </div>

          <div className="flex justify-center mb-30">
            <ButtonPrimary type={"submit"} text={loading ? "Tworzenie..." : "Stwórz mecz"} disabled={loading} />
          </div>
        </form>
      </div>
      <Footer/>
    </>
  )
}

export default CreateMatch