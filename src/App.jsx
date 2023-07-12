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
import Revision from "./pages/revision/Revision";
import Whatsapp from "./pages/whtsapp/Whatsapp";
import Institutions from "./pages/Institutions/Institutions";
import Branchers from "./pages/Branches/Branches";
import Schedules from "./pages/Schedules/Schedules";
import Remote from "./pages/Remote/Remote";

// All result
import Fst from "./pages/AllResults/Fst/FST";
import Fsje from './pages/AllResults/FSJE/FSJE'

const Home = lazy(() => import("./pages/Home"));
const Calculation = lazy(() => import("./pages/calculation"));
const RemoteIframe = lazy(() => import('./pages/Remote/RemoteIframe'))
const Form = lazy(() => import('./pages/Form/Form'))

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculation" element={<Calculation />} />
          <Route path="/check" element={<Loading />} />
          <Route path="/resulta" element={<Resulta />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/whatsapp" element={<Whatsapp />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/branches" element={<Branchers />} />
          <Route path="/schedule" element={<Schedules />} />
          <Route path="/remote" element={<Remote />} />

          {/* revision  */}
          <Route path="/revision-fst" element={<Fst />} />
          <Route path="/revision-fsje" element={<Fsje />} />


          <Route path="/remote-fm" element={<RemoteIframe />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
