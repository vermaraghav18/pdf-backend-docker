import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MergePdfPage from './pages/MergePdfPage';
import SplitPdfPage from './pages/SplitPdfPage';
import CompressPdfPage from './pages/CompressPdfPage';
import ComparePdfPage from './pages/ComparePdfPage'; // ✅ Import Compare

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', margin: '2rem' }}>
        <h1>📎 PDF Tools</h1>

        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Merge PDF</Link>
          <Link to="/split" style={{ marginRight: '1rem' }}>Split PDF</Link>
          <Link to="/compress" style={{ marginRight: '1rem' }}>Compress PDF</Link>
          <Link to="/compare">Compare PDF</Link> {/* ✅ New Link */}
        </nav>

        <Routes>
          <Route path="/" element={<MergePdfPage />} />
          <Route path="/split" element={<SplitPdfPage />} />
          <Route path="/compress" element={<CompressPdfPage />} />
          <Route path="/compare" element={<ComparePdfPage />} /> {/* ✅ New Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
