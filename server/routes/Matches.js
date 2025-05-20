const express = require("express");
const router = express.Router();
const { Match, Participant } = require("../models");
const { Op } = require("sequelize");
const verifyToken = require("../middleware/verifyToken");

// GET /matches - tylko mecze, które jeszcze się nie odbyły
router.get("/", verifyToken ,async (req, res) => {
  try {
    const now = new Date();
    const matches = await Match.findAll({
      where: {
        date: {
          [Op.gt]: now, // tylko mecze z datą większą niż teraz
        },
      },
      order: [["date", "ASC"]], // opcjonalnie: sortuj rosnąco po dacie
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas pobierania meczów",
      details: error.message,
    });
  }
});

// POST /matches - tworzy nowy mecz i ewentualnie dodaje uczestnika
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, location, date, isParticipant, position } = req.body;
    const createdBy = req.user.id;

    if (!title || !location || !date) {
      return res.status(400).json({ error: "Brakuje wymaganych danych" });
    }

    const newMatch = await Match.create({
      title,
      description,
      location,
      date,
      createdBy,
    });

    if (isParticipant) {
      if (!position) {
        return res.status(400).json({ error: "Pozycja jest wymagana, jeśli chcesz być uczestnikiem." });
      }

      // Upewnij się, że masz model Participant zaimportowany
      await Participant.create({
        matchId: newMatch.id,
        userId: createdBy,
        position,
      });
    }

    res.status(201).json(newMatch);
  } catch (error) {
    console.error("Błąd tworzenia meczu:", error);
    res.status(500).json({
      error: "Błąd podczas tworzenia meczu",
      details: error.message,
    });
  }
});


module.exports = router;
