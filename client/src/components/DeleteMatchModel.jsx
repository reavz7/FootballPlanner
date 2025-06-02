import { AlertTriangle } from "lucide-react";

const DeleteMatchModal = ({ 
  isOpen, 
  onClose, 
  match, 
  onConfirm, 
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-lg w-full max-w-md shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-900/60 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">
                Usuń mecz
              </h3>
              <p className="text-gray-400 text-sm">
                Ta akcja jest nieodwracalna
              </p>
            </div>
          </div>

          <p className="text-gray-300 mb-6">
            Czy na pewno chcesz usunąć mecz "{match?.title}"?
            Wszyscy uczestnicy zostaną automatycznie wypisani.
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Usuwanie..." : "Usuń mecz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteMatchModal;