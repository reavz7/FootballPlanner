import { Calendar, Users, MapPin, Edit, Trash2 } from "lucide-react";

const MatchCard = ({ 
  match, 
  participantCount, 
  onEdit, 
  onDelete, 
  onShowParticipants 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 hover:bg-gray-700/50 transition-colors">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">
              {match.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Calendar size={16} />
              <span>
                {formatDate(match.date)} - {formatTime(match.date)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(match)}
              className="flex items-center gap-1 bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Edit size={16} />
              <span>Edytuj</span>
            </button>
            <button
              onClick={() => onDelete(match)}
              className="flex items-center gap-1 bg-red-900/60 hover:bg-red-800 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
              <span>Usuń</span>
            </button>
          </div>
        </div>

        {match.description && (
          <p className="text-gray-300 text-sm">{match.description}</p>
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
              <span>Zobacz uczestników</span>
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-violet-800 flex items-center justify-center mb-2">
              <MapPin size={24} className="text-white" />
            </div>
            <span className="text-white text-sm font-medium max-w-40">
              {match.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;