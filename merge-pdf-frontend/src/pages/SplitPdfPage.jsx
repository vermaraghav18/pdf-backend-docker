import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import SplitIcon from '../assets/icons/split.png';
import '../styles/SplitPdfPage.css';

function SplitPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [splitAfter, setSplitAfter] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
  };

  const handleSplitClick = async () => {
    if (!selectedFile || !splitAfter) {
      setMessage('❌ Please select a PDF and enter a valid split page.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('splitAfter', splitAfter);

    setLoading(true);
    setMessage('🔧 Splitting PDF...');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000'}/api/split`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'split-parts.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ Split successful. Download started.');
      setShowAnimation(true);
      setSelectedFile(null);
      setSplitAfter('');
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      console.error('Split error:', error);
      setMessage('❌ Split failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSplitAfter('');
    setMessage('');
    setShowAnimation(false);
    document.querySelector('input[type="file"]').value = '';
  };

  return (
    <div className="split-hero-container">
      <div className="split-page">
        <main className="split-main">
          <div className="split-layout">
            <div className="split-left">
              <div className="split-title-section">
                <img src={SplitIcon} alt="Split Icon" className="split-icon-floating" />
                <div>
                  <h1>Split PDF</h1>
                  <p>Break large PDFs into smaller pieces with precision.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF file and enter the page number after which to split.<br />
                  Click <strong>“Split PDF”</strong> and your ZIP file will be ready to download.
                </p>
              </section>
            </div>

            <div className="split-right">
              <div className="drop-zone">
                <h3>📥 Choose a PDF to Split</h3>
                <AiOutlineCloudUpload size={40} />
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <input
                  type="number"
                  placeholder="Split after page..."
                  value={splitAfter}
                  onChange={(e) => setSplitAfter(e.target.value)}
                  min={1}
                />
                <button className="primary-btn" onClick={handleSplitClick} disabled={loading}>
                  {loading ? 'Processing...' : 'Split PDF'}
                </button>
                <button className="reset-btn" onClick={resetForm}>Reset</button>
              </div>

              {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

              {showAnimation && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                  <Lottie animationData={successTick} loop={false} style={{ width: 150, height: 150 }} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <img src={SplitIcon} alt="Split" className="split-float-icon float-top-left" />
      <img src={SplitIcon} alt="Split" className="split-float-icon float-bottom-right" />
    </div>
  );
}

export default SplitPdfPage;
