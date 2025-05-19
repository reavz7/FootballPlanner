import React from "react";

const Footer = () => {
  return (
    <footer className="w-full relative">
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-300/30 to-transparent"></div>

      <div className="w-full bg-violet-500 px-4 md:px-8 py-8 border-t-2 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Football<span className="text-gray-900">Planner.</span>
              </h2>
              <p className="text-white text-sm mb-2">
                Łącz pasjonatów piłki nożnej w swojej okolicy!
              </p>
              <p className="text-white/80 text-xs mt-auto pt-4">
                © 2025 FootballPlanner. Wszelkie prawa zastrzeżone.
              </p>
            </div>

            {/* Kontakt - sekcja 2 */}
            <div className="flex flex-col">
              <h3 className="text-xl font-medium mb-4 text-white text-center md:text-left">
                Kontakt
              </h3>
              <address className="not-italic text-white/90 text-sm flex flex-col gap-3 text-center md:text-left">
                <p>Polska, Łódź, Kilińskiego 1, 90-354</p>
                <a
                  href="mailto:kontakt@footballplanner.pl"
                  className="hover:underline hover:text-yellow-300 transition-colors"
                >
                  kontakt@footballplanner.pl
                </a>
                <a
                  href="tel:+48123456789"
                  className="hover:underline hover:text-yellow-300 transition-colors"
                >
                  +48 123 456 789
                </a>
              </address>
            </div>

            <div className="flex flex-col">
              <h3 className="text-xl font-medium mb-4 text-white text-center md:text-left">
                Szybkie linki
              </h3>
              <nav className="flex flex-col gap-3 items-center md:items-start">
                <a
                  href="#"
                  className="text-white/90 hover:text-yellow-300 transition-colors text-sm hover:translate-x-1 transform duration-200"
                >
                  Strona główna
                </a>
                <a
                  href="#"
                  className="text-white/90 hover:text-yellow-300 transition-colors text-sm hover:translate-x-1 transform duration-200"
                >
                  Znajdź mecz
                </a>
                <a
                  href="#"
                  className="text-white/90 hover:text-yellow-300 transition-colors text-sm hover:translate-x-1 transform duration-200"
                >
                  Stwórz mecz
                </a>
                <a
                  href="#"
                  className="text-white/90 hover:text-yellow-300 transition-colors text-sm hover:translate-x-1 transform duration-200"
                >
                  Mój profil
                </a>
              </nav>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center text-white/70 text-xs">
              <p>FootballPlanner Sp. z o.o.</p>
              <div className="flex gap-4 mt-3 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">
                  Regulamin
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Polityka prywatności
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Cookie
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
