import { MapPin, Users, Calendar, AlignJustify, X, Clock, CheckCircle } from "lucide-react"

const MatchEditCard = ({ 
  match, 
  participantCount, 
  onCancelParticipation, 
  onShowParticipants 
}) => {
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

  return (
    <div className="p-6 hover:bg-gray-700/50 transition-colors">
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
                onClick={() => onCancelParticipation(match.id)}
                className="flex items-center gap-1 cursor-pointer bg-red-900/60 hover:bg-red-800 text-red-300 px-3 py-1 rounded-full text-xs font-medium transition-colors"
              >
                <X size={14} />
                <span>Anuluj uczestnictwo</span>
              </button>
            )}
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
              {participantCount || 0} graczy
            </span>
            <button
              onClick={() => onShowParticipants(match.id, match.title)}
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
  )
}
    
export default MatchEditCard