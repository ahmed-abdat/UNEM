import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const NoteFound = lazy(() => import("./components/NoteFound"));

import Home from "./pages/Home";

// Lazy-loaded pages
const Calculation = lazy(() => import("./pages/calculation"));
const Resulta = lazy(() => import("./pages/resulta/Resulat"));
const Revision = lazy(() => import("./pages/revision/Revision"));
const Whatsapp = lazy(() => import("./pages/whtsapp/Whatsapp"));
const Institutions = lazy(() => import("./pages/Institutions/Institutions"));
const Branches = lazy(() => import("./pages/Branches/Branches"));
const Schedules = lazy(() => import("./pages/Schedules/Schedules"));
const Remote = lazy(() => import("./pages/Remote/Remote"));
const About = lazy(() => import("./pages/About"));
const News = lazy(() => import("./pages/news"));
const Poste = lazy(() => import('./components/Poste'));
const RemoteIframe = lazy(() => import("./pages/Remote/RemoteIframe"));
const Form = lazy(() => import("./pages/Form/Form"));
const Institues = lazy(() => import("./components/Institues"));
const Bac2025 = lazy(() => import("./pages/Bac2025"));

import Archives from './pages/archives/Archives'
import Loader from "./components/Loader";

// Development-only imports
const DevelopmentTools = () => {
  // Always call hooks at the top level
  const [StagewiseToolbar, setStagewiseToolbar] = useState(null);
  const [ReactPlugin, setReactPlugin] = useState(null);
  
  useEffect(() => {
    // Check environment inside useEffect instead
    if (!import.meta.env.DEV) return;
    const loadStagewise = async () => {
      try {
        const [toolbarModule, pluginModule] = await Promise.all([
          import("@stagewise/toolbar-react"),
          import("@stagewise-plugins/react")
        ]);
        setStagewiseToolbar(() => toolbarModule.StagewiseToolbar);
        setReactPlugin(pluginModule.default);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Stagewise not available in development:', error);
        }
      }
    };
    
    loadStagewise();
  }, []);
  
  // Return null for production after hooks are called
  if (!import.meta.env.DEV) return null;
  
  if (!StagewiseToolbar || !ReactPlugin) return null;
  
  return (
    <StagewiseToolbar 
      config={{
        plugins: [ReactPlugin]
      }}
    />
  );
};

function App() {
  return (
    <Router>
      <DevelopmentTools />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/News/poste/:id" element={<Poste />} />
          <Route path="/calculation" element={<Calculation />} />
          <Route path="/whatsapp" element={<Whatsapp />} />
          <Route path="/resulta" element={<Resulta />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/revision/:id" element={<Archives />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path='/institutions/:id' element={<Institues />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/schedule" element={<Schedules />} />
          <Route path="/remote" element={<Remote />} />
          <Route path="/about" element={<About />} />
          <Route path="/bac2025" element={<Bac2025 />} />

          {/* all revision archive */}

          
          <Route path="/remote-fm" element={<RemoteIframe />} />
          <Route path="/form" element={<Form />} />

          {/* note found */}
          <Route path="*" element={<NoteFound />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
