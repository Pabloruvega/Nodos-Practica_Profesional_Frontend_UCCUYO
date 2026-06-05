import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import EvaluacionPage from './pages/EvaluacionPage'
import ResultadoPage from './pages/ResultadoPage'
import HistorialPage from './pages/HistorialPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/"          element={<EvaluacionPage />} />
          <Route path="/resultado" element={<ResultadoPage />} />
          <Route path="/historial" element={<HistorialPage />} />
          <Route path="*"          element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}