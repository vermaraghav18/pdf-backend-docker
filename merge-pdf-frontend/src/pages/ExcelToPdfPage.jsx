import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import ExcelIcon from '../assets/icons/merge.png'; // Replace with Excel icon if available
import '../styles/MergePdfPage.css'; // ✅ Reusing base styles

function ExcelToPdfPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setDownloadUrl('');
    setShowAnimation(false);
  };

  const handleConvert = async () => {
    if (!file) {
      setMessage('❌ Please upload an Excel file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage('🔄 Converting Excel to PDF...');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/excel-to-pdf`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setShowAnimation(true);
      setMessage('✅ Conversion successful!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setMessage('');
    setDownloadUrl('');
    setShowAnimation(false);
    document.getElementById('excel-upload').value = '';
  };

  return (
    <div className="merge-container">
      <h1 className="tool-title-text">📊 Excel to PDF Converter</h1>
      <div className="background-blur">
        <div className="blur-circle top-left"></div>
        <div className="blur-circle bottom-right"></div>
        <img src={ExcelIcon} alt="Excel Icon" className="background-tool-icon" />
      </div>

      <div className="upload-box">
        <input id="excel-upload" type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
        <button onClick={handleConvert} disabled={loading}>
          {loading ? 'Converting...' : 'Convert to PDF'}
        </button>
      </div>

      {message && <p className="status-text">{message}</p>}

      {showAnimation && (
        <div className="success-animation">
          <Lottie animationData={successTick} loop={false} />
        </div>
      )}

      {downloadUrl && (
        <a href={downloadUrl} download="converted.pdf" className="download-btn">
          📥 Download PDF
        </a>
      )}

      {(file || message || downloadUrl) && (
        <button className="reset-btn" onClick={reset}>
          🔁 Reset
        </button>
      )}
    </div>
  );
}

export default ExcelToPdfPage;
