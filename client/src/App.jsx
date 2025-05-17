import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import "./App.css";
import Footer from "./components/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}

export default App;
