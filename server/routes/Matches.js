const express = require("express");
const router = express.Router();
const { Match } = require("../models");
const { Op } = require("sequelize");

// GET /matches - tylko mecze, które jeszcze się nie odbyły
router.get("/", async (req, res) => {
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

// POST /matches - tworzy nowy mecz
router.post("/", async (req, res) => {
  try {
    const { title, description, location, date, createdBy } = req.body;

    if (!title || !location || !date || !createdBy) {
      return res.status(400).json({ error: "Brakuje wymaganych danych" });
    }

    const newMatch = await Match.create({
      title,
      description,
      location,
      date,
      createdBy,
    });

    res.status(201).json(newMatch);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas tworzenia meczu",
      details: error.message,
    });
  }
});

module.exports = router;
