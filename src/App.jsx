import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
// import SpinerLoader from "./components/SpinerLoader";
import Loading from "./components/Loading";
import Resulta from "./pages/resulta/Resulat";
import Revision from './pages/revision/Revision'
import Whatsapp from "./pages/whtsapp/Whatsapp";

const Home = lazy(() => import('./pages/Home'))
const Calculation = lazy(() => import("./pages/calculation"));
// const Resulat = lazy(() => import('./pages/resulta/Resulat'))
// const Revision = lazy(() => import('./pages/revision/Revision'))

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculation" element={<Calculation />} />
          <Route path="/check" element={<Loading />} />
          <Route path='/resulta' element={<Resulta />} />
          <Route path='/revision' element={<Revision />} />
          <Route path='/whatsapp' element={<Whatsapp />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
