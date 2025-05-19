import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

// Rejestracja użytkownika
export async function registerUser(data) {  
  try {
    const response = await axios.post(`${API_URL}/users/register`, data);       
    return response.data; // zawiera token, user i message
  } catch (error) {
    if (error.response) {
      // Błąd odpowiedzi serwera
      throw new Error(error.response.data.message || 'Błąd rejestracji');
    } else {
      // Inny błąd (np. brak połączenia)
      throw new Error('Brak połączenia z serwerem');
    }
  }
}

// Logowanie użytkownika
export async function loginUser(data) {
  try {
    const response = await axios.post(`${API_URL}/users/login`, data);
    return response.data; // token, user, message
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Błąd logowania');
    } else {
      throw new Error('Brak połączenia z serwerem');
    }
  }
}

// Pobranie danych aktualnego użytkownika
export async function getCurrentUser(token) {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // dane użytkownika bez hasła
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Błąd pobierania użytkownika');
    } else {
      throw new Error('Brak połączenia z serwerem');
    }
  }
}
