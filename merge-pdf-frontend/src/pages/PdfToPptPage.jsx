import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import PptIcon from '../assets/icons/ppt.png'; // Replace with your icon
import '../styles/MergePdfPage.css'; // ✅ Shared styling

function PdfToPptPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected: ${file.name}` : '');
    setDownloadUrl(null);
    setShowAnimation(false);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Converting to PowerPoint...');
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'https://pdf-backend-docker.onrender.com/api/pdf-to-ppt',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });

      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('✅ Conversion complete! Download your PPT below.');
      setShowAnimation(true);
      setSelectedFile(null);
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      setMessage('❌ Conversion failed.');
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
                <img src={PptIcon} alt="PPT Icon" className="merge-icon-floating" />
                <div>
                  <h1>PDF to PowerPoint</h1>
                  <p>Transform your PDFs into editable PowerPoint presentations.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF file.<br />
                  Click <strong>“Convert to PPT”</strong> to get a .pptx file.<br />
                  Slides will match the layout and content of the PDF.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose a PDF</h3>
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                <button className="primary-btn" onClick={handleConvertClick} disabled={loading}>
                  {loading ? 'Converting...' : 'Convert to PPT'}
                </button>
                <button className="reset-btn" onClick={resetFile}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

                {downloadUrl && !loading && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a href={downloadUrl} download="converted.pptx" className="primary-btn" style={{ background: '#f97316' }}>
                      ⬇️ Download PPTX File
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
      <img src={PptIcon} alt="PPT" className="merge-float-icon float-top-left" />
      <img src={PptIcon} alt="PPT" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default PdfToPptPage;
