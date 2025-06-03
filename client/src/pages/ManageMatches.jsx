"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticipantsModal from "../components/ParticipantsModal";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import MatchesList from "../components/MatchesList";
import EditMatchModal from "../components/EditMatchModal";
import DeleteMatchModal from "../components/DeleteMatchModel";

import {
  getUserCreatedMatches,
  deleteMatch,
  updateMatch,
  getMatchParticipants,
} from "../services/api";

const ManageMatches = () => {
  const [matches, setMatches] = useState([]);
  const [participantCounts, setParticipantCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const [currentMatchTitle, setCurrentMatchTitle] = useState("");

  const [editingMatch, setEditingMatch] = useState(null);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchUserMatches();
  }, []);

  const fetchUserMatches = async () => {
    const token = localStorage.getItem("authToken");

    try {
      setLoading(true);
      setError("");

      const userMatches = await getUserCreatedMatches(token);
      setMatches(userMatches);

      const counts = {};
      for (const match of userMatches) {
        try {
          const matchParticipants = await getMatchParticipants(match.id, token);
          counts[match.id] = matchParticipants.length;
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
      setError(error.message || "Nie udało się pobrać listy meczów");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (formData) => {
    setError("");
    setSuccess("");

    if (!formData.title || !formData.location || !formData.date) {
      setError("Tytuł, lokalizacja i data są wymagane!");
      return;
    }

    const now = new Date();
    const selected = new Date(`${formData.date}T${formData.time}`);
    if (selected < now) {
      setError("Nie możesz wybrać daty i czasu, które już minęły!");
      return;
    }

    try {
      setEditLoading(true);
      const token = localStorage.getItem("authToken");

      const dateTimeString = `${formData.date}T${formData.time}:00`;
      const matchDateTime = new Date(dateTimeString);

      const updateData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: matchDateTime.toISOString(),
      };

      const updatedMatch = await updateMatch(
        editingMatch.id,
        updateData,
        token
      );

      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id === editingMatch.id ? updatedMatch : match
        )
      );

      setSuccess("Mecz został pomyślnie zaktualizowany!");
      setEditModalOpen(false);
      setEditingMatch(null);
    } catch (error) {
      console.error("Błąd podczas aktualizacji meczu:", error);
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

      await deleteMatch(matchToDelete.id, token);

      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.id !== matchToDelete.id)
      );

      setParticipantCounts((prevCounts) => {
        const newCounts = { ...prevCounts };
        delete newCounts[matchToDelete.id];
        return newCounts;
      });

      setSuccess("Mecz został pomyślnie usunięty!");
      setDeleteModalOpen(false);
      setMatchToDelete(null);
    } catch (error) {
      console.error("Błąd podczas usuwania meczu:", error);
      setError(error.message || "Wystąpił błąd podczas usuwania meczu");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShowParticipants = async (matchId, matchTitle) => {
    const token = localStorage.getItem("authToken");

    try {
      const participants = await getMatchParticipants(matchId, token);
      setCurrentParticipants(participants);
      setCurrentMatchTitle(matchTitle);
      setParticipantsModalOpen(true);
    } catch (error) {
      console.error("Nie udało się pobrać uczestników:", error);
      setError(error.message || "Nie udało się pobrać listy uczestników");
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingMatch(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setMatchToDelete(null);
  };

  const closeParticipantsModal = () => {
    setParticipantsModalOpen(false);
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col bg-black">
      <Navbar />

      <main className="flex-grow py-16 px-4 pt-42 min-h-screen">
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

          <MatchesList
            matches={matches}
            participantCounts={participantCounts}
            loading={loading}
            onEditMatch={handleEditMatch}
            onDeleteMatch={handleDeleteMatch}
            onShowParticipants={handleShowParticipants}
          />
        </div>
      </main>

      <EditMatchModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        match={editingMatch}
        onSubmit={handleEditSubmit}
        isLoading={editLoading}
      />

      <DeleteMatchModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        match={matchToDelete}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
      />

      <ParticipantsModal
        isOpen={participantsModalOpen}
        onClose={closeParticipantsModal}
        participants={currentParticipants}
        matchTitle={currentMatchTitle}
      />

      <Footer />
    </div>
  );
};

export default ManageMatches;
