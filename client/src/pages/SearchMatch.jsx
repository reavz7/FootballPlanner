"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilterBar from "../components/FilterBar";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import {
  getAvailableMatches,
  joinMatch,
  getMatchParticipants,
} from "../services/api";
import MatchDetailsModal from "../components/MatchDetailsModal";

const SearchMatch = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantCounts, setParticipantCounts] = useState({});

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userDetails = localStorage.getItem("user");

    if (!authToken) {
      setError("Musisz być zalogowany, aby przeglądać dostępne mecze!");
      navigate("/login");
      return;
    }

    setToken(authToken);

    if (userDetails) {
      try {
        const user = JSON.parse(userDetails);
        setUserId(user.id);
        fetchAvailableMatches(user.id, authToken);
      } catch (err) {
        setError("Błąd przetwarzania danych użytkownika");
        console.error("Błąd przetwarzania danych użytkownika:", err);
      }
    } else {
      setError("Brak danych użytkownika");
    }
  }, [navigate]);

  // Fetch available matches function
  const fetchAvailableMatches = async (uid, authToken) => {
    try {
      setLoading(true);
      const availableMatches = await getAvailableMatches(uid, authToken);

      // Format data for display
      const formattedMatches = availableMatches.map((match) => ({
        id: match.id,
        name: match.title,
        description: match.description || "Brak opisu",
        location: match.location,
        date: new Date(match.date).toISOString().split("T")[0],
        time: new Date(match.date).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        maxParticipants: match.maxParticipants || 30,
        createdBy: match.createdBy,
      }));

      setMatches(formattedMatches);
      setFilteredMatches(formattedMatches);
      
      // Fetch participant counts for each match
      const counts = {};
      for (const match of formattedMatches) {
        try {
          const matchParticipants = await getMatchParticipants(match.id, authToken);
          counts[match.id] = matchParticipants.length;
        } catch (err) {
          console.error(`Błąd pobierania uczestników dla meczu ${match.id}:`, err);
          counts[match.id] = 0;
        }
      }
      
      setParticipantCounts(counts);
      setError("");
    } catch (err) {
      setError(err.message || "Nie udało się pobrać dostępnych meczów");
      console.error("Błąd pobierania dostępnych meczów:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filtered) => {
    setFilteredMatches(filtered);
  };

  const getParticipantColor = (count) => {
    if (count < 10) return "text-green-500";
    if (count >= 10 && count < 20) return "text-orange-500";
    return "text-red-500";
  };

  const handleJoinMatch = (matchId) => {
    setSelectedMatchId(matchId);
    setShowPositionModal(true);
  };

  const confirmJoinMatch = async () => {
    if (!selectedMatchId) return;

    try {
      setLoading(true);
      await joinMatch(selectedMatchId, selectedPosition, token);

      setSuccess("Dołączono do meczu pomyślnie!");
      setSelectedPosition("");
      setShowPositionModal(false);

      fetchAvailableMatches(userId, token);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Nie udało się dołączyć do meczu");
    } finally {
      setLoading(false);
    }
  };

  // Function to view match details
  const handleViewDetails = async (matchId) => {
    try {
      setLoading(true);
      const matchData = matches.find((m) => m.id === matchId);

      const matchParticipants = await getMatchParticipants(matchId, token);

      setMatchDetails(matchData);
      setParticipants(matchParticipants);
      setShowDetailsModal(true);
      setError("");
    } catch (err) {
      setError(err.message || "Nie udało się pobrać szczegółów meczu");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("pl-PL", options);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <main className="flex-grow py-16 px-4 pt-42">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-white text-4xl uppercase font-medium mb-2">
              Wyszukaj mecz
            </h1>
            <p className="text-white italic tracking-widest mb-3">
              Dołącz, pokaż się
            </p>
            <div className="flex justify-center">
              <div className="border-b border-white w-24 mb-4"></div>
            </div>
          </header>

          {error && (
            <div className="mb-6">
              <ErrorAlert text={error} />
            </div>
          )}

          {success && (
            <div className="mb-6">
              <SuccessAlert text={success} />
            </div>
          )}

          {/* Filter component */}
          <FilterBar matches={matches} onFilter={handleFilter} />

          {/* Matches list */}
          <div className="mt-8 space-y-6">
            {loading ? (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <p className="text-white text-lg">
                  Ładowanie dostępnych meczów...
                </p>
              </div>
            ) : filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-900 rounded-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <h2 className="text-white text-xl font-semibold mb-2">
                          {match.name}
                        </h2>
                        <p className="text-gray-400 mb-4">
                          {match.description}
                        </p>

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
                            <span
                              className={`font-semibold ${getParticipantColor(
                                participantCounts[match.id] || 0
                              )}`}
                            >
                              {participantCounts[match.id] || 0} / {match.maxParticipants}{" "}
                              uczestników
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6 flex items-between justify-center flex-col gap-4">
                        <button
                          className="p-4  bg-blue-500"
                          onClick={() => handleJoinMatch(match.id)}
                        >
                          DOŁĄCZ DO MECZU
                        </button>
                        <button
                          className="p-4 bg-red-400"
                          onClick={() => handleViewDetails(match.id)}
                        >
                          SZCZEGÓŁY
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-900 rounded-lg p-8 text-center">
                <p className="text-white text-lg">
                  Nie znaleziono meczów spełniających kryteria wyszukiwania
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Position Selection Modal */}
      {showPositionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-semibold mb-4">
              Wybierz swoją pozycję
            </h3>

            <div className="mb-4">
              <select
                className="w-full bg-gray-800 text-white p-3 rounded-md"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                <option value="">Wybierz pozycję (opcjonalnie)</option>
                <option value="bramkarz">Bramkarz</option>
                <option value="obrońca">Obrońca</option>
                <option value="pomocnik">Pomocnik</option>
                <option value="napastnik">Napastnik</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-white rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => {
                  setShowPositionModal(false);
                  setSelectedPosition("");
                }}
              >
                Anuluj
              </button>
              <button
                className="px-4 py-2 text-black rounded-md bg-white hover:bg-gray-200 transition-colors font-semibold"
                onClick={confirmJoinMatch}
                disabled={loading}
              >
                {loading ? "Dołączanie..." : "Dołącz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Match Details Modal*/}
      {showDetailsModal && matchDetails && (
        <MatchDetailsModal
          match={matchDetails}
          participants={participants}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default SearchMatch;