import React, { useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import RotateIcon from '../assets/icons/rotate.png'; // Optional icon
import '../styles/MergePdfPage.css'; // ✅ Shared styles

function RotatePdfPage() {
  const [file, setFile] = useState(null);
  const [angle, setAngle] = useState('90');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleRotate = async () => {
    if (!file || !angle) {
      setMessage('❌ Please select a file and angle.');
      return;
    }

    setLoading(true);
    setMessage('📡 Rotating PDF...');
    setShowAnimation(false);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('angle', angle);

    try {
      const response = await axios.post(
        'https://pdf-backend-docker.onrender.com/api/rotate',
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rotated.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setMessage('✅ Rotation complete. File downloaded!');
      setShowAnimation(true);
      setFile(null);
      setAngle('90');
      document.querySelector('input[type="file"]').value = '';
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to rotate PDF');
    } finally {
      setLoading(false);
    }
  };

  const resetInputs = () => {
    setFile(null);
    setAngle('90');
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
                <img src={RotateIcon} alt="Rotate Icon" className="merge-icon-floating" />
                <div>
                  <h1>Rotate PDF</h1>
                  <p>Rotate all pages in your PDF to a specific angle (90°, 180°, or 270°).</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF file.<br />
                  Choose a rotation angle.<br />
                  Click <strong>“Rotate PDF”</strong> to apply the transformation.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose a PDF</h3>
                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                <input
                  type="number"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  placeholder="Angle (90/180/270)"
                  style={{ marginTop: '1rem', padding: '0.5rem', width: '80%', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
                <button className="primary-btn" onClick={handleRotate} disabled={loading}>
                  {loading ? 'Rotating...' : 'Rotate PDF'}
                </button>
                <button className="reset-btn" onClick={resetInputs}>Reset</button>

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

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
      <img src={RotateIcon} alt="Rotate" className="merge-float-icon float-top-left" />
      <img src={RotateIcon} alt="Rotate" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default RotatePdfPage;
