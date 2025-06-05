// src/pages/RotatePdfPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function RotatePdfPage() {
  const [file, setFile] = useState(null);
  const [angle, setAngle] = useState('90');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRotate = async () => {
    if (!file || !angle) {
      setMessage('❌ Please select a file and angle.');
      return;
    }
    setLoading(true);
    setMessage('📡 Rotating PDF...');
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
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to rotate PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>🔄 Rotate PDF</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="Angle (90/180/270)" />
      <br /><br />
      <button onClick={handleRotate} disabled={loading}>
        {loading ? 'Rotating...' : 'Rotate PDF'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default RotatePdfPage;
