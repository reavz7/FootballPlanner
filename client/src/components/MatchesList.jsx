import MatchCard from "./MatchCard";

const MatchesList = ({ 
  matches, 
  participantCounts, 
  loading, 
  onEditMatch, 
  onDeleteMatch, 
  onShowParticipants 
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div className="p-4 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
        <h2 className="text-white font-medium">Twoje mecze</h2>
        <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
          {matches.length} mecz{matches.length !== 1 ? "e" : ""}
        </span>
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Ładowanie meczów...
          </div>
        ) : matches.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Nie masz jeszcze utworzonych meczów
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                participantCount={participantCounts[match.id]}
                onEdit={onEditMatch}
                onDelete={onDeleteMatch}
                onShowParticipants={onShowParticipants}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesList;