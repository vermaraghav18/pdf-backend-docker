import React, { useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import axios from 'axios';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import SignIcon from '../assets/icons/merge.png';
import '../styles/MergePdfPage.css';

function SignPdfPage() {
  const [file, setFile] = useState(null);
  const [signatureText, setSignatureText] = useState('');
  const [signatureMethod, setSignatureMethod] = useState('type');
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const [page, setPage] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  const handleDrawStart = (e) => {
    isDrawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleDraw = (e) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleDrawEnd = () => {
    isDrawing.current = false;
  };

  const handleSubmit = async () => {
    if (!file) return setMessage('❌ Please upload a PDF.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('method', signatureMethod);
    formData.append('text', signatureText);
    formData.append('x', x);
    formData.append('y', y);
    formData.append('page', page);
    formData.append('opacity', opacity);

    if (signatureMethod === 'draw') {
      const dataURL = canvasRef.current.toDataURL();
      const blob = await (await fetch(dataURL)).blob();
      formData.append('image', blob, 'signature.png');
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/sign`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signed.pdf';
      a.click();
      setMessage('✅ Signed PDF downloaded.');
      setShowAnimation(true);
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to sign PDF');
    }
  };

  const resetForm = () => {
    setFile(null);
    setSignatureText('');
    setSignatureMethod('type');
    setX(100);
    setY(100);
    setPage(0);
    setOpacity(1);
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
                <img src={SignIcon} alt="Sign Icon" className="merge-icon-floating" />
                <div>
                  <h1>Sign PDF</h1>
                  <p>Add your handwritten or typed signature to any PDF file.</p>
                </div>
              </div>
              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload a PDF, type or draw your signature,<br />
                  set position and opacity, then download your signed document.
                </p>
              </section>
            </div>

            {/* Right */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose PDF</h3>
                <AiOutlineCloudUpload size={40} />
                <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block' }}>Signature Method:</label>
                  <select value={signatureMethod} onChange={(e) => setSignatureMethod(e.target.value)}>
                    <option value="type">Type</option>
                    <option value="draw">Draw</option>
                  </select>
                </div>

                {signatureMethod === 'type' && (
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    style={{ marginTop: '1rem', width: '100%' }}
                  />
                )}

                {signatureMethod === 'draw' && (
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={100}
                    onMouseDown={handleDrawStart}
                    onMouseMove={handleDraw}
                    onMouseUp={handleDrawEnd}
                    style={{ marginTop: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}
                  />
                )}

                <input type="number" value={page} onChange={(e) => setPage(Number(e.target.value))} placeholder="Page Number" />
                <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} placeholder="X Position" />
                <input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} placeholder="Y Position" />
                <input type="number" step="0.1" min="0" max="1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} placeholder="Opacity (0–1)" />

                <button className="primary-btn" onClick={handleSubmit}>Sign & Download</button>
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

      <img src={SignIcon} alt="Sign" className="merge-float-icon float-top-left" />
      <img src={SignIcon} alt="Sign" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default SignPdfPage;
