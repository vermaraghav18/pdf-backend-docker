import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import WordIcon from '../assets/icons/word.png'; // Replace with your icon if available
import '../styles/MergePdfPage.css'; // ✅ Reusing Merge design

function WordToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage(e.target.files[0] ? `📂 Selected: ${e.target.files[0].name}` : '');
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a Word (.docx) file.');
      return;
    }

    setLoading(true);
    setMessage('📄 Converting to PDF...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/word-to-pdf`,
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ Converted and ready to download!');
      setShowAnimation(true);
      setSelectedFile(null);
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      console.error(error);
      setMessage('❌ Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
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
                <img src={WordIcon} alt="Word Icon" className="merge-icon-floating" />
                <div>
                  <h1>Word to PDF</h1>
                  <p>Convert your Word (.docx) documents to PDF format effortlessly.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a Word (.docx) file.<br />
                  Click <strong>“Convert to PDF”</strong> to get your PDF instantly.<br />
                  Clean and quick conversion every time.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose a Word File</h3>
                <input type="file" accept=".docx" onChange={handleFileChange} />
                <button className="primary-btn" onClick={handleConvert} disabled={loading}>
                  {loading ? 'Converting...' : 'Convert to PDF'}
                </button>
                <button className="reset-btn" onClick={resetFile}>Reset</button>

                {selectedFile && (
                  <div className="file-list">
                    <div className="file-item">📄 {selectedFile.name}</div>
                  </div>
                )}

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

      {/* ✅ Floating Background Icons */}
      <img src={WordIcon} alt="Word" className="merge-float-icon float-top-left" />
      <img src={WordIcon} alt="Word" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default WordToPdfPage;
