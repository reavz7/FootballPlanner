import { useState, useEffect, useRef } from "react";

export default function AnimatedHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [grid, setGrid] = useState([]);
  const gridSize = 15;
  const activationRadius = 5;

  useEffect(() => {
    const newGrid = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        newGrid.push({
          id: `${x}-${y}`,
          x: x,
          y: y,
          active: false,
          opacity: 0,
        });
      }
    }
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const gridX = (x / rect.width) * gridSize;
      const gridY = (y / rect.height) * gridSize;

      setMousePosition({ x: gridX, y: gridY });

      setGrid((prevGrid) =>
        prevGrid.map((cell) => {
          const distance = Math.sqrt(
            Math.pow(cell.x - gridX, 2) + Math.pow(cell.y - gridY, 2)
          );

          // Zaświecenie komórek blisko myszy - tylko komórki bardzo blisko kursora
          if (distance < activationRadius) {
            return {
              ...cell,
              active: true,
              // Intensywniejszy efekt - większy kontrast dla bliższych komórek
              opacity: Math.pow(1 - distance / activationRadius, 2),
            };
          }

          // Szybsze wygaszanie pozostałych komórek
          return {
            ...cell,
            active: false,
            opacity: Math.max(0, cell.opacity - 0.2),
          };
        })
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Siatka */}
      <div
        className="absolute inset-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid.map((cell) => (
          <div
            key={cell.id}
            className="border border-gray-900"
            style={{
              backgroundColor: `rgba(99, 102, 241, ${cell.opacity})`,
              transition: "background-color 0.15s linear",
            }}
          />
        ))}
      </div>

      {/* Zawartość hero */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-4">
        <h1 className="text-6xl font-bold mb-4 text-center">DOŁĄCZ DO GRY.</h1>
        <p className="text-xl text-center max-w-2xl mb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
          quisquam nemo excepturi officia necessitatibus veritatis enim ipsam!
          Laudantium, reiciendis officia!
        </p>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded transition-colors cursor-pointer">
          Wyszukaj mecz
        </button>
      </div>
    </div>
  );
}
