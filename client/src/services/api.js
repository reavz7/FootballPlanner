import axios from "axios";

const API_URL = "http://localhost:5000";

// Rejestracja użytkownika
export async function registerUser(data) {
  try {
    const response = await axios.post(`${API_URL}/users/register`, data);
    return response.data; 
  } catch (error) {
    if (error.response) {
      
      throw new Error(error.response.data.message || "Błąd rejestracji");
    } else {
      
      throw new Error("Brak połączenia z serwerem");
    }
  }
}

// Logowanie użytkownika
export async function loginUser(data) {
  try {
    const response = await axios.post(`${API_URL}/users/login`, data);
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Błąd logowania");
    } else {
      throw new Error("Brak połączenia z serwerem");
    }
  }
}

export async function getCurrentUser(token) {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Błąd pobierania użytkownika"
      );
    } else {
      throw new Error("Brak połączenia z serwerem");
    }
  }
}

// Pobierz przyszłe mecze
export async function getUpcomingMatches() {
  try {
    const response = await axios.get(`${API_URL}/matches`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Błąd pobierania meczów");
    } else {
      throw new Error("Brak połączenia z serwerem");
    }
  }
}

// Stwórz nowy mecz
export async function createMatch(data, token) {
  try {
    const response = await axios.post(`${API_URL}/matches`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Błąd tworzenia meczu");
    } else {
      throw new Error("Brak połączenia z serwerem");
    }
  }
}

// Istniejąca metoda do pobierania meczów użytkownika
export const getUserMatches = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/matches/participating`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania meczów:", error);
    throw error;
  }
};

export const cancelMatchParticipation = async (token, matchId) => {
  try {
    const response = await axios.put(
      `${API_URL}/matches/${matchId}/cancel-participation`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Błąd podczas anulowania uczestnictwa w meczu:", error);
    throw error;
  }
};

// Pobierz uczestników konkretnego meczu
export async function getMatchParticipants(matchId, token) {
  try {
    const response = await axios.get(
      `${API_URL}/participants/match/${matchId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Błąd pobierania uczestników"
      );
    } else {
      throw new Error("Brak połączenia z serwerem");
    }
  }
}

// Dołącz do meczu
export async function joinMatch(matchId, position, token) {
  try {
    const response = await axios.post(
      `${API_URL}/participants`,
      { matchId, position },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Błąd dołączania do meczu");
    } else {
      throw new Error("Brak połączenia z serwerem");
    }
  }
}

// Pobierz mecze, do których użytkownik NIE dołączył
export async function getAvailableMatches(userId, token) {
  try {
    const response = await axios.get(`${API_URL}/matches/available/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.error || "Błąd pobierania dostępnych meczów"
      );
    } else {
      throw new Error("Brak połączenia z serwerem");
    }
  }
}

// Zmiana hasła
export async function changePassword(currentPassword, newPassword, token) {
  try {
    const response = await axios.put(
      `${API_URL}/users/change-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Błąd zmiany hasła");
  }
}

// Zmiana emaila
export async function changeEmail(newEmail, token) {
  try {
    const response = await axios.put(
      `${API_URL}/users/change-email`,
      {
        newEmail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Błąd zmiany emaila");
  }
}

// Zmiana pseudonimu
export async function changeUsername(newUsername, token) {
  try {
    const response = await axios.put(
      `${API_URL}/users/change-username`,
      {
        newUsername,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Błąd zmiany pseudonimu");
  }
}

// 1. Pobierz przyszłe mecze stworzone przez zalogowanego użytkownika
export async function getUserCreatedMatches(token) {
  try {
    const response = await axios.get(`${API_URL}/matches/usercreations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Błąd pobierania meczów użytkownika"
    );
  }
}

// 2. Edytuj mecz
export async function updateMatch(matchId, data, token) {
  try {
    const response = await axios.put(`${API_URL}/matches/${matchId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.error || "Błąd edycji meczu");
  }
}

// 3. Usuń mecz
export async function deleteMatch(matchId, token) {
  try {
    const response = await axios.delete(`${API_URL}/matches/${matchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.error || "Błąd usuwania meczu");
  }
}
