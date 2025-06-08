import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import PptIcon from '../assets/icons/ppt2.png'; // Replace if needed
import '../styles/MergePdfPage.css'; // ✅ Shared style

function PptToPdfPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setShowAnimation(false);
  };

  const handleConvert = async () => {
    if (!file) {
      setMessage('❌ Please select a PowerPoint (.ppt or .pptx) file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage('📡 Converting PowerPoint to PDF...');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/ppt-to-pdf`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage('✅ Conversion complete. File downloaded!');
      setShowAnimation(true);
      setFile(null);
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      console.error('❌ Conversion failed:', error);
      setMessage('❌ Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetFile = () => {
    setFile(null);
    setMessage('');
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
                <img src={PptIcon} alt="PPT Icon" className="merge-icon-floating" />
                <div>
                  <h1>PPT to PDF</h1>
                  <p>Convert PowerPoint presentations into professional PDF documents.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PowerPoint (.ppt or .pptx) file.<br />
                  Click <strong>“Convert to PDF”</strong> to begin the download.<br />
                  Slides are preserved perfectly.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose a PPT</h3>
                <input type="file" accept=".ppt,.pptx" onChange={handleFileChange} />
                <button className="primary-btn" onClick={handleConvert} disabled={loading}>
                  {loading ? 'Converting...' : 'Convert to PDF'}
                </button>
                <button className="reset-btn" onClick={resetFile}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

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

      {/* ✅ Floating Icons */}
      <img src={PptIcon} alt="PPT" className="merge-float-icon float-top-left" />
      <img src={PptIcon} alt="PPT" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default PptToPdfPage;
