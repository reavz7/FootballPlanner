import React from 'react'

const ButtonPrimary = ({text, type}) => {
  return (
     <button type={type} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded transition-colors cursor-pointer">
          {text}
     </button>
  )
}

export default ButtonPrimary