import { Clock, CheckCircle } from "lucide-react"

const MatchFilters = ({ showCompleted, setShowCompleted, showUpcoming, setShowUpcoming }) => {
  return (
    <div className="bg-gray-800 rounded-xl mb-6 p-4 border border-gray-700">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <span className="text-white font-medium">Filtruj mecze:</span>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
            />
            <CheckCircle size={16} className="text-green-400" />
            <span>Zakończone</span>
          </label>
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showUpcoming}
              onChange={(e) => setShowUpcoming(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <Clock size={16} className="text-blue-400" />
            <span>Do rozegrania</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default MatchFilters