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
        isConfirmed: 1
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


router.get("/participating", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const participatingMatches = await Match.findAll({
      include: [
        {
          model: Participant,
          where: { 
            userId,
            isConfirmed: true // tylko potwierdzeni uczestnicy - użytkownik
          },
          attributes: ['position'],
        },
        {
          model: Participant,
          where: {
            isConfirmed: true // liczymy tylko potwierdzonych uczestników ogólnie
          },
          attributes: ['id'],
        },
      ],
      order: [["date", "ASC"]],
    });

    const now = new Date();

    const response = participatingMatches.map(match => {
      const matchData = match.toJSON();

      const totalParticipants = matchData.Participants.length;

      const userPosition = matchData.Participants.length > 0 ?
        matchData.Participants[0].position : null;

      const matchDate = new Date(matchData.date);
      const formattedDate = matchDate.toLocaleString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const isPast = matchDate < now;

      return {
        ...matchData,
        date: formattedDate,
        position: userPosition,
        totalParticipants,
        isPast, // CZY MECZ JUŻ BYŁ
        Participants: undefined, // usuwamy pełną listę uczestników
      };
    });

    res.json(response);
  } catch (error) {
    console.error("Błąd podczas pobierania meczów użytkownika:", error);
    res.status(500).json({
      error: "Błąd podczas pobierania meczów użytkownika",
      details: error.message,
    });
  }
});

router.put("/:matchId/cancel-participation", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const matchId = req.params.matchId;

    // Sprawdzamy, czy użytkownik jest uczestnikiem tego meczu
    const participant = await Participant.findOne({
      where: {
        userId,
        matchId,
        isConfirmed: true // Możemy anulować tylko potwierdzone uczestnictwo
      }
    });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Nie jesteś uczestnikiem tego meczu lub twoje uczestnictwo zostało już anulowane"
      });
    }

    // Sprawdzamy, czy mecz już się nie rozpoczął
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Mecz nie istnieje"
      });
    }

    // Jeśli mecz już się odbył, nie pozwalamy na anulowanie
    if (new Date(match.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Nie możesz anulować uczestnictwa w meczu, który już się odbył"
      });
    }

    // Aktualizujemy status uczestnictwa
    participant.isConfirmed = false;
    await participant.save();

    res.json({
      success: true,
      message: "Uczestnictwo zostało anulowane pomyślnie"
    });
  } catch (error) {
    console.error("Błąd podczas anulowania uczestnictwa:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas anulowania uczestnictwa",
      error: error.message
    });
  }
});


module.exports = router;
