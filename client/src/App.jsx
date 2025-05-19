import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AuthForm from "./pages/AuthForm";
import "./App.css";

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
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
  );
}

export default App;
