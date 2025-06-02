import { Mail, UserCircle, Key } from "lucide-react"

const ProfileForm = ({
  newEmail,
  setNewEmail,
  newUsername,
  setNewUsername,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  onEmailChange,
  onUsernameChange,
  onPasswordChange
}) => {
  return (
    <div className="h-full">
      <div className="bg-gray-800 rounded-xl p-8 text-white shadow-xl h-full border border-gray-700">
        <div className="space-y-6">
          {/* Email Form */}
          <form onSubmit={onEmailChange} className="space-y-3">
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
          <form onSubmit={onUsernameChange} className="space-y-3">
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
          <form onSubmit={onPasswordChange} className="space-y-3">
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
  )
}

export default ProfileForm