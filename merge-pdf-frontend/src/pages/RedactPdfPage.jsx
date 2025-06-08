import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import RedactIcon from '../assets/icons/merge.png';
import '../styles/MergePdfPage.css';

function RedactPdfPage() {
  const [file, setFile] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSubmit = async () => {
    if (!file || !keywords) return alert("Upload PDF & enter keywords");

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('keywords', keywords);

    setLoading(true);
    setMessage('📡 Redacting sensitive content...');

    try {
      const res = await axios.post('https://pdf-backend-docker.onrender.com/api/redact', formData, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setMessage("✅ Redaction complete!");
      setShowAnimation(true);
      setFile(null);
      setKeywords('');
      document.querySelector('input[type="file"]').value = '';
    } catch {
      setMessage("❌ Redaction failed.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setKeywords('');
    setMessage('');
    setDownloadUrl('');
    setShowAnimation(false);
    document.querySelector('input[type="file"]').value = '';
  };

  return (
    <div className="merge-hero-container">
      <div className="merge-page">
        <main className="merge-main">
          <div className="merge-layout">
            <div className="merge-left">
              <div className="merge-title-section">
                <img src={RedactIcon} alt="Redact" className="merge-icon-floating" />
                <div>
                  <h1>Redact PDF</h1>
                  <p>Remove confidential keywords or phrases from your PDF securely.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF file.<br />
                  Enter keywords to be redacted.<br />
                  Click <strong>“Submit”</strong> and download your redacted PDF.
                </p>
              </section>
            </div>

            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose a PDF</h3>
                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                <input
                  type="text"
                  placeholder="Enter keywords to redact"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  style={{ marginTop: '1rem', padding: '0.5rem', width: '90%', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
                <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Redacting...' : 'Submit'}
                </button>
                <button className="reset-btn" onClick={reset}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

                {downloadUrl && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a href={downloadUrl} download="redacted.pdf" className="primary-btn">
                      📥 Download PDF
                    </a>
                  </div>
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

      <img src={RedactIcon} alt="Redact" className="merge-float-icon float-top-left" />
      <img src={RedactIcon} alt="Redact" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default RedactPdfPage;
