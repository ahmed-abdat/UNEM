import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import NoteFound from "./components/NoteFound";

const Home = lazy(() => import("./pages/Home"));
const Calculation = lazy(() => import("./pages/calculation"));
const Resulta = lazy(() => import("./pages/resulta/Resulat"));
const Revision = lazy(() => import("./pages/revision/Revision"));
const Whatsapp = lazy(() => import("./pages/whtsapp/Whatsapp"));
const Institutions = lazy(() => import("./pages/Institutions/Institutions"));
const Branches = lazy(() => import("./pages/Branches/Branches"));
const Schedules = lazy(() => import("./pages/Schedules/Schedules"));
const Remote = lazy(() => import("./pages/Remote/Remote"));


// intro 
import Intro from "./components/Intro";

// All result
const Fst = lazy(() => import("./pages/AllResults/Fst/FST"));
const Fsje = lazy(() => import("./pages/AllResults/FSJE/FSJE"));
const Fslh = lazy(() => import("./pages/AllResults/FSLH/Fslh"));
const Iscae = lazy(() => import("./pages/AllResults/Iscae/Iscae"));
const Iseri = lazy(() => import("./pages/AllResults/Iseri/Iseri"));
const Uip = lazy(() => import("./pages/AllResults/Uip/Uip"));
const Fm = lazy(() => import("./pages/AllResults/Fm/Fm"));
const Usi = lazy(() => import("./pages/AllResults/Usi/Usi"));
const Roso = lazy(() => import("./pages/AllResults/Roso/Roso"));
const Translate = lazy(() => import("./pages/AllResults/Translate/Translate"));
const Enss = lazy(() => import("./pages/AllResults/Enss/Enss"));

// All Institutions
import FstInstitution from './pages/AllInstitution/Fst/Fst';
import FsjhInstitution from "./pages/AllInstitution/Fsje/Fsjh";
import FslhInstitution from "./pages/AllInstitution/Fslh/Fslh";
import IscaeInstitution from "./pages/AllInstitution/Iscae/Iscae";
import UipInstitution from "./pages/AllInstitution/Uip/Uip";
import IseriInstitution from "./pages/AllInstitution/Iseri/Iseri";
import FmInstitution from './pages/AllInstitution/Fm/Fm'
import TranslateInstitution from './pages/AllInstitution/Translate/Translate'
import RosoInstitution from './pages/AllInstitution/Roso/Roso'
import UsiInstitution from './pages/AllInstitution/Usi/Usi'
import EnessInstitution from './pages/AllInstitution/Eness/Eness'

const RemoteIframe = lazy(() => import("./pages/Remote/RemoteIframe"));
const Form = lazy(() => import("./pages/Form/Form"));

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
          <Route path="/branches" element={<Branches />} />
          <Route path="/schedule" element={<Schedules />} />
          <Route path="/remote" element={<Remote />} />

          {/* revision */}
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
          <Route path="/institutions-iseri" element={<IseriInstitution />} />
          <Route path="/institutions-fm" element={<FmInstitution />} />
          <Route path="/institutions-translate" element={<TranslateInstitution />} />
          <Route path="/institutions-roso" element={<RosoInstitution />} />
          <Route path="/institutions-usi" element={<UsiInstitution />} />
          <Route path="/institutions-enss" element={<EnessInstitution />} /> 
          

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
