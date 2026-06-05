import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import EvaluacionPage from './pages/EvaluacionPage'
import ResultadoPage from './pages/ResultadoPage'
import HistorialPage from './pages/HistorialPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<EvaluacionPage />} />
          <Route path="/resultado" element={<ResultadoPage />} />
          <Route path="/historial" element={<HistorialPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}