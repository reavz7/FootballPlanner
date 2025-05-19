const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Endpoint rejestracji
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Walidacja danych
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
    }

    // Sprawdzenie czy użytkownik o podanym emailu już istnieje
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Użytkownik z takim adresem email już istnieje' });
    }

    // Haszowanie hasła
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Utworzenie nowego użytkownika
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // Generowanie JWT
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

// Endpoint logowania
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Walidacja danych
    if (!email || !password) {
      return res.status(400).json({ message: 'Email i hasło są wymagane' });
    }

    // Sprawdzenie czy użytkownik istnieje
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });
    }

    // Sprawdzenie czy hasło jest poprawne
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });
    }

    // Generowanie JWT
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

// Endpoint sprawdzania aktualnego użytkownika
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

module.exports = router;