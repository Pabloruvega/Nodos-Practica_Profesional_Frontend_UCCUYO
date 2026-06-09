import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppLayout from './components/layout/AppLayout'
import PageTransition from './components/layout/PageTransition'
import EvaluacionPage from './pages/EvaluacionPage'
import ResultadoPage from './pages/ResultadoPage'
import HistorialPage from './pages/HistorialPage'
import NotFoundPage from './pages/NotFoundPage'

/**
 * AnimatePresence necesita detectar cambios de ruta.
 * Por eso separamos las rutas en un componente interno
 * que tiene acceso a useLocation.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><EvaluacionPage /></PageTransition>
        } />
        <Route path="/resultado" element={
          <PageTransition><ResultadoPage /></PageTransition>
        } />
        <Route path="/historial" element={
          <PageTransition><HistorialPage /></PageTransition>
        } />
        <Route path="*" element={
          <PageTransition><NotFoundPage /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </BrowserRouter>
  )
}