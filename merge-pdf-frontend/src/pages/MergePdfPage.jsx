import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import MergeIcon from '../assets/icons/merge.png';
import '../styles/MergePdfPage.css';

function MergePdfPage() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const preventDefaults = (e) => {
    e.preventDefault();
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setMessage('❌ Please select at least 2 PDF files.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('pdfs', file));

    setLoading(true);
    setMessage('📡 Merging PDFs...');

    try {
      const response = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000'}/api/merge`,
  formData,
  { responseType: 'blob' }
);


      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setMessage('✅ Merge complete. File downloaded!');
      setShowAnimation(true);
      setFiles([]);
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      console.error('Merge failed:', error);
      setMessage('❌ Merge failed.');
    } finally {
      setLoading(false);
    }
  };

  const resetFiles = () => {
    setFiles([]);
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
                <img src={MergeIcon} alt="Merge Icon" className="merge-icon-floating" />
                <div>
                  <h1>Merge PDFs</h1>
                  <p>Combines and enhances PDFs with smart intensity.</p>
                </div>
              </div>

              {/* ✅ Tool Info Instructions */}
              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload two or more PDF files.<br />
                  Click <strong>“Merge & Download”</strong> to combine them into one.<br />
                  Your final PDF will be ready in seconds.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div
                className="drop-zone"
                onDrop={handleDrop}
                onDragOver={preventDefaults}
                onDragEnter={preventDefaults}
                onDragLeave={preventDefaults}
              >
                <h3 style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>📥 Drop or Choose PDFs</h3>
                <AiOutlineCloudUpload size={40} />
                <p>Drag & drop files here</p>
                <input type="file" multiple accept="application/pdf" onChange={handleFileChange} />
                <button className="primary-btn" onClick={handleMerge} disabled={loading}>
                  {loading ? 'Merging...' : 'Merge & Download'}
                </button>
                <button className="reset-btn" onClick={resetFiles}>Reset</button>
              </div>

              {files.length > 0 && (
                <div className="file-list">
                  {files.map((file, index) => (
                    <div key={index} className="file-item">📄 {file.name}</div>
                  ))}
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
        </main>
      </div>

      {/* ✅ Floating Background Merge Icons */}
      <img src={MergeIcon} alt="Merge" className="merge-float-icon float-top-left" />
      <img src={MergeIcon} alt="Merge" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default MergePdfPage;
