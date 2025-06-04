"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const FilterBar = ({ matches, onFilter, participantCounts = {} }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [participantRange, setParticipantRange] = useState([0, 30]);
  const [selectedRangeLabel, setSelectedRangeLabel] = useState(null);

  const participantOptions = [
    { label: "0-10", range: [0, 10] },
    { label: "11-20", range: [11, 20] },
    { label: "21-30", range: [21, 30] },
  ];

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterMatches(term, filterType, participantRange);
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    filterMatches(searchTerm, type, participantRange);
  };

  const filterMatches = (term, type, range) => {
    if (!matches || matches.length === 0) return;

    let filtered = [...matches];

    if (term) {
      const lowercaseTerm = term.toLowerCase();
      filtered = filtered.filter((match) => {
        if (
          (type === "name" || type === "all") &&
          match.name?.toLowerCase().includes(lowercaseTerm)
        )
          return true;
        if (
          (type === "location" || type === "all") &&
          match.location?.toLowerCase().includes(lowercaseTerm)
        )
          return true;
        return false;
      });
    }

    // TUTAJ JEST POPRAWKA - używamy participantCounts[match.id]
    filtered = filtered.filter((match) => {
      const actualParticipants = participantCounts[match.id] || 0;
      return actualParticipants >= range[0] && actualParticipants <= range[1];
    });

    onFilter(filtered);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-800 text-white w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Wyszukaj mecze..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                filterType === "all"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              }`}
              onClick={() => handleFilterTypeChange("all")}
            >
              Wszystkie
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filterType === "name"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              }`}
              onClick={() => handleFilterTypeChange("name")}
            >
              Nazwa
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                filterType === "location"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              }`}
              onClick={() => handleFilterTypeChange("location")}
            >
              Lokalizacja
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-white">Liczba uczestników:</label>
          <div className="flex flex-wrap gap-4">
            {participantOptions.map((option, idx) => (
              <label
                key={idx}
                className="text-white flex items-center space-x-2"
              >
                <input
                  type="radio"
                  name="participantRange"
                  value={option.label}
                  checked={selectedRangeLabel === option.label}
                  onChange={() => {
                    setParticipantRange(option.range);
                    setSelectedRangeLabel(option.label);
                    filterMatches(searchTerm, filterType, option.range);
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={() => {
              setParticipantRange([0, 30]);
              setSelectedRangeLabel(null);
              filterMatches(searchTerm, filterType, [0, 30]);
            }}
            className="mt-2 self-start text-sm text-red-400 hover:underline cursor-pointer"
          >
            Wyczyść filtr ilości uczestników
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
