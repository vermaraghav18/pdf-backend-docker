import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import JpgToPdfIcon from '../assets/icons/merge.png';
import '../styles/MergePdfPage.css';

function JpgToPdfPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [status, setStatus] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
    setPdfUrl('');
    setStatus('');
    setShowAnimation(false);
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      setStatus('❌ Please upload at least one JPG image.');
      return;
    }

    setStatus('🔄 Converting JPG to PDF...');
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/jpg-to-pdf`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setStatus('✅ Conversion successful!');
      setShowAnimation(true);
    } catch (error) {
      setStatus('❌ Conversion failed. Please try again.');
    }
  };

  const reset = () => {
    setSelectedFiles([]);
    setPdfUrl('');
    setStatus('');
    setShowAnimation(false);
    document.querySelector('input[type="file"]').value = '';
  };

  return (
    <div className="merge-hero-container">
      <div className="merge-page">
        <main className="merge-main">
          <div className="merge-layout">
            {/* Left */}
            <div className="merge-left">
              <div className="merge-title-section">
                <img src={JpgToPdfIcon} alt="JPG to PDF" className="merge-icon-floating" />
                <div>
                  <h1>JPG to PDF</h1>
                  <p>Merge multiple JPG images into a single PDF document.</p>
                </div>
              </div>
              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload JPG images (in order).<br />
                  Click <strong>“Convert to PDF”</strong> to download your document.
                </p>
              </section>
            </div>

            {/* Right */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose JPGs</h3>
                <AiOutlineCloudUpload size={40} />
                <input type="file" accept="image/jpeg" multiple onChange={handleFileChange} />

                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    {selectedFiles.map((file, idx) => (
                      <p key={idx}>📷 {file.name}</p>
                    ))}
                  </div>
                )}

                <button className="primary-btn" onClick={handleConvert}>Convert to PDF</button>
                <button className="reset-btn" onClick={reset}>Reset</button>

                {status && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{status}</p>}

                {pdfUrl && (
                  <a href={pdfUrl} download="converted.pdf" className="primary-btn" style={{ marginTop: '1rem' }}>
                    ⬇️ Download PDF
                  </a>
                )}

                {showAnimation && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Lottie animationData={successTick} loop={false} style={{ width: 150 }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <img src={JpgToPdfIcon} alt="JPG to PDF" className="merge-float-icon float-top-left" />
      <img src={JpgToPdfIcon} alt="JPG to PDF" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default JpgToPdfPage;
