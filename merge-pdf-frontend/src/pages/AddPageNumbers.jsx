import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import NumberIcon from '../assets/icons/merge.png'; // Replace with your icon if needed
import '../styles/MergePdfPage.css'; // ✅ Reuse shared styles

function AddPageNumbers() {
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
    formData.append('file', file); // fix the key to match multer


    setLoading(true);
    setMessage('📡 Adding page numbers...');

    try {
     const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/add-page-numbers`,
      formData,
      { responseType: 'blob' }
      );
      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setMessage("✅ Page numbers added!");
      setShowAnimation(true);
      setFile(null);
      document.querySelector('input[type="file"]').value = '';
    } catch {
      setMessage("❌ Failed to add page numbers.");
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
                <img src={NumberIcon} alt="Number Icon" className="merge-icon-floating" />
                <div>
                  <h1>Add Page Numbers</h1>
                  <p>Automatically insert page numbers on every page of your PDF.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload your PDF file.<br />
                  Click <strong>“Submit”</strong> to insert numbered footers.<br />
                  Download your updated document instantly.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose a PDF</h3>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Processing...' : 'Submit'}
                </button>
                <button className="reset-btn" onClick={resetFile}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

                {downloadUrl && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a href={downloadUrl} download="numbered.pdf" className="primary-btn">
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
      <img src={NumberIcon} alt="Number" className="merge-float-icon float-top-left" />
      <img src={NumberIcon} alt="Number" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default AddPageNumbers;
