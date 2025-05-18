import React from 'react'

const ButtonPrimary = ({text}) => {
  return (
     <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded transition-colors cursor-pointer">
          {text}
     </button>
  )
}

export default ButtonPrimary