import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/navbar'
import EvaluacionPage from './pages/EvaluacionPage'
import ResultadoPage from './pages/ResultadoPage'
import HistorialPage from './pages/HistorialPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<EvaluacionPage />} />
          <Route path="/resultado" element={<ResultadoPage />} />
          <Route path="/historial" element={<HistorialPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}