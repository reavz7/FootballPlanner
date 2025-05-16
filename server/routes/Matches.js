const express = require("express");
const router = express.Router();
const { Match } = require("../models");

// GET /matches - zwraca wszystkie mecze
router.get("/", async (req, res) => {
  try {
    const matches = await Match.findAll();
    res.json(matches);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas pobierania meczów",
      details: error.message,
    });
  }
});

module.exports = router;
