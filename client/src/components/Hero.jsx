import { useState, useEffect, useRef } from "react";

export default function AnimatedHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gridRef = useRef(null);
  const [grid, setGrid] = useState([]);
  const gridSize = 15; // Number of squares in each dimension
  const activationRadius = 3; // How many squares away to light up

  // Initialize grid on component mount
  useEffect(() => {
    const newGrid = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        newGrid.push({
          id: `${i}-${j}`,
          x: i,
          y: j,
          active: false,
          opacity: 0,
        });
      }
    }
    setGrid(newGrid);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert to grid coordinates
      const gridX = Math.floor((x / rect.width) * gridSize);
      const gridY = Math.floor((y / rect.height) * gridSize);

      setMousePosition({ x: gridX, y: gridY });

      // Update grid cells based on mouse position
      setGrid((prevGrid) =>
        prevGrid.map((cell) => {
          const distance = Math.sqrt(
            Math.pow(cell.x - gridX, 2) + Math.pow(cell.y - gridY, 2)
          );

          // Light up cells close to the mouse
          if (distance < activationRadius) {
            return {
              ...cell,
              active: true,
              opacity: 1 - distance / activationRadius,
            };
          }

          // Fade out other cells
          return {
            ...cell,
            active: false,
            opacity: cell.opacity > 0 ? cell.opacity - 0.1 : 0,
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Grid overlay */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-15 grid-rows-15"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid.map((cell) => (
          <div
            key={cell.id}
            className="border border-gray-900"
            style={{
              backgroundColor: cell.active
                ? "rgba(99, 102, 241, " + cell.opacity + ")"
                : "transparent",
              transition: "background-color 0.3s ease-out",
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-4">
        <h1 className="text-6xl font-bold mb-4 text-center">DOŁĄCZ DO GRY.</h1>
        <p className="text-xl text-center max-w-2xl mb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
          quisquam nemo excepturi officia necessitatibus veritatis enim ipsam!
          Laudantium, reiciendis officia!
        </p>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded transition-colors">
          Wyszukaj mecz
        </button>
      </div>
    </div>
  );
}
