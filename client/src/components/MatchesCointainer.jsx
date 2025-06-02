import MatchEditCard from "../components/MatchEditCard"

const MatchesContainer = ({ 
  loading, 
  filteredMatches, 
  matches, 
  participantCounts, 
  onCancelParticipation, 
  onShowParticipants 
}) => {
  return (
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
              <MatchEditCard
                key={index}
                match={match}
                participantCount={participantCounts[match.id]}
                onCancelParticipation={onCancelParticipation}
                onShowParticipants={onShowParticipants}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchesContainer