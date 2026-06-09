import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppLayout from './components/layout/AppLayout'
import PageTransition from './components/layout/PageTransition'
import SplashScreen from './components/layout/SplashScreen'
import EvaluacionPage from './pages/EvaluacionPage'
import ResultadoPage from './pages/ResultadoPage'
import HistorialPage from './pages/HistorialPage'
import NotFoundPage from './pages/NotFoundPage'

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<PageTransition><EvaluacionPage /></PageTransition>} />
        <Route path="/resultado" element={<PageTransition><ResultadoPage /></PageTransition>} />
        <Route path="/historial" element={<PageTransition><HistorialPage /></PageTransition>} />
        <Route path="*"          element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [splashListo, setSplashListo] = useState(false);

  return (
    <>
      {/* Splash screen — se muestra hasta que termina la animación */}
      <AnimatePresence>
        {!splashListo && (
          <SplashScreen onComplete={() => setSplashListo(true)} />
        )}
      </AnimatePresence>

      {/* App principal — se monta en paralelo pero queda debajo */}
      <BrowserRouter>
        <AppLayout>
          <AnimatedRoutes />
        </AppLayout>
      </BrowserRouter>
    </>
  );
}