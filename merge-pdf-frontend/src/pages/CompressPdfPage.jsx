import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import CompressIcon from '../assets/icons/compress.png';
import '../styles/CompressPdfPage.css';

function CompressPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('recommended');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
  };

  const handleCompressClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to compress.');
      return;
    }

    setLoading(true);
    setMessage('📉 Compressing PDF...');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('level', compressionLevel);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000'}/api/compress`,
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'compressed.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ PDF compressed successfully!');
      setShowAnimation(true);
      setSelectedFile(null);
      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      setMessage('❌ Compression failed.');
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
    <div className="compress-hero-container">
      <div className="compress-page">
        <main className="compress-main">
          <div className="compress-layout">
            {/* ✅ Left Column */}
            <div className="compress-left">
              <div className="compress-title-section">
                <img src={CompressIcon} alt="Compress Icon" className="compress-icon-floating" />
                <div>
                  <h1>Compress PDF</h1>
                  <p>Reduce file size without compromising too much quality.</p>
                </div>
              </div>

              {/* ✅ Tool Info */}
              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF file and select the compression level.<br />
                  Click <strong>“Compress PDF”</strong> to reduce file size.<br />
                  You’ll get a smaller, downloadable file instantly.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="compress-right">
              <div className="compress-dropzone">
                <h3>📥 Upload Your PDF</h3>
                <AiOutlineCloudUpload size={40} />
                <p>Choose the file and compression level</p>

                <input type="file" accept="application/pdf" onChange={handleFileChange} />
                <select value={compressionLevel} onChange={(e) => setCompressionLevel(e.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="high">High Quality</option>
                  <option value="extreme">Maximum Compression</option>
                </select>

                <button className="primary-btn" onClick={handleCompressClick} disabled={loading}>
                  {loading ? 'Compressing...' : 'Compress PDF'}
                </button>
                <button className="reset-btn" onClick={resetFile}>Reset</button>
              </div>

              {message && <p className="compress-message">{message}</p>}

              {showAnimation && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <Lottie animationData={successTick} loop={false} style={{ width: 150, height: 150 }} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Floating Background Icons */}
      <img src={CompressIcon} alt="Compress" className="compress-float-icon float-top-left" />
      <img src={CompressIcon} alt="Compress" className="compress-float-icon float-bottom-right" />
    </div>
  );
}

export default CompressPdfPage;
