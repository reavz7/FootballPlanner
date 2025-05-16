import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-center p-4 text-color-red text-[12rem]">
        Tailwind test
      </h1>
    </>
  );
}

export default App;
