"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ErrorAlert from "../components/ErrorAlert"
import SuccessAlert from "../components/SuccessAlert"
import { getCurrentUser, changeEmail, changeUsername, changePassword } from "../services/api"
import { UserCircle, Mail, Key } from "lucide-react"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [newEmail, setNewEmail] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const token = localStorage.getItem("authToken")

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setError("Nie jesteś zalogowany!")
        return
      }

      try {
        const userData = await getCurrentUser(token)
        setUser(userData)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchUser()
  }, [token])

  const handleEmailChange = async (e) => {
    e.preventDefault()
    try {
      const res = await changeEmail(newEmail, token)
      setSuccessMessage(res.message)
      setError("")
      setNewEmail("")
      const updatedUser = await getCurrentUser(token)
      setUser(updatedUser)
    } catch (err) {
      setError(err.message)
      setSuccessMessage("")
    }
  }

  const handleUsernameChange = async (e) => {
    e.preventDefault()
    try {
      const res = await changeUsername(newUsername, token)
      setSuccessMessage(res.message)
      setError("")
      setNewUsername("")
      const updatedUser = await getCurrentUser(token)
      setUser(updatedUser)
    } catch (err) {
      setError(err.message)
      setSuccessMessage("")
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    try {
      const res = await changePassword(currentPassword, newPassword, token)
      setSuccessMessage(res.message)
      setError("")
      setCurrentPassword("")
      setNewPassword("")
    } catch (err) {
      setError(err.message)
      setSuccessMessage("")
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <main className="py-16 px-4 pt-24 md:pt-42">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-10">
              <h1 className="text-white text-4xl uppercase font-medium mb-2">Twój profil</h1>
              <p className="text-gray-300 italic tracking-widest mb-3">Zmieniaj, przeglądaj</p>
              <div className="flex justify-center">
                <div className="border-b-2 border-white w-24 mb-4"></div>
              </div>
            </header>

            {(error || successMessage) && (
              <div className="max-w-xl mx-auto mb-8">
                {error && <ErrorAlert text={error} />}
                {successMessage && <SuccessAlert text={successMessage} />}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Info Card */}
              <div className="h-full">
                <div className="bg-gray-800 rounded-xl p-8 text-white shadow-xl h-full border border-gray-700 flex flex-col">
                  <h2 className="text-xl font-semibold mb-6 text-violet-400 flex items-center">
                    <UserCircle className="mr-2" size={24} />
                    Informacje o profilu
                  </h2>

                  {user ? (
                    <div className="space-y-4 flex-grow">
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Pseudonim</p>
                        <p className="text-lg font-medium">{user.username}</p>
                      </div>

                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Email</p>
                        <p className="text-lg font-medium">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex items-center justify-center">
                      <p className="text-gray-400 italic">Ładowanie danych...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Forms Card */}
              <div className="h-full">
                <div className="bg-gray-800 rounded-xl p-8 text-white shadow-xl h-full border border-gray-700">
                  <div className="space-y-6">
                    {/* Email Form */}
                    <form onSubmit={handleEmailChange} className="space-y-3">
                      <h3 className="text-lg font-medium text-violet-400 flex items-center">
                        <Mail className="mr-2" size={20} />
                        Zmień Email
                      </h3>
                      <div>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition"
                          placeholder="Nowy adres email"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 px-4 py-3 rounded-lg text-white font-medium transition-colors duration-200 flex justify-center items-center"
                      >
                        Aktualizuj Email
                      </button>
                    </form>

                    <div className="border-t border-gray-700 my-4"></div>

                    {/* Username Form */}
                    <form onSubmit={handleUsernameChange} className="space-y-3">
                      <h3 className="text-lg font-medium text-violet-400 flex items-center">
                        <UserCircle className="mr-2" size={20} />
                        Zmień Pseudonim
                      </h3>
                      <div>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition"
                          placeholder="Nowy pseudonim"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 px-4 py-3 rounded-lg text-white font-medium transition-colors duration-200 flex justify-center items-center"
                      >
                        Aktualizuj Pseudonim
                      </button>
                    </form>

                    <div className="border-t border-gray-700 my-4"></div>

                    {/* Password Form */}
                    <form onSubmit={handlePasswordChange} className="space-y-3">
                      <h3 className="text-lg font-medium text-violet-400 flex items-center">
                        <Key className="mr-2" size={20} />
                        Zmień Hasło
                      </h3>
                      <div>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition mb-3"
                          placeholder="Obecne hasło"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none transition"
                          placeholder="Nowe hasło"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 px-4 py-3 rounded-lg text-white font-medium transition-colors duration-200 flex justify-center items-center"
                      >
                        Aktualizuj Hasło
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Profile
