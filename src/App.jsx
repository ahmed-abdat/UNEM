import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/home/home";


function App() {
return (
  <Router>
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
</Router>
)
}

export default App;
