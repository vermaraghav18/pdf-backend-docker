// src/components/AnimatedRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// ✅ All pages
import MergePdfPage from '../pages/MergePdfPage';
import SplitPdfPage from '../pages/SplitPdfPage';
import CompressPdfPage from '../pages/CompressPdfPage';
import ComparePdfPage from '../pages/ComparePdfPage';
import PdfToWordPage from '../pages/PdfToWordPage';
import WordToPdfPage from '../pages/WordToPdfPage';
import PdfToExcelPage from '../pages/PdfToExcelPage';
import ExcelToPdfPage from '../pages/ExcelToPdfPage';
import PdfToPptPage from '../pages/PdfToPptPage';
import PptToPdfPage from '../pages/PptToPdfPage';
import RotatePdfPage from '../pages/RotatePdfPage';
import OrganizePdfPage from '../pages/OrganizePdfPage';
import RepairPdfPage from '../pages/RepairPdfPage';
import AddPageNumbers from '../pages/AddPageNumbers';
import RedactPdfPage from '../pages/RedactPdfPage';
import ProtectPdfPage from '../pages/ProtectPdfPage';
import UnlockPdfPage from '../pages/UnlockPdfPage';
import CropPdfPage from '../pages/CropPdfPage';
import SignPdfPage from '../pages/SignPdfPage';
import WatermarkPdfPage from '../pages/WatermarkPdfPage';
import PdfToJpgPage from '../pages/PdfToJpgPage';
import JpgToPdfPage from '../pages/JpgToPdfPage';

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
    </AnimatePresence>
  );
}
