import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import MergePdfPage from './pages/MergePdfPage';
import SplitPdfPage from './pages/SplitPdfPage';
import CompressPdfPage from './pages/CompressPdfPage';
import ComparePdfPage from './pages/ComparePdfPage';
import PdfToWordPage from './pages/PdfToWordPage';
import WordToPdfPage from './pages/WordToPdfPage';
import PdfToExcelPage from './pages/PdfToExcelPage';
import ExcelToPdfPage from './pages/ExcelToPdfPage';
import PdfToPptPage from './pages/PdfToPptPage';
import RotatePdfPage from './pages/RotatePdfPage';
import PptToPdfPage from './pages/PptToPdfPage';
import OrganizePdfPage from './pages/OrganizePdfPage';
import RepairPdfPage from './pages/RepairPdfPage';
import AddPageNumbers from './pages/AddPageNumbers';
import RedactPdfPage from './pages/RedactPdfPage';
import ProtectPdfPage from './pages/ProtectPdfPage';
import UnlockPdfPage from './pages/UnlockPdfPage';
import CropPdfPage from './pages/CropPdfPage';
import SignPdfPage from './pages/SignPdfPage';
import WatermarkPdfPage from './pages/WatermarkPdfPage';
import PdfToJpgPage from './pages/PdfToJpgPage';
import JpgToPdfPage from './pages/JpgToPdfPage';

import './index.css';

const tools = [
  { name: 'Merge PDF', icon: '📎', path: '/merge' },
  { name: 'Split PDF', icon: '✂️', path: '/split' },
  { name: 'Compress PDF', icon: '📉', path: '/compress' },
  { name: 'Compare PDF', icon: '🆚', path: '/compare' },
  { name: 'PDF to Word', icon: '📄', path: '/pdf-to-word' },
  { name: 'Word to PDF', icon: '📝', path: '/word-to-pdf' },
  { name: 'PDF to Excel', icon: '📊', path: '/pdf-to-excel' },
  { name: 'Excel to PDF', icon: '📈', path: '/excel-to-pdf' },
  { name: 'PDF to PPT', icon: '📋', path: '/pdf-to-ppt' },
  { name: 'PPT to PDF', icon: '📤', path: '/ppt-to-pdf' },
  { name: 'Rotate PDF', icon: '🔄', path: '/rotate' },
  { name: 'Organize PDF', icon: '📂', path: '/organize' },
  { name: 'Repair PDF', icon: '🛠️', path: '/repair' },
  { name: 'Add Page Numbers', icon: '🔢', path: '/add-page-numbers' },
  { name: 'Redact PDF', icon: '🕶️', path: '/redact' },
  { name: 'Protect PDF', icon: '🔐', path: '/protect' },
  { name: 'Unlock PDF', icon: '🔓', path: '/unlock' },
  { name: 'Crop PDF', icon: '✂️', path: '/crop' },
  { name: 'Sign PDF', icon: '✍️', path: '/sign-pdf' },
  { name: 'Watermark PDF', icon: '💧', path: '/watermark-pdf' },
  { name: 'PDF to JPG', icon: '🖼️', path: '/pdf-to-jpg' },
  { name: 'JPG to PDF', icon: '📷', path: '/jpg-to-pdf' },
];

function App() {
  return (
    <Router>
      <div className="app">
        {/* Hero Section */}

         {/* ✅ Modern Figma-Style Navbar */}
        <header className="navbar">
  <div className="navbar-left">
    <h2 className="logo">📎 PDF Tools</h2>
  </div>

  {/* ✅ Center Buttons */}
  <nav className="navbar-center">
    <Link to="/">Tools</Link>
    <Link to="/about">About</Link>
    <Link to="/support">Support</Link>
  </nav>
</header>




        <section className="hero-section">
          <h1 className="hero-title">📎 Powerful Online PDF Tools</h1>
          <p className="hero-subtext">Edit, Convert, Protect – All in One Place</p>
          <Link to="/merge" className="hero-cta">Try Now</Link>
        </section>

        {/* Tool Cards Grid */}
        <section className="tool-grid">
          {tools.map((tool, index) => (
            <Link to={tool.path} className="tool-card" key={index}>
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-name">{tool.name}</div>
            </Link>
          ))}
        </section>

        {/* Routes */}
        <Routes>
          <Route path="/merge" element={<MergePdfPage />} />
          <Route path="/split" element={<SplitPdfPage />} />
          <Route path="/compress" element={<CompressPdfPage />} />
          <Route path="/compare" element={<ComparePdfPage />} />
          <Route path="/pdf-to-word" element={<PdfToWordPage />} />
          <Route path="/word-to-pdf" element={<WordToPdfPage />} />
          <Route path="/pdf-to-excel" element={<PdfToExcelPage />} />
          <Route path="/excel-to-pdf" element={<ExcelToPdfPage />} />
          <Route path="/pdf-to-ppt" element={<PdfToPptPage />} />
          <Route path="/ppt-to-pdf" element={<PptToPdfPage />} />
          <Route path="/rotate" element={<RotatePdfPage />} />
          <Route path="/organize" element={<OrganizePdfPage />} />
          <Route path="/repair" element={<RepairPdfPage />} />
          <Route path="/add-page-numbers" element={<AddPageNumbers />} />
          <Route path="/redact" element={<RedactPdfPage />} />
          <Route path="/protect" element={<ProtectPdfPage />} />
          <Route path="/unlock" element={<UnlockPdfPage />} />
          <Route path="/crop" element={<CropPdfPage />} />
          <Route path="/sign-pdf" element={<SignPdfPage />} />
          <Route path="/watermark-pdf" element={<WatermarkPdfPage />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpgPage />} />
          <Route path="/jpg-to-pdf" element={<JpgToPdfPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
