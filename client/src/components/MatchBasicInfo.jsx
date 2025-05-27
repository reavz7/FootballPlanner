import React from "react"

const MatchBasicInfo = ({ formData, handleInputChange }) => {
  return (
    <div className="flex flex-col items-end gap-7.5">
      <input
        type="text"
        name="title"
        placeholder="Nazwa meczu"
        className="input"
        value={formData.title}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Lokalizacja meczu"
        className="input"
        value={formData.location}
        onChange={handleInputChange}
        maxLength={35} 
        required
      />
      <textarea
        name="description"
        className="textarea"
        placeholder="Opis (opcjonalnie)"
        value={formData.description}
        onChange={handleInputChange}
        maxLength={50} 
      ></textarea>
    </div>
  );
};


export default MatchBasicInfo