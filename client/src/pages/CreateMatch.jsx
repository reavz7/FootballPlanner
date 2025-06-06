"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ButtonPrimary from "../components/ButtonPrimary";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";
import { createMatch } from "../services/api";
import MatchBasicInfo from "../components/MatchBasicInfo";
import MatchDateTimePicker from "../components/MatchDateTimePicker";
import ParticipationSection from "../components/ParticipationSection";

const CreateMatch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isParticipant, setIsParticipant] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");

    

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedDate) {
      setError("Wybierz datę meczu!");
      return;
    }

    if (!formData.title || !formData.location) {
      setError("Tytuł i lokalizacja są wymagane!");
      return;
    }

    const now = new Date();
    const selected = new Date(`${selectedDate}T${selectedTime}`);
    if (selected < now) {
      setError("Nie możesz wybrać daty i czasu, które już minęły!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");


      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      const matchDateTime = new Date(dateTimeString);

      const matchData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: matchDateTime.toISOString(),
        isParticipant: isParticipant,
        position: selectedPosition,
      };

      console.log("Wysyłanie daty:", matchDateTime.toISOString());
      await createMatch(matchData, token);

      setSuccess("Mecz został pomyślnie utworzony!");

      setFormData({
        title: "",
        description: "",
        location: "",
      });
      setSelectedDate("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.message || "Wystąpił błąd podczas tworzenia meczu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-42 bg-black min-h-screen ">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white text-4xl text-center uppercase font-medium mb-2">
            Stwórz mecz, zacznij wygrywać.
          </h1>
          <p className="text-white text-center italic tracking-widest mb-1.5">
            Prosto i szybko.
          </p>
          <div className="flex justify-center">
            <div className="border-b border-white w-24 mb-12"></div>
          </div>
        </div>

        {success && (
          <div className="max-w-5xl mx-auto mb-4">
            <SuccessAlert text={success} />
          </div>
        )}

        {error && (
          <div className="max-w-5xl mx-auto mb-4">
            <ErrorAlert text={error} />
          </div>
        )}

        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="lg:grid sm:grid-cols-3 gap-12 w-full max-w-5xl mb-8 flex flex-col justify-center items-center lg:items-start">
            <MatchBasicInfo
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <MatchDateTimePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              setError={setError}
            />

            <ParticipationSection
              isParticipant={isParticipant}
              setIsParticipant={setIsParticipant}
              selectedPosition={selectedPosition}
              setSelectedPosition={setSelectedPosition}
            />
          </div>

          <div className="flex justify-center mb-30">
            <ButtonPrimary
              type={"submit"}
              text={loading ? "Tworzenie..." : "Stwórz mecz"}
              disabled={loading}
            />
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateMatch;