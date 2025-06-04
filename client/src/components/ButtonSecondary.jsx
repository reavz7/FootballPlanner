import React from "react";

const ButtonSecondary = ({ text, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded transition-colors cursor-pointer"
    >
      {text}
    </button>
  );
};

export default ButtonSecondary;
