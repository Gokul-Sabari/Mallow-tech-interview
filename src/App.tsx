import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Toaster from "./components/Toaster";

function App() {
  return (
    <Router>
      <Toaster />
      <AppRoutes />
    </Router>
  );
}

export default App;
