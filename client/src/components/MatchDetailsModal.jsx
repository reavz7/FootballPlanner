"use client";

import { X, MapPin, Calendar, Clock, Users, User } from "lucide-react";

const MatchDetailsModal = ({ match, participants, onClose }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("pl-PL", options);
  };

  // Group participants by position
  const groupedParticipants = participants.reduce((acc, participant) => {
    const position = participant.position || "Brak pozycji";
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(participant);
    return acc;
  }, {});

  // Pozycje w preferowanej kolejności
  const positionOrder = [
    "bramkarz",
    "obrońca",
    "pomocnik",
    "napastnik",
    "Brak pozycji",
  ];

  // Sortuj klucze według preferowanej kolejności
  const sortedPositions = Object.keys(groupedParticipants).sort(
    (a, b) => positionOrder.indexOf(a) - positionOrder.indexOf(b)
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header z przyciskiem zamknięcia */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-gray-900 dark:text-white text-2xl font-semibold">
            {match.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Szczegóły meczu */}
        <div className="p-6">
          {/* Opis */}
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-white text-lg font-medium mb-2">
              Opis
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {match.description}
            </p>
          </div>

          {/* Informacje o meczu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <MapPin className="h-5 w-5 mr-3 text-gray-900 dark:text-white" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lokalizacja
                </p>
                <p className="text-gray-900 dark:text-white">
                  {match.location}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Calendar className="h-5 w-5 mr-3 text-gray-900 dark:text-white" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Data</p>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(match.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Clock className="h-5 w-5 mr-3 text-gray-900 dark:text-white" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Godzina
                </p>
                <p className="text-gray-900 dark:text-white">{match.time}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Users className="h-5 w-5 mr-3 text-gray-900 dark:text-white" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uczestnicy
                </p>
                <p className="text-gray-900 dark:text-white">
                  {participants.length} / 30
                </p>
              </div>
            </div>
          </div>

          {/* Lista uczestników */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-medium mb-4">
              Uczestnicy
            </h3>

            {participants.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                Brak potwierdzonych uczestników
              </p>
            ) : (
              <div className="space-y-4">
                {sortedPositions.map((position) => (
                  <div
                    key={position}
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
                  >
                    <h4 className="text-gray-900 dark:text-white font-medium mb-2 capitalize">
                      {position === "bramkarz" && "Bramkarze"}
                      {position === "obrona" && "Obrońcy"}
                      {position === "pomoc" && "Pomocnicy"}
                      {position === "atak" && "Napastnicy"}
                    </h4>
                    <ul className="space-y-2">
                      {groupedParticipants[position].map((participant) => (
                        <li
                          key={participant.id}
                          className="flex items-center text-gray-700 dark:text-gray-300"
                        >
                          <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                          <span>
                            {participant.User?.username || "Użytkownik"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Przycisk zamknięcia na dole */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white dark:bg-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsModal;
