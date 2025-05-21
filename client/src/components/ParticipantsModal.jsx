"use client"

import { X } from "lucide-react"
import { useEffect, useRef } from "react"

const ParticipantsModal = ({ isOpen, onClose, participants, matchTitle }) => {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Group participants by position
  const groupedParticipants = {
    bramkarz: participants?.filter((p) => p.position === "bramkarz") || [],
    obrona: participants?.filter((p) => p.position === "obrona") || [],
    pomoc: participants?.filter((p) => p.position === "pomoc") || [],
    atak: participants?.filter((p) => p.position === "atak") || [],
    brak: participants?.filter((p) => p.position === null) || [],
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        <div className="p-3 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-white font-medium">Uczestnicy meczu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Zamknij">
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">{matchTitle}</h3>

          <div className="overflow-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Bramkarze (Goalkeepers) */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider border-b border-gray-600 pb-1">
                  Bramkarze
                </h4>
                {groupedParticipants.bramkarz.length > 0 ? (
                  <ul className="space-y-2">
                    {groupedParticipants.bramkarz.map((participant, index) => (
                      <li key={`gk-${index}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center flex-shrink-0"></div>
                        <span className="text-white text-sm">{participant.User?.username || "Użytkownik"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm py-2">Brak bramkarzy</p>
                )}
              </div>

              {/* Obrońcy (Defenders) */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider border-b border-gray-600 pb-1">
                  Obrońcy
                </h4>
                {groupedParticipants.obrona.length > 0 ? (
                  <ul className="space-y-2">
                    {groupedParticipants.obrona.map((participant, index) => (
                      <li key={`def-${index}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0"></div>
                        <span className="text-white text-sm">{participant.User?.username || "Użytkownik"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm py-2">Brak obrońców</p>
                )}
              </div>

              {/* Pomocnicy (Midfielders) */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider border-b border-gray-600 pb-1">
                  Pomocnicy
                </h4>
                {groupedParticipants.pomoc.length > 0 ? (
                  <ul className="space-y-2">
                    {groupedParticipants.pomoc.map((participant, index) => (
                      <li key={`mid-${index}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-800 flex items-center justify-center flex-shrink-0"></div>
                        <span className="text-white text-sm">{participant.User?.username || "Użytkownik"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm py-2">Brak pomocników</p>
                )}
              </div>

              {/* Napastnicy (Attackers) */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider border-b border-gray-600 pb-1">
                  Napastnicy
                </h4>
                {groupedParticipants.atak.length > 0 ? (
                  <ul className="space-y-2">
                    {groupedParticipants.atak.map((participant, index) => (
                      <li key={`att-${index}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center flex-shrink-0"></div>
                        <span className="text-white text-sm">{participant.User?.username || "Użytkownik"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm py-2">Brak napastników</p>
                )}
              </div>

              {/* Brak pozycji (No position) */}
              <div className="bg-gray-700/50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider border-b border-gray-600 pb-1">
                  Brak pozycji
                </h4>
                {groupedParticipants.brak.length > 0 ? (
                  <ul className="space-y-2">
                    {groupedParticipants.brak.map((participant, index) => (
                      <li key={`none-${index}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"></div>
                        <span className="text-white text-sm">{participant.User?.username || "Użytkownik"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm py-2">Brak uczestników</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-700 border-t border-gray-600 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParticipantsModal
