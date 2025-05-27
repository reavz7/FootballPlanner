"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticipantsModal from "../components/ParticipantsModal";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import {
  MapPin,
  Users,
  Calendar,
  Clock,
  Edit,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
// Import API functions - you'll need to implement these
// import { getUserCreatedMatches, deleteMatch, updateMatch, getMatchParticipants } from "../services/api"

const ManageMatches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [participantCounts, setParticipantCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [currentMatchTitle, setCurrentMatchTitle] = useState("");

  // Edit modal data
  const [editingMatch, setEditingMatch] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
  });

  // Delete confirmation
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Musisz być zalogowany!");
      navigate("/login");
      return;
    }
    fetchUserMatches();
  }, [navigate]);

  const fetchUserMatches = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await getUserCreatedMatches(token)

      // Mock data for development
      const mockMatches = [
        {
          id: 1,
          title: "Mecz piłki nożnej",
          description: "Przyjacielski mecz w sobotę",
          location: "Orlik Centrum",
          date: "2025-06-01T14:00:00Z",
          createdAt: "2025-05-20T10:00:00Z",
        },
        {
          id: 2,
          title: "Turniej lokalny",
          description: "Zawody o puchar burmistrza",
          location: "Stadion miejski",
          date: "2025-06-15T16:30:00Z",
          createdAt: "2025-05-22T15:30:00Z",
        },
      ];

      setMatches(mockMatches);

      // Fetch participant counts for each match
      const counts = {};
      for (const match of mockMatches) {
        try {
          // Replace with actual API call
          // const matchParticipants = await getMatchParticipants(match.id, token)
          // counts[match.id] = matchParticipants.length
          counts[match.id] = Math.floor(Math.random() * 20) + 1; // Mock data
        } catch (err) {
          console.error(
            `Błąd pobierania uczestników dla meczu ${match.id}:`,
            err
          );
          counts[match.id] = 0;
        }
      }

      setParticipantCounts(counts);
    } catch (error) {
      console.error("Błąd podczas pobierania meczów:", error);
      setError("Nie udało się pobrać listy meczów");
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    const matchDate = new Date(match.date);
    setEditFormData({
      title: match.title,
      description: match.description || "",
      location: match.location,
      date: matchDate.toISOString().split("T")[0],
      time: matchDate.toTimeString().slice(0, 5),
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editFormData.title || !editFormData.location || !editFormData.date) {
      setError("Tytuł, lokalizacja i data są wymagane!");
      return;
    }

    const now = new Date();
    const selected = new Date(`${editFormData.date}T${editFormData.time}`);
    if (selected < now) {
      setError("Nie możesz wybrać daty i czasu, które już minęły!");
      return;
    }

    try {
      setEditLoading(true);
      const token = localStorage.getItem("authToken");

      const dateTimeString = `${editFormData.date}T${editFormData.time}:00`;
      const matchDateTime = new Date(dateTimeString);

      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        location: editFormData.location,
        date: matchDateTime.toISOString(),
      };

      // Replace with actual API call
      // await updateMatch(editingMatch.id, updateData, token)

      // Update local state
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id === editingMatch.id ? { ...match, ...updateData } : match
        )
      );

      setSuccess("Mecz został pomyślnie zaktualizowany!");
      setEditModalOpen(false);
      setEditingMatch(null);
    } catch (error) {
      setError(error.message || "Wystąpił błąd podczas aktualizacji meczu");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteMatch = (match) => {
    setMatchToDelete(match);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!matchToDelete) return;

    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("authToken");

      // Replace with actual API call
      // await deleteMatch(matchToDelete.id, token)

      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.id !== matchToDelete.id)
      );

      setSuccess("Mecz został pomyślnie usunięty!");
      setDeleteModalOpen(false);
      setMatchToDelete(null);
    } catch (error) {
      setError(error.message || "Wystąpił błąd podczas usuwania meczu");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShowParticipants = async (matchId, matchTitle) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      // Replace with actual API call
      // const participants = await getMatchParticipants(matchId, token)

      // Mock data
      const mockParticipants = [
        { id: 1, User: { username: "Jan Kowalski" }, position: "atak" },
        { id: 2, User: { username: "Anna Nowak" }, position: "pomoc" },
        { id: 3, User: { username: "Piotr Wiśniewski" }, position: "obrona" },
      ];

      setCurrentParticipants(mockParticipants);
      setCurrentMatchTitle(matchTitle);
      setParticipantsModalOpen(true);
    } catch (error) {
      console.error("Nie udało się pobrać uczestników:", error);
      setError("Nie udało się pobrać listy uczestników");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <main className="flex-grow py-16 px-4 pt-42">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-white text-4xl uppercase font-medium mb-2">
              Zarządzaj meczami
            </h1>
            <p className="text-white italic tracking-widest mb-3">
              Twoje utworzone mecze
            </p>
            <div className="flex justify-center">
              <div className="border-b border-white w-24 mb-4"></div>
            </div>
          </header>

          {success && (
            <div className="mb-4">
              <SuccessAlert text={success} />
            </div>
          )}

          {error && (
            <div className="mb-4">
              <ErrorAlert text={error} />
            </div>
          )}

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
                    <div
                      key={match.id}
                      className="p-6 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                              {match.title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-300 mb-2">
                              <Calendar size={16} />
                              <span>
                                {formatDate(match.date)} -{" "}
                                {formatTime(match.date)}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditMatch(match)}
                              className="flex items-center gap-1 bg-blue-900/60 hover:bg-blue-800 text-blue-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Edit size={16} />
                              <span>Edytuj</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMatch(match)}
                              className="flex items-center gap-1 bg-red-900/60 hover:bg-red-800 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Trash2 size={16} />
                              <span>Usuń</span>
                            </button>
                          </div>
                        </div>

                        {match.description && (
                          <p className="text-gray-300 text-sm">
                            {match.description}
                          </p>
                        )}

                        <div className="flex flex-wrap justify-center sm:justify-start gap-8">
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-blue-800 flex items-center justify-center mb-2">
                              <Users size={24} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-medium mb-2">
                              {participantCounts[match.id] || 0} graczy
                            </span>
                            <button
                              onClick={() =>
                                handleShowParticipants(match.id, match.title)
                              }
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-white text-2xl font-semibold">Edytuj mecz</h2>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingMatch(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Tytuł meczu *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Opis
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Lokalizacja *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Data *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Godzina *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={editFormData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingMatch(null);
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {editLoading ? "Aktualizowanie..." : "Zaktualizuj mecz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-md shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-900/60 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-semibold">
                    Usuń mecz
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Ta akcja jest nieodwracalna
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Czy na pewno chcesz usunąć mecz "{matchToDelete?.title}"?
                Wszyscy uczestnicy zostaną automatycznie wypisani.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setMatchToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? "Usuwanie..." : "Usuń mecz"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      <ParticipantsModal
        isOpen={participantsModalOpen}
        onClose={() => setParticipantsModalOpen(false)}
        participants={currentParticipants}
        matchTitle={currentMatchTitle}
      />

      <Footer />
    </div>
  );
};

export default ManageMatches;
