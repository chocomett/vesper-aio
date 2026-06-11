import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Vesper AIO</h1>
        <p className="text-gray-600 mb-8">Internal Management System (React SPA)</p>

        <Routes>
          <Route path="/" element={
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
              <p className="text-gray-500 text-sm">
                Project has been successfully migrated to pure React with Vite + Tailwind CSS v4.
              </p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
