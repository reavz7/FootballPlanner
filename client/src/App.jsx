import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AuthForm from "./pages/AuthForm";
import "./App.css";
import Profile from "./pages/Profile";
import CreateMatch from "./pages/CreateMatch";
import MatchHistory from "./pages/MatchHistory";
import SearchMatch from "./pages/SearchMatch";

// Komponent zabezpieczający route
function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/auth" />;
}

function App() {
  return (
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
      />
       <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>
          }
      />
      <Route
          path="/match-history"
          element={
            <PrivateRoute>
              <MatchHistory/>
            </PrivateRoute>
          }
      />
       <Route
          path="/search-match"
          element={
            <PrivateRoute>
              <SearchMatch/>
            </PrivateRoute>
          }
      />
      <Route
          path="/create-match"
          element={
            <PrivateRoute>
              <CreateMatch/>
            </PrivateRoute>
          }
        />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
  );
}

export default App;
