import { UserCircle } from "lucide-react"

const ProfileInfo = ({ user }) => {
  return (
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
  )
}

export default ProfileInfo