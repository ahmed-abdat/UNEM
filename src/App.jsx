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

import NoteFound from "./components/NoteFound";

// All result
import Fst from "./pages/AllResults/Fst/FST";
import Fsje from './pages/AllResults/FSJE/FSJE'
import Fslh from './pages/AllResults/FSLH/Fslh'
import Iscae from './pages/AllResults/Iscae/Iscae'
import Iseri from './pages/AllResults/Iseri/Iseri'
import Uip from './pages/AllResults/Uip/Uip'
import Fm from './pages/AllResults/Fm/Fm'
import Usi from './pages/AllResults/Usi/Usi'
import Roso from './pages/AllResults/Roso/Roso'
import Translate from './pages/AllResults/Translate/Translate'
import Enss from './pages/AllResults/Enss/Enss'

// All Institutions
import FstInstitution from "./pages/AllInstitution/Fst/Fst";
import FsjhInstitution from "./pages/AllInstitution/Fsje/Fsjh";
import FslhInstitution from "./pages/AllInstitution/Fslh/Fslh";
import IscaeInstitution from "./pages/AllInstitution/Iscae/Iscae";
import UipInstitution from "./pages/AllInstitution/Uip/Uip";

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
          <Route path="/revision-fslh" element={<Fslh />} />
          <Route path="/revision-iscae" element={<Iscae />} />
          <Route path="/revision-iseri" element={<Iseri />} />
          <Route path="/revision-iup" element={<Uip />} />
          <Route path="/fm" element={<Fm />} />
          <Route path="/usi" element={<Usi />} />
          <Route path="/roso" element={<Roso />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/enss" element={<Enss />} />

          {/* Institutions */}
          <Route path="/institutions-fst" element={<FstInstitution />} />
          <Route path="/institutions-fsje" element={<FsjhInstitution />} />
          <Route path="/institutions-fslh" element={<FslhInstitution />} />
          <Route path="/institutions-iscae" element={<IscaeInstitution />} />
          <Route path="/institutions-uip" element={<UipInstitution />} />


          <Route path="/remote-fm" element={<RemoteIframe />} />
          <Route path="/form" element={<Form />} />

          {/* note found */}
          <Route path="*" element={<NoteFound />} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
