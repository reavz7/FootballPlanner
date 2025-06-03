const express = require("express");
const router = express.Router();
const { Match, Participant } = require("../models");
const { Op } = require("sequelize");
const verifyToken = require("../middleware/verifyToken");
const { sequelize } = require("../models");


router.get("/", verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const matches = await Match.findAll({
      where: {
        date: {
          [Op.gt]: now, 
        },
      },
      order: [["date", "ASC"]], 
    });
    res.json(matches);
  } catch (error) {
    res.status(500).json({
      error: "Błąd podczas pobierania meczów",
      details: error.message,
    });
  }
});


router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, location, date, isParticipant, position } =
      req.body;
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
        return res
          .status(400)
          .json({
            error: "Pozycja jest wymagana, jeśli chcesz być uczestnikiem.",
          });
      }

      
      await Participant.create({
        matchId: newMatch.id,
        userId: createdBy,
        position,
        isConfirmed: 1,
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
          attributes: ["userId", "position"],
          where: {
            isConfirmed: true
          }
        }
      ],
      order: [["date", "ASC"]],
    });

    const now = new Date();

    const response = participatingMatches
      .filter(match => match.Participants.some(p => p.userId === userId))
      .map((match) => {
        const matchData = match.toJSON();

        const totalParticipants = matchData.Participants.length;

        const userPosition =
          matchData.Participants.find(p => p.userId === userId)?.position || null;

        const matchDate = new Date(matchData.date);
        const formattedDate = matchDate.toLocaleString("pl-PL", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const isPast = matchDate < now;

        return {
          ...matchData,
          date: formattedDate,
          position: userPosition,
          totalParticipants,
          isPast,
          Participants: undefined,
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

    
    const participant = await Participant.findOne({
      where: {
        userId,
        matchId,
        isConfirmed: true, 
      },
    });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message:
          "Nie jesteś uczestnikiem tego meczu lub twoje uczestnictwo zostało już anulowane",
      });
    }

    
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Mecz nie istnieje",
      });
    }

    
    if (new Date(match.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Nie możesz anulować uczestnictwa w meczu, który już się odbył",
      });
    }

    
    participant.isConfirmed = false;
    await participant.save();

    res.json({
      success: true,
      message: "Uczestnictwo zostało anulowane pomyślnie",
    });
  } catch (error) {
    console.error("Błąd podczas anulowania uczestnictwa:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas anulowania uczestnictwa",
      error: error.message,
    });
  }
});



router.get("/available/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();

    
    const joinedMatchIds = await Participant.findAll({
      where: {
        userId,
        isConfirmed: true,
      },
      attributes: ["matchId"],
    });

    const joinedIds = joinedMatchIds.map((p) => p.matchId);

    
    
    
    
    const availableMatches = await Match.findAll({
      where: {
        id: { [Op.notIn]: joinedIds.length > 0 ? joinedIds : [0] },
        date: { [Op.gt]: now },
      },
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Participants.id')), 'participantsCount']
        ]
      },
      include: [
        {
          model: Participant,
          attributes: [],
          where: { isConfirmed: true },  
          required: false,               
        }
      ],
      group: ['Match.id'],
      having: sequelize.literal('COUNT(Participants.id) < 30'),
      order: [["date", "ASC"]],
    });

    res.json(availableMatches);
  } catch (error) {
    console.error("Błąd pobierania dostępnych meczów:", error);
    res.status(500).json({
      error: "Błąd pobierania dostępnych meczów",
      details: error.message,
    });
  }
});



router.get("/usercreations", verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const matches = await Match.findAll({
      where: {
        createdBy: req.user.id,
        date: { [Op.gt]: now }
      },
      order: [["date", "ASC"]]
    });
    res.json(matches);
  } catch (error) {
    console.error("Błąd podczas pobierania meczów:", error);
    res.status(500).json({ error: "Błąd podczas pobierania meczów", details: error.message });
  }
});


router.put("/:matchId", verifyToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findByPk(matchId);
    if (!match || match.createdBy !== req.user.id) {
      return res.status(403).json({ error: "Brak dostępu lub mecz nie istnieje" });
    }
    const { title, description, location, date } = req.body;
    await match.update({ title, description, location, date });
    res.json(match);
  } catch (error) {
    console.error("Błąd podczas edycji meczu:", error);
    res.status(500).json({ error: "Błąd podczas edycji meczu", details: error.message });
  }
});


router.delete("/:matchId", verifyToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findByPk(matchId);
    if (!match || match.createdBy !== req.user.id) {
      return res.status(403).json({ error: "Brak dostępu lub mecz nie istnieje" });
    }
    await match.destroy();
    res.json({ message: "Mecz usunięty pomyślnie" });
  } catch (error) {
    console.error("Błąd podczas usuwania meczu:", error);
    res.status(500).json({ error: "Błąd podczas usuwania meczu", details: error.message });
  }
});


module.exports = router;
