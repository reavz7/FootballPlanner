const express = require("express"); 
const router = express.Router();
const { Match, Participant, User } = require("../models");
const verifyToken = require("../middleware/verifyToken");

// GET /participants/match/:matchId - zwraca uczestników meczu
router.get("/match/:matchId", verifyToken, async (req, res) => {
  try {
    const { matchId } = req.params;

    const participants = await Participant.findAll({
      where: {
        matchId,
        isConfirmed: true,
      },
      include: {
        model: User,
        attributes: ["id", "username"],
      },
    });

    res.json(participants);
  } catch (error) {
    console.error("Błąd pobierania uczestników meczu:", error);
    res.status(500).json({
      error: "Błąd pobierania uczestników",
      details: error.message,
    });
  }
});

// POST /participants - dołączanie użytkownika do meczu
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId, position } = req.body;

    if (!matchId) {
      return res.status(400).json({ error: "Brakuje matchId w body" });
    }

    // Sprawdź, czy uczestnik już istnieje w meczu
    const existing = await Participant.findOne({ where: { userId, matchId } });

    if (existing) {
      if (existing.isConfirmed) {
        return res.status(400).json({ error: "Użytkownik już dołączył do tego meczu" });
      }

      // Użytkownik wcześniej wyszedł, więc aktualizujemy rekord
      existing.isConfirmed = true;
      if (position) existing.position = position;
      await existing.save();

      return res.status(200).json({ message: "Powrócono do meczu", participant: existing });
    }

    // Tworzymy nowy rekord
    const participant = await Participant.create({
      userId,
      matchId,
      position: position || null,
      isConfirmed: true, // od razu potwierdzony, skoro dołącza
    });

    res.status(201).json({ message: "Dołączono do meczu", participant });
  } catch (error) {
    console.error("Błąd dołączania do meczu:", error);
    res.status(500).json({
      error: "Błąd dołączania do meczu",
      details: error.message,
    });
  }
});


module.exports = router;
