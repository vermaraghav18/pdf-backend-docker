import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import CropIcon from '../assets/icons/merge.png';
import '../styles/MergePdfPage.css';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:10000'
    : 'https://your-backend.onrender.com';

function CropPdfPage() {
  const [file, setFile] = useState(null);
  const [top, setTop] = useState('');
  const [bottom, setBottom] = useState('');
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('top_percent', top);
    formData.append('bottom_percent', bottom);
    formData.append('left_percent', left);
    formData.append('right_percent', right);

    setLoading(true);
    setMessage('📐 Cropping PDF...');

    try {
      const response = await axios.post(`${BASE_URL}/api/crop`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'cropped.pdf';
      link.click();

      setMessage('✅ PDF cropped and downloaded.');
      setShowAnimation(true);
      setFile(null);
      setTop('');
      setBottom('');
      setLeft('');
      setRight('');
      document.querySelector('input[type="file"]').value = '';
    } catch (err) {
      setMessage('❌ Failed to crop PDF.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setTop('');
    setBottom('');
    setLeft('');
    setRight('');
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
                <img src={CropIcon} alt="Crop Icon" className="merge-icon-floating" />
                <div>
                  <h1>Crop PDF</h1>
                  <p>Trim margins and white space using custom crop values.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload your PDF and enter crop values (in %).<br />
                  Click <strong>“Crop PDF”</strong> to generate a cleaner layout.
                </p>
              </section>
            </div>

            <div className="merge-right">
              <form className="drop-zone" onSubmit={handleSubmit}>
                <h3>📥 Drop or Choose a PDF</h3>
                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
                  <input type="number" placeholder="Top (%)" value={top} onChange={(e) => setTop(e.target.value)} className="input-small" />
                  <input type="number" placeholder="Bottom (%)" value={bottom} onChange={(e) => setBottom(e.target.value)} className="input-small" />
                  <input type="number" placeholder="Left (%)" value={left} onChange={(e) => setLeft(e.target.value)} className="input-small" />
                  <input type="number" placeholder="Right (%)" value={right} onChange={(e) => setRight(e.target.value)} className="input-small" />
                </div>

                <button className="primary-btn" type="submit" disabled={loading}>
                  {loading ? 'Cropping...' : 'Crop PDF'}
                </button>
                <button className="reset-btn" type="button" onClick={reset}>Reset</button>

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

      <img src={CropIcon} alt="Crop" className="merge-float-icon float-top-left" />
      <img src={CropIcon} alt="Crop" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default CropPdfPage;
