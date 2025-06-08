import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import LockIcon from '../assets/icons/merge.png'; // Optional icon
import '../styles/MergePdfPage.css';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:10000'
    : 'https://your-backend.onrender.com';

function ProtectPdfPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !password) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    setLoading(true);
    setMessage('🔐 Encrypting PDF...');

    try {
      const response = await axios.post(`${BASE_URL}/api/protect`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'protected.pdf';
      link.click();

      setMessage('✅ PDF protected and downloaded.');
      setShowAnimation(true);
      setFile(null);
      setPassword('');
      document.querySelector('input[type="file"]').value = '';
    } catch (err) {
      setMessage('❌ Failed to protect PDF.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPassword('');
    setMessage('');
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
                <img src={LockIcon} alt="Lock" className="merge-icon-floating" />
                <div>
                  <h1>Protect PDF</h1>
                  <p>Encrypt your PDF with a password and prevent unauthorized access.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF and set your desired password.<br />
                  Click <strong>“Protect PDF”</strong> to secure your file.<br />
                  The download will begin automatically.
                </p>
              </section>
            </div>

            <div className="merge-right">
              <form className="drop-zone" onSubmit={handleSubmit}>
                <h3>📥 Drop or Choose a PDF</h3>
                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginTop: '1rem', padding: '0.5rem', width: '90%', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
                <button className="primary-btn" type="submit" disabled={loading}>
                  {loading ? 'Encrypting...' : 'Protect PDF'}
                </button>
                <button className="reset-btn" type="button" onClick={resetForm}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

                {showAnimation && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <Lottie animationData={successTick} loop={false} style={{ width: 150 }} />
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>

      <img src={LockIcon} alt="Lock" className="merge-float-icon float-top-left" />
      <img src={LockIcon} alt="Lock" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default ProtectPdfPage;
