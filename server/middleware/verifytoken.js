// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Pobieranie tokenu z nagłówka Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Brak tokenu autoryzacyjnego' });
    }

    // Wyciągnięcie tokenu z nagłówka Bearer
    const token = authHeader.split(' ')[1];
    
    // Weryfikacja tokenu
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Dodanie informacji o użytkowniku do obiektu req
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Błąd weryfikacji tokenu:', error);
    return res.status(401).json({ message: 'Token nieprawidłowy lub wygasł' });
  }
};