"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ParticipantsModal from "../components/ParticipantsModal"
import MatchFilters from "../components/MatchFilters"
import MatchesContainer from "../components/MatchesCointainer"
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

          <MatchFilters 
            showCompleted={showCompleted}
            setShowCompleted={setShowCompleted}
            showUpcoming={showUpcoming}
            setShowUpcoming={setShowUpcoming}
          />

          <MatchesContainer
            loading={loading}
            filteredMatches={filteredMatches}
            matches={matches}
            participantCounts={participantCounts}
            onCancelParticipation={handleCancelParticipation}
            onShowParticipants={handleShowParticipants}
          />
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