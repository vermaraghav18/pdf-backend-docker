// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import HeroAnimation from './assets/hero-lottie.json';
import HeroSubBanner from './components/HeroSubBanner';
import ShieldBanner from './components/ShieldBanner';

import './index.css';

import MergeIcon from './assets/icons/merge.png';

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
  { name: 'Split PDF', icon: MergeIcon, path: '/split', tooltip: 'Split one PDF into multiple files', description: 'Split PDF pages into separate files in seconds.' },
  { name: 'Compress PDF', icon: MergeIcon, path: '/compress', tooltip: 'Reduce PDF file size', description: 'Shrink PDF file size without compromising quality.' },
  { name: 'Compare PDF', icon: MergeIcon, path: '/compare', tooltip: 'Visually compare two PDFs', description: 'Detect differences between two PDF documents side by side.' },
  { name: 'PDF to Word', icon: MergeIcon, path: '/pdf-to-word', tooltip: 'Convert PDF to Word document', description: 'Easily convert your PDF file into an editable Word document.' },
  { name: 'Word to PDF', icon: MergeIcon, path: '/word-to-pdf', tooltip: 'Convert Word document to PDF', description: 'Turn DOCX files into PDFs quickly and securely.' },
  { name: 'PDF to Excel', icon: MergeIcon, path: '/pdf-to-excel', tooltip: 'Convert PDF to Excel spreadsheet', description: 'Extract tables from PDF and convert to Excel format (.xlsx).' },
  { name: 'Excel to PDF', icon: MergeIcon, path: '/excel-to-pdf', tooltip: 'Convert Excel spreadsheet to PDF', description: 'Convert your Excel files into PDFs while preserving layout.' },
  { name: 'PDF to PPT', icon: MergeIcon, path: '/pdf-to-ppt', tooltip: 'Convert PDF to PowerPoint slides', description: 'Transform your PDF into editable PowerPoint slides (.pptx).' },
  { name: 'PPT to PDF', icon: MergeIcon, path: '/ppt-to-pdf', tooltip: 'Convert PowerPoint to PDF', description: 'Convert your presentation into a clean PDF document.' },
  { name: 'Rotate PDF', icon: MergeIcon, path: '/rotate', tooltip: 'Rotate PDF pages', description: 'Rotate selected pages within your PDF file.' },
  { name: 'Organize PDF', icon: MergeIcon, path: '/organize', tooltip: 'Reorder, delete, or duplicate pages', description: 'Easily rearrange and manage pages inside a PDF.' },
  { name: 'Repair PDF', icon: MergeIcon, path: '/repair', tooltip: 'Fix corrupted or broken PDFs', description: 'Restore damaged or unreadable PDF files instantly.' },
  { name: 'Add Page Numbers', icon: MergeIcon, path: '/add-page-numbers', tooltip: 'Add page numbers to PDF', description: 'Insert page numbers into your PDF file quickly.' },
  { name: 'Redact PDF', icon: MergeIcon, path: '/redact', tooltip: 'Hide sensitive content in PDF', description: 'Black out or redact confidential text in your PDF.' },
  { name: 'Protect PDF', icon: MergeIcon, path: '/protect', tooltip: 'Add password protection to PDF', description: 'Secure your PDF by locking it with a custom password.' },
  { name: 'Unlock PDF', icon: MergeIcon, path: '/unlock', tooltip: 'Remove password from PDF', description: 'Unlock password-protected PDF files for editing or printing.' },
  { name: 'Crop PDF', icon: MergeIcon, path: '/crop', tooltip: 'Crop unwanted margins from PDF', description: 'Trim your PDF pages using percentage-based cropping.' },
  { name: 'Sign PDF', icon: MergeIcon, path: '/sign-pdf', tooltip: 'Add your signature to a PDF', description: 'Type or draw your signature and place it anywhere in your PDF.' },
  { name: 'Watermark PDF', icon: MergeIcon, path: '/watermark-pdf', tooltip: 'Add text watermark to PDF', description: 'Overlay watermark text on your PDF file with custom opacity.' },
  { name: 'PDF to JPG', icon: MergeIcon, path: '/pdf-to-jpg', tooltip: 'Convert PDF pages to JPG images', description: 'Turn every page in your PDF into high-resolution JPGs.' },
  { name: 'JPG to PDF', icon: MergeIcon, path: '/jpg-to-pdf', tooltip: 'Convert JPG images to a PDF', description: 'Combine JPG files into a single PDF document.' },
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

                <motion.div className="hero-image-wrapper" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                <div className="hero-blob-container">
                  <div className="hero-blob hero-blob-purple"></div>
                  <div className="hero-blob hero-blob-pink"></div>
                 <img src="/images/herosection.png" alt="PDF Tools UI" className="hero-image" />

                </div>
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
                
                <HeroSubBanner /> 
                <ShieldBanner />
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
