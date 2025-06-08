import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import ExcelIcon from '../assets/icons/excel2.png'; // Replace with your icon path
import '../styles/MergePdfPage.css'; // ✅ Shared design

function ExcelToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
    setDownloadUrl(null);
    setShowAnimation(false);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select an Excel file to convert.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Converting Excel to PDF...');
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/excel-to-pdf`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('✅ Conversion complete! Click below to download.');
      setShowAnimation(true);
      setSelectedFile(null);
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      setMessage('❌ Error converting Excel to PDF.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setMessage('');
    setDownloadUrl(null);
    setShowAnimation(false);
    document.querySelector('input[type="file"]').value = '';
  };

  return (
    <div className="merge-hero-container">
      <div className="merge-page">
        <main className="merge-main">
          <div className="merge-layout">
            {/* ✅ Left Column */}
            <div className="merge-left">
              <div className="merge-title-section">
                <img src={ExcelIcon} alt="Excel Icon" className="merge-icon-floating" />
                <div>
                  <h1>Excel to PDF</h1>
                  <p>Convert your spreadsheets into clean and professional PDFs.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload an Excel (.xls/.xlsx) file.<br />
                  Click <strong>“Convert to PDF”</strong> to download the result.<br />
                  Page layout and formatting will be retained.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose an Excel File</h3>
                <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
                <button className="primary-btn" onClick={handleConvertClick} disabled={loading}>
                  {loading ? 'Converting...' : 'Convert to PDF'}
                </button>
                <button className="reset-btn" onClick={resetFile}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

                {downloadUrl && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a href={downloadUrl} download="converted.pdf" className="primary-btn" style={{ background: '#4ade80' }}>
                      ⬇️ Download PDF File
                    </a>
                  </div>
                )}

                {showAnimation && (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                    <Lottie animationData={successTick} loop={false} style={{ width: 150, height: 150 }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Floating Background Icons */}
      <img src={ExcelIcon} alt="Excel" className="merge-float-icon float-top-left" />
      <img src={ExcelIcon} alt="Excel" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default ExcelToPdfPage;
