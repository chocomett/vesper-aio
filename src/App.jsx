import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#dbdbdb] flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-widest text-[#0a0f1d] mb-8">
          VESPER RPD
        </h1>
        
        <Routes>
          <Route path="/" element={
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-white/20">
              <h2 className="text-2xl font-bold mb-3 text-[#0a0f1d]">Welcome to Vesper AIO</h2>
              <p className="text-[#0a0f1d]/70 text-sm leading-relaxed">
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
