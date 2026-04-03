import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/home" /> : <Login setUser={setUser} />
          }
        />

        <Route
          path="/signup"
          element={
            user ? <Navigate to="/home" /> : <Signup />
          }
        />

        {/* Protected Route */}
        <Route
          path="/home"
          element={
            user ? <Home user={user} setUser={setUser} /> : <Navigate to="/" />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
