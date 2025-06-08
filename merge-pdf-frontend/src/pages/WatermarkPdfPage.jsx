import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import WatermarkIcon from '../assets/icons/merge.png';
import '../styles/MergePdfPage.css';

function WatermarkPdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [text, setText] = useState('');
  const [opacity, setOpacity] = useState(0.5);
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setMessage('');
    setShowAnimation(false);
  };

  const handleSubmit = async () => {
    if (!pdfFile || !text) {
      setMessage('❌ Please upload a PDF and enter watermark text.');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('method', 'text');
    formData.append('text', text);
    formData.append('x', 100);
    formData.append('y', 150);
    formData.append('page', 0);
    formData.append('opacity', opacity);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/watermark`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'watermarked.pdf';
      a.click();

      setMessage('✅ Watermark applied successfully.');
      setShowAnimation(true);
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to apply watermark.');
    }
  };

  const resetForm = () => {
    setPdfFile(null);
    setText('');
    setOpacity(0.5);
    setMessage('');
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
                <img src={WatermarkIcon} alt="Watermark Icon" className="merge-icon-floating" />
                <div>
                  <h1>Watermark PDF</h1>
                  <p>Overlay text watermark on your PDF with style and precision.</p>
                </div>
              </div>
              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF and enter watermark text.<br />
                  Adjust opacity and click <strong>“Apply Watermark”</strong>.<br />
                  Download the result instantly.
                </p>
              </section>
            </div>

            {/* Right */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose PDF</h3>
                <AiOutlineCloudUpload size={40} />
                <input type="file" accept="application/pdf" onChange={handleFileChange} />

                <input
                  type="text"
                  placeholder="Watermark Text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ marginTop: '1rem' }}
                />

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  placeholder="Opacity (0 - 1)"
                />

                <button className="primary-btn" onClick={handleSubmit}>Apply Watermark</button>
                <button className="reset-btn" onClick={resetForm}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

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

      <img src={WatermarkIcon} alt="Watermark" className="merge-float-icon float-top-left" />
      <img src={WatermarkIcon} alt="Watermark" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default WatermarkPdfPage;
