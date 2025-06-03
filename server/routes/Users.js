const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const { User } = require('../models');


router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    
    const existingEmailUser = await User.findOne({ where: { email } });
    if (existingEmailUser) {
      return res.status(400).json({ message: 'Użytkownik z takim adresem email już istnieje' });
    }

    
    const existingUsernameUser = await User.findOne({ where: { username } });
    if (existingUsernameUser) {
      return res.status(400).json({ message: 'Pseudonim jest już zajęty' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Użytkownik zarejestrowany pomyślnie',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Błąd rejestracji:', error);
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
});



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email i hasło są wymagane' });
    }

    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });
    }

    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Zalogowano pomyślnie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
});


router.get('/me', require('../middleware/verifyToken'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Błąd pobierania użytkownika:', error);
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
});

router.put('/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: "Nieprawidłowe obecne hasło" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Hasło zostało zmienione" });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});


router.put('/change-email', verifyToken, async (req, res) => {
  const { newEmail } = req.body;

  try {
    const existing = await User.findOne({ where: { email: newEmail } });
    if (existing) return res.status(400).json({ message: "Ten email już istnieje" });

    const user = await User.findByPk(req.user.id);
    user.email = newEmail;
    await user.save();

    res.json({ message: "Email został zmieniony" });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

router.put('/change-username', verifyToken, async (req, res) => {
  const { newUsername } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username: newUsername } });
    if (existingUser) {
      return res.status(400).json({ message: "Pseudonim jest już zajęty" });
    }

    const user = await User.findByPk(req.user.id);
    user.username = newUsername;
    await user.save();

    res.json({ message: "Pseudonim został zmieniony" });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});



module.exports = router;