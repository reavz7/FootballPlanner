import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      
      if (isLogin) {
        // Logowanie
        response = await loginUser({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Rejestracja
        response = await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }

      // Zapisanie tokena w localStorage
      localStorage.setItem('authToken', response.token);
      
      // Zapisanie danych użytkownika
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Przekierowanie do strony głównej
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Logowanie' : 'Rejestracja'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isLogin
              ? 'Zaloguj się, aby kontynuować'
              : 'Utwórz swoje konto'}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nazwa użytkownika
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required={!isLogin}
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adres email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Hasło
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Proszę czekać...</span>
              ) : isLogin ? (
                'Zaloguj się'
              ) : (
                'Zarejestruj się'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleForm}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLogin
                ? 'Nie masz konta? Zarejestruj się'
                : 'Masz już konto? Zaloguj się'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}