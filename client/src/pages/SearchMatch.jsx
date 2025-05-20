"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FilterBar from "../components/FilterBar"
import { MapPin, Users, Calendar, Clock } from "lucide-react"
import ButtonPrimary from "../components/ButtonPrimary"
import ButtonSecondary from "../components/ButtonSecondary"

const SearchMatch = () => {
  // Test match data
  const testMatches = [
    {
      id: 1,
      name: "Mecz towarzyski - Mokotów",
      description: "Przyjazny mecz dla wszystkich poziomów zaawansowania",
      location: "Boisko OSiR Mokotów, Warszawa",
      date: "2025-05-25",
      time: "18:00",
      participants: 8,
      maxParticipants: 30,
    },
    {
      id: 2,
      name: "Liga amatorska - Ursynów",
      description: "Rozgrywki ligowe dla amatorów, poziom średnio-zaawansowany",
      location: "Orlik Ursynów, Warszawa",
      date: "2025-05-26",
      time: "19:30",
      participants: 16,
      maxParticipants: 30,
    },
    {
      id: 3,
      name: "Turniej weekendowy - Bemowo",
      description: "Weekendowy turniej z nagrodami, zapraszamy drużyny i pojedynczych graczy",
      location: "Stadion Bemowo, Warszawa",
      date: "2025-05-30",
      time: "10:00",
      participants: 24,
      maxParticipants: 30,
    },
    {
      id: 4,
      name: "Mecz międzyfirmowy - Centrum",
      description: "Mecz integracyjny między firmami z okolicy",
      location: "Boisko Centrum, Warszawa",
      date: "2025-06-01",
      time: "17:00",
      participants: 12,
      maxParticipants: 30,
    },
    {
      id: 5,
      name: "Mecz charytatywny - Wola",
      description: "Mecz na rzecz lokalnej fundacji, wpisowe 20zł",
      location: "Stadion Wola, Warszawa",
      date: "2025-06-05",
      time: "16:30",
      participants: 5,
      maxParticipants: 30,
    },
  ]

  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])

  // Initialize with test data
  useEffect(() => {
    setMatches(testMatches)
    setFilteredMatches(testMatches)
  }, [])

  // Function to handle filtering from FilterBar component
  const handleFilter = (filtered) => {
    setFilteredMatches(filtered)
  }

  // Function to determine participant count color
  const getParticipantColor = (count) => {
    if (count < 10) return "text-green-500"
    if (count >= 10 && count < 20) return "text-orange-500"
    return "text-red-500"
  }

  // Function to handle joining a match
  const handleJoinMatch = (matchId) => {
    console.log(`Dołączono do meczu o ID: ${matchId}`)
    alert(`Dołączono do meczu o ID: ${matchId}`)
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("pl-PL", options)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <main className="flex-grow py-16 px-4 pt-42">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-white text-4xl uppercase font-medium mb-2">Wyszukaj mecz</h1>
            <p className="text-white italic tracking-widest mb-3">Dołącz, pokaż się</p>
            <div className="flex justify-center">
              <div className="border-b border-white w-24 mb-4"></div>
            </div>
          </header>

          {/* Filter component */}
          <FilterBar matches={matches} onFilter={handleFilter} />

          {/* Matches list */}
          <div className="mt-8 space-y-6">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div key={match.id} className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <h2 className="text-white text-xl font-semibold mb-2">{match.name}</h2>
                        <p className="text-gray-400 mb-4">{match.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-gray-300">
                            <MapPin className="h-5 w-5 mr-2 text-white" />
                            <span>{match.location}</span>
                          </div>

                          <div className="flex items-center text-gray-300">
                            <Calendar className="h-5 w-5 mr-2 text-white" />
                            <span>{formatDate(match.date)}</span>
                          </div>

                          <div className="flex items-center text-gray-300">
                            <Clock className="h-5 w-5 mr-2 text-white" />
                            <span>{match.time}</span>
                          </div>

                          <div className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-white" />
                            <span className={`font-semibold ${getParticipantColor(match.participants)}`}>
                              {match.participants} / {match.maxParticipants} uczestników
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6 flex items-between justify-center flex-col gap-4">
                        <ButtonPrimary
                          text={"Dołącz do meczu"}
                          onClick={() => handleJoinMatch(match.id)}
                          className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          DOŁĄCZ DO MECZU     
                        </ButtonPrimary>
                        <ButtonSecondary
                          text={"Sczegóły meczu"}
                        ></ButtonSecondary>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <p className="text-white text-lg">Nie znaleziono meczów spełniających kryteria wyszukiwania</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SearchMatch
