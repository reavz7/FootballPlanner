"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ParticipantsModal from "../components/ParticipantsModal"
import { MapPin, Users, Calendar, AlignJustify, X, Clock, CheckCircle } from "lucide-react"
import { getUserMatches, cancelMatchParticipation, getMatchParticipants } from "../services/api"

const MatchHistory = () => {
  const [matches, setMatches] = useState([])
  const [participantCounts, setParticipantCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentParticipants, setCurrentParticipants] = useState([])
  const [currentMatchTitle, setCurrentMatchTitle] = useState("")
  
  
  const [showCompleted, setShowCompleted] = useState(true)
  const [showUpcoming, setShowUpcoming] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("authToken")

      try {
        setLoading(true)
        const response = await getUserMatches(token)
        console.log("Dane pobrane z API:", response)

        const normalizedMatches = response.map((match) => ({
          ...match,
          position: match.position ? match.position.toLowerCase() : match.position,
        }))

        setMatches(normalizedMatches)

        
        const counts = {}
        for (const match of normalizedMatches) {
          try {
            const matchParticipants = await getMatchParticipants(match.id, token)
            counts[match.id] = matchParticipants.length
          } catch (err) {
            console.error(`Błąd pobierania uczestników dla meczu ${match.id}:`, err)
            counts[match.id] = 0
          }
        }

        setParticipantCounts(counts)
      } catch (error) {
        console.error("Błąd podczas pobierania meczów:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  
  const getFilteredMatches = () => {
    return matches.filter(match => {
      if (!showCompleted && match.isPast) return false
      if (!showUpcoming && !match.isPast) return false
      return true
    })
  }

  const filteredMatches = getFilteredMatches()

  const getPositionName = (position) => {
    const positions = {
      atak: "Atak",
      pomoc: "Pomoc",
      obrona: "Obrona",
      bramkarz: "Bramkarz",
    }
    return positions[position] || "Nieokreślona"
  }

  const getPositionColor = (position) => {
    const colors = {
      atak: "bg-red-500",
      pomoc: "bg-blue-500",
      obrona: "bg-green-500",
      bramkarz: "bg-yellow-500",
    }
    return colors[position] || "bg-gray-500"
  }

  const getStatusBadge = (isPast) => {
    if (isPast) {
      return (
        <div className="flex items-center gap-1 bg-green-900/60 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
          <CheckCircle size={14} />
          <span>Zakończony</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 bg-blue-900/60 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
          <Clock size={14} />
          <span>Do rozegrania</span>
        </div>
      )
    }
  }

  const handleCancelParticipation = async (matchId) => {
    const token = localStorage.getItem("authToken")

    try {
      await cancelMatchParticipation(token, matchId)
      setMatches((prevMatches) => prevMatches.filter((match) => match.id !== matchId))
      console.log("Uczestnictwo anulowane dla meczu:", matchId)
    } catch (error) {
      console.error("Nie udało się anulować uczestnictwa:", error)
    }
  }

  const handleShowParticipants = async (matchId, matchTitle) => {
    const token = localStorage.getItem("authToken")

    try {
      const participants = await getMatchParticipants(matchId, token)
      setCurrentParticipants(participants)
      setCurrentMatchTitle(matchTitle)
      setModalOpen(true)
      console.log((participants))
    } catch (error) {
      console.error("Nie udało się pobrać uczestników:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <main className="flex-grow py-16 px-4 pt-42">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-white text-4xl uppercase font-medium mb-2">Twoje mecze</h1>
            <p className="text-white italic tracking-widest mb-3">Przyszłość i przeszłość</p>
            <div className="flex justify-center">
              <div className="border-b border-white w-24 mb-4"></div>
            </div>
          </header>

          {/* Sekcja filtrów */}
          <div className="bg-gray-800 rounded-xl mb-6 p-4 border border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <span className="text-white font-medium">Filtruj mecze:</span>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <CheckCircle size={16} className="text-green-400" />
                  <span>Zakończone</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUpcoming}
                    onChange={(e) => setShowUpcoming(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <Clock size={16} className="text-blue-400" />
                  <span>Do rozegrania</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
              <h2 className="text-white font-medium">Wszystkie twoje mecze</h2>
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                {filteredMatches.length} mecz{filteredMatches.length !== 1 ? "e" : ""}
              </span>
            </div>

            <div className="max-h-[65vh] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Ładowanie meczów...</div>
              ) : filteredMatches.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  {matches.length === 0 
                    ? "Brak historii meczów do wyświetlenia"
                    : "Brak meczów spełniających wybrane kryteria filtrowania"
                  }
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredMatches.map((match, index) => (
                    <div key={index} className="p-6 hover:bg-gray-700/50 transition-colors">
                      <div className="flex flex-col space-y-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-yellow-400 mb-2">{match.title}</h3>
                            <div className="flex items-center gap-2 text-gray-300 mb-2">
                              <Calendar size={16} />
                              <span>{match.date}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div>{getStatusBadge(match.isPast)}</div>
                            {!match.isPast && (
                              <button
                                onClick={() => handleCancelParticipation(match.id)}
                                className="flex items-center gap-1 cursor-pointer bg-red-900/60 hover:bg-red-800 text-red-300 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                              >
                                <X size={14} />
                                <span>Anuluj uczestnictwo</span>
                              </button>
                            )}
                            <div></div>
                          </div>
                        </div>

                        {/* Description if available */}
                        {match.description && (
                          <div className="flex items-start gap-2">
                            <AlignJustify size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">{match.description}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap justify-center sm:justify-start gap-8">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center mb-2">
                              <Users size={24} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-medium mb-2">
                              {participantCounts[match.id] || 0}{" "}
                             graczy
                            </span>
                            <button
                              onClick={() => handleShowParticipants(match.id, match.title)}
                              className="flex items-center gap-2 cursor-pointer bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                            >
                              <span>Poznaj uczestników</span>
                            </button>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center ${getPositionColor(
                                match.position,
                              )} text-white font-bold text-xl mb-2`}
                            >
                              {match.position === "atak"
                                ? "A"
                                : match.position === "pomoc"
                                  ? "P"
                                  : match.position === "bramkarz"
                                    ? "B"
                                    : "O"}
                            </div>
                            <span className="text-white text-sm font-medium">{getPositionName(match.position)}</span>
                          </div>

                          <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-violet-800 flex items-center justify-center mb-2">
                              <MapPin size={24} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-medium max-w-40">{match.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ParticipantsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        participants={currentParticipants}
        matchTitle={currentMatchTitle}
      />

      <Footer />
    </div>
  )
}

export default MatchHistory