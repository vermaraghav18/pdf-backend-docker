import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import RepairIcon from '../assets/icons/merge.png'; // Optional: Replace with your icon
import '../styles/MergePdfPage.css'; // ✅ Shared styles

function RepairPdfPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl('');
    setMessage('');
    setShowAnimation(false);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload a PDF");
    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);
    setMessage('📡 Repairing PDF...');

    try {
      const res = await axios.post(
        'https://pdf-backend-docker.onrender.com/api/repair',
        formData,
        { responseType: 'blob' }
      );
      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setMessage("✅ PDF repaired successfully!");
      setShowAnimation(true);
      setFile(null);
      document.querySelector('input[type="file"]').value = '';
    } catch {
      setMessage("❌ Failed to repair PDF.");
    } finally {
      setLoading(false);
    }
  };

  const resetFile = () => {
    setFile(null);
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
            {/* ✅ Left Column */}
            <div className="merge-left">
              <div className="merge-title-section">
                <img src={RepairIcon} alt="Repair Icon" className="merge-icon-floating" />
                <div>
                  <h1>Repair PDF</h1>
                  <p>Fix corrupted or unreadable PDFs with our smart repair tool.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a corrupted or broken PDF.<br />
                  Click <strong>“Submit”</strong> to auto-fix errors.<br />
                  Download your repaired file instantly.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose a PDF</h3>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Repairing...' : 'Submit'}
                </button>
                <button className="reset-btn" onClick={resetFile}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

                {downloadUrl && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a href={downloadUrl} download="repaired.pdf" className="primary-btn">
                      📥 Download PDF
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
      <img src={RepairIcon} alt="Repair" className="merge-float-icon float-top-left" />
      <img src={RepairIcon} alt="Repair" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default RepairPdfPage;
