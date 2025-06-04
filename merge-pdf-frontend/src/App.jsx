import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MergePdfPage from './pages/MergePdfPage';
import SplitPdfPage from './pages/SplitPdfPage';
import CompressPdfPage from './pages/CompressPdfPage';
import ComparePdfPage from './pages/ComparePdfPage';
import PdfToJpgPage from './pages/PdfToJpgPage';
import PdfToWordPage from './pages/PdfToWordPage';
import WordToPdfPage from './pages/WordToPdfPage';
import PdfToExcelPage from './pages/PdfToExcelPage'; // ✅ New Import
import ExcelToPdfPage from './pages/ExcelToPdfPage'; // ✅ New Import
import PdfToPptPage from './pages/PdfToPptPage'; // ✅ New Import
import RotatePdfPage from './pages/RotatePdfPage'; // ✅ Add this import
import PptToPdfPage from './pages/PptToPdfPage'; // ✅ New
import OrganizePdfPage from './pages/OrganizePdfPage';

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', margin: '2rem' }}>
        <h1>📎 PDF Tools</h1>

        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Merge PDF</Link>
          <Link to="/split" style={{ marginRight: '1rem' }}>Split PDF</Link>
          <Link to="/compress" style={{ marginRight: '1rem' }}>Compress PDF</Link>
          <Link to="/compare" style={{ marginRight: '1rem' }}>Compare PDF</Link>
          <Link to="/pdf-to-jpg" style={{ marginRight: '1rem' }}>PDF to JPG</Link>
          <Link to="/pdf-to-word" style={{ marginRight: '1rem' }}>PDF to Word</Link>
          <Link to="/word-to-pdf" style={{ marginRight: '1rem' }}>Word to PDF</Link>
          <Link to="/pdf-to-excel" style={{ marginRight: '1rem' }}>PDF to Excel</Link> {/* ✅ New Link */}
          <Link to="/excel-to-pdf" style={{ marginRight: '1rem' }}>Excel to PDF</Link> {/* ✅ New Link */}
          <Link to="/pdf-to-ppt" style={{ marginRight: '1rem' }}>PDF to PPT</Link>
          <Link to="/rotate" style={{ marginRight: '1rem' }}>Rotate Pdf</Link>
           <Link to="/ppt-to-pdf" style={{ marginRight: '1rem' }}>PPT to PDF</Link> {/* ✅ */}
           <Link to="/organize" style={{ marginRight: '1rem' }}>Organize PDF</Link>


        </nav>

        <Routes>
          <Route path="/" element={<MergePdfPage />} />
          <Route path="/split" element={<SplitPdfPage />} />
          <Route path="/compress" element={<CompressPdfPage />} />
          <Route path="/compare" element={<ComparePdfPage />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpgPage />} />
          <Route path="/pdf-to-word" element={<PdfToWordPage />} />
          <Route path="/word-to-pdf" element={<WordToPdfPage />} />
          <Route path="/pdf-to-excel" element={<PdfToExcelPage />} /> {/* ✅ New Route */}
          <Route path="/excel-to-pdf" element={<ExcelToPdfPage />} /> {/* ✅ New Route */}
          <Route path="/pdf-to-ppt" element={<PdfToPptPage />} /> {/* ✅ New Route */}
          <Route path="/rotate" element={<RotatePdfPage />} /> // ✅ Add inside 
           <Route path="/ppt-to-pdf" element={<PptToPdfPage />} /> {/* ✅ */}
           <Route path="/organize" element={<OrganizePdfPage />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
