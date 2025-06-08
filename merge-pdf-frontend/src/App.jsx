// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import HeroAnimation from './assets/hero-lottie.json';
import './index.css';

import MergeIcon from './assets/icons/merge.png';
import SplitIcon from './assets/icons/split.png';

// ✅ Import All Feature Pages
import MergePdfPage from './pages/MergePdfPage';
import SplitPdfPage from './pages/SplitPdfPage';
import CompressPdfPage from './pages/CompressPdfPage';
import ComparePdfPage from './pages/ComparePdfPage';
import PdfToWordPage from './pages/PdfToWordPage';
import WordToPdfPage from './pages/WordToPdfPage';
import PdfToExcelPage from './pages/PdfToExcelPage';
import ExcelToPdfPage from './pages/ExcelToPdfPage';
import PdfToPptPage from './pages/PdfToPptPage';
import PptToPdfPage from './pages/PptToPdfPage';
import RotatePdfPage from './pages/RotatePdfPage';
import OrganizePdfPage from './pages/OrganizePdfPage';
import RepairPdfPage from './pages/RepairPdfPage';
import AddPageNumbersPage from './pages/AddPageNumbers'; // ✅ Correct file name

import RedactPdfPage from './pages/RedactPdfPage';
import ProtectPdfPage from './pages/ProtectPdfPage';
import UnlockPdfPage from './pages/UnlockPdfPage';
import CropPdfPage from './pages/CropPdfPage';
import SignPdfPage from './pages/SignPdfPage';
import WatermarkPdfPage from './pages/WatermarkPdfPage';
import PdfToJpgPage from './pages/PdfToJpgPage';
import JpgToPdfPage from './pages/JpgToPdfPage';

// ✅ Tool Config
const tools = [
  { name: 'Merge PDF', icon: MergeIcon, path: '/merge', tooltip: 'Combine multiple PDFs into one', description: 'Combine PDFs in the order you want with the easiest PDF merger available.' },
  { name: 'Split PDF', icon: SplitIcon, path: '/split', tooltip: 'Split one PDF into multiple files', description: 'Split PDF pages into separate files in seconds.' },
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
      <Routes>
        {/* ✅ Home Route */}
        <Route
          path="/"
          element={
            <div className="app">
              <motion.header className="navbar" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="navbar-left">
                  <h2 className="logo">📎 PDF Tools</h2>
                </div>
                <nav className="navbar-center">
                  <Link to="/">Tools</Link>
                  <Link to="/about">About</Link>
                  <Link to="/support">Support</Link>
                </nav>
              </motion.header>

              <section className="hero-section">
                <motion.div className="hero-left" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                  <h1 className="hero-title">⚡ Powerful PDF Toolkit</h1>
                  <p className="hero-subtext">Edit, Convert, Organize — All in One Place</p>
                  <Link to="/merge" className="hero-cta">Get Started</Link>
                </motion.div>

                <motion.div className="hero-lottie" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                  <Lottie animationData={HeroAnimation} loop={true} />
                </motion.div>
              </section>

              <section className="tool-grid">
                {tools.map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5, type: 'spring' }}
                  >
                    <Link to={tool.path} title={tool.tooltip} className="tool-card">
                      <div className="tool-icon-box" style={{ backgroundColor: tool.color }}>
                        {tool.icon.startsWith('data:') || tool.icon.startsWith('/') || tool.icon.endsWith('.png') ? (
                          <img src={tool.icon} alt={tool.name} className="tool-icon" />
                        ) : (
                          <span className="emoji-icon">{tool.icon}</span>
                        )}
                      </div>
                      <div className="tool-title">{tool.name}</div>
                      <div className="tool-desc">{tool.description}</div>
                    </Link>
                  </motion.div>
                ))}
              </section>

              <footer className="footer">
                <div className="footer-logo">📎 PDF Tools</div>
                <div className="footer-links">
                  <a href="/privacy">Privacy</a>
                  <a href="/terms">Terms</a>
                  <a href="/contact">Contact</a>
                </div>
                <div>© {new Date().getFullYear()} All rights reserved.</div>
              </footer>
            </div>
          }
        />

        {/* ✅ Feature Routes */}
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
        <Route path="/add-page-numbers" element={<AddPageNumbersPage />} />
        <Route path="/redact" element={<RedactPdfPage />} />
        <Route path="/protect" element={<ProtectPdfPage />} />
        <Route path="/unlock" element={<UnlockPdfPage />} />
        <Route path="/crop" element={<CropPdfPage />} />
        <Route path="/sign-pdf" element={<SignPdfPage />} />
        <Route path="/watermark-pdf" element={<WatermarkPdfPage />} />
        <Route path="/pdf-to-jpg" element={<PdfToJpgPage />} />
        <Route path="/jpg-to-pdf" element={<JpgToPdfPage />} />
      </Routes>
    </Router>
  );
}

export default App;
