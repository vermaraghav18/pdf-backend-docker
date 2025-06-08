import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import PdfToJpgIcon from '../assets/icons/merge.png';
import '../styles/MergePdfPage.css';

function PdfToJpgPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setStatus('');
    setDownloadUrl('');
    setShowAnimation(false);
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      setStatus('❌ Please upload a PDF file.');
      return;
    }

    setStatus('🔄 Converting PDF to JPG...');
    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('dpi', '150');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/pdf-to-jpg`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('✅ Conversion complete!');
      setShowAnimation(true);
    } catch (err) {
      console.error(err);
      setStatus('❌ Conversion failed.');
    }
  };

  const reset = () => {
    setPdfFile(null);
    setStatus('');
    setDownloadUrl('');
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
                <img src={PdfToJpgIcon} alt="PDF to JPG" className="merge-icon-floating" />
                <div>
                  <h1>PDF to JPG</h1>
                  <p>Convert PDF pages into high-quality JPG images, packed in a ZIP.</p>
                </div>
              </div>
              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF file.<br />
                  Click <strong>“Convert to JPG”</strong> to get a ZIP of JPGs.
                </p>
              </section>
            </div>

            {/* Right */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose PDF</h3>
                <AiOutlineCloudUpload size={40} />
                <input type="file" accept="application/pdf" onChange={handleFileChange} />

                {pdfFile && <p style={{ margin: '1rem 0' }}>✅ Selected: {pdfFile.name}</p>}

                <button className="primary-btn" onClick={handleConvert}>Convert to JPG</button>
                <button className="reset-btn" onClick={reset}>Reset</button>

                {status && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{status}</p>}

                {downloadUrl && (
                  <a href={downloadUrl} download="converted-images.zip" className="primary-btn" style={{ marginTop: '1rem' }}>
                    ⬇️ Download ZIP
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

      <img src={PdfToJpgIcon} alt="PDF to JPG" className="merge-float-icon float-top-left" />
      <img src={PdfToJpgIcon} alt="PDF to JPG" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default PdfToJpgPage;
