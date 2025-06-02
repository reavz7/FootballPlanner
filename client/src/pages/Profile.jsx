"use client"

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AlertsSection from "../components/AlertsSection"
import ProfileInfo from "../components/ProfileInfo"
import ProfileForm from "../components/ProfileForm"
import { getCurrentUser, changeEmail, changeUsername, changePassword } from "../services/api"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [newEmail, setNewEmail] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken")

      try {
        const userData = await getCurrentUser(token)
        setUser(userData)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchUser()
  }, [])

  const handleEmailChange = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("authToken")
    
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
    const token = localStorage.getItem("authToken")
    
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
    const token = localStorage.getItem("authToken")
    
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

            <AlertsSection error={error} successMessage={successMessage} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileInfo user={user} />
              
              <ProfileForm
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                newUsername={newUsername}
                setNewUsername={setNewUsername}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                onEmailChange={handleEmailChange}
                onUsernameChange={handleUsernameChange}
                onPasswordChange={handlePasswordChange}
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Profile