import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import CompareIcon from '../assets/icons/compare.png';
import '../styles/ComparePdfPage.css';

function ComparePdfPage() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleCompare = async () => {
    if (!file1 || !file2) {
      setMessage('❌ Please upload both PDF files.');
      return;
    }

    setLoading(true);
    setMessage('🔍 Comparing PDFs...');

    const formData = new FormData();
    formData.append('pdf1', file1);
    formData.append('pdf2', file2);

    try {
      const response = await axios.post(
        'https://pdf-backend-docker.onrender.com/api/compare',
        formData
      );
      setResult(response.data);
      setMessage('✅ Comparison complete!');
      setShowAnimation(true);
    } catch (error) {
      setMessage('❌ Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile1(null);
    setFile2(null);
    setResult(null);
    setMessage('');
    setShowAnimation(false);
    document.querySelectorAll('input[type="file"]').forEach(input => (input.value = ''));
  };

  return (
    <div className="compare-hero-container">
      <div className="compare-page">
        <main className="compare-main">
          <div className="compare-layout">
            {/* ✅ Left Column */}
            <div className="compare-left">
              <div className="compare-title-section">
                <img src={CompareIcon} alt="Compare Icon" className="compare-icon-floating" />
                <div>
                  <h1>Compare PDFs</h1>
                  <p>Find differences and measure content similarity.</p>
                </div>
              </div>

              {/* ✅ Tool Info */}
              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload two PDF files to compare line-by-line.<br />
                  This tool highlights differences and calculates similarity score.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="compare-right">
              <div className="compare-dropzone">
                <h3>📤 Upload Two PDFs</h3>
                <AiOutlineCloudUpload size={40} />
                <p>Choose both files to compare</p>

                <input type="file" accept="application/pdf" onChange={(e) => setFile1(e.target.files[0])} />
                <input type="file" accept="application/pdf" onChange={(e) => setFile2(e.target.files[0])} />

                <button className="primary-btn" onClick={handleCompare} disabled={loading}>
                  {loading ? 'Comparing...' : 'Compare PDFs'}
                </button>
                <button className="reset-btn" onClick={reset}>Reset</button>
              </div>

              {message && <p className="compare-message">{message}</p>}

              {showAnimation && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <Lottie animationData={successTick} loop={false} style={{ width: 150, height: 150 }} />
                </div>
              )}

              {result && (
                <div className="compare-results">
                  <h4>Similarity: {result.similarity}</h4>
                  <h5>Differences:</h5>
                  {result.differences.length === 0 ? (
                    <p>🎉 No differences found</p>
                  ) : (
                    <ul>
                      {result.differences.map((diff, i) => (
                        <li key={i}>
                          <strong>Line {diff.line}:</strong><br />
                          📄 PDF1: {diff.pdf1}<br />
                          📄 PDF2: {diff.pdf2}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Background Floating Icons */}
      <img src={CompareIcon} alt="Compare" className="compare-float-icon float-top-left" />
      <img src={CompareIcon} alt="Compare" className="compare-float-icon float-bottom-right" />
    </div>
  );
}

export default ComparePdfPage;
