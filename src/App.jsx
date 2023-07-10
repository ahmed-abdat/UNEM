import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import SpinerLoader from "./components/SpinerLoader";
import Loading from "./components/Loading";
import CheckValid from "./components/CheckValid";

const Home = lazy(() => import('./pages/Home'))
const Calculation = lazy(() => import("./pages/calculation"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculation" element={<Calculation />} />
          <Route path="/check" element={<Loading />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
