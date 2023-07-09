import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import SpinerLoader from "./components/SpinerLoader";
// import Home from "./pages/Home";
const Home = lazy(() => import('./pages/Home'))
const Calculation = lazy(() => import("./pages/calculation"));

function App() {
  return (
    <Router>
      <Suspense fallback={<SpinerLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculation" element={<Calculation />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
