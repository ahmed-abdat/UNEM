import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";
const Calculation = lazy(() => import("./pages/calculation"));

function App() {
  return (
    <Router>
      <Suspense fallback={<h1> Loading ... </h1>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculation" element={<Calculation />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
