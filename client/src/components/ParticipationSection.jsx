import React from "react"

const ParticipationSection = ({ isParticipant, setIsParticipant, selectedPosition, setSelectedPosition }) => {
  const handleParticipantChange = (e) => {
    setIsParticipant(e.target.checked)
    if (!e.target.checked) {
      setSelectedPosition("")
    }
  }

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value)
  }

  return (
    <div>
      <div className="form-control mt-4">
        <label className="cursor-pointer label justify-start gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={isParticipant}
            onChange={handleParticipantChange}
          />
          <span className="label-text text-white">Chcę być także uczestnikiem meczu</span>
        </label>
      </div>

      {isParticipant && (
        <div className="mt-2 w-full">
          <select
            className="select select-bordered w-full"
            value={selectedPosition}
            onChange={handlePositionChange}
            required={isParticipant}
          >
            <option value="" disabled>
              Wybierz preferowaną pozycję
            </option>
            <option value="bramkarz">Bramkarz</option>
            <option value="obrona">Obrona</option>
            <option value="pomoc">Pomoc</option>
            <option value="atak">Atak</option>
          </select>
        </div>
      )}
    </div>
  )
}

export default ParticipationSection