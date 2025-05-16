const express = require("express");
const router = express.Router();
const { User } = require("../models"); // upewnij się, że models/index.js eksportuje User
const verifyToken = require("../middleware/verifytoken"); // middleware jest funkcją

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania użytkowników" });
  }
});

module.exports = router;
