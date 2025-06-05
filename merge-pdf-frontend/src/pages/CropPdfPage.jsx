import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CropPdfPage.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('top_percent', top);
    formData.append('bottom_percent', bottom);
    formData.append('left_percent', left);
    formData.append('right_percent', right);

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
    } catch (err) {
      setMessage('❌ Failed to crop PDF.');
    }
  };

  return (
    <div className="crop-pdf-container">
      <h2>Crop PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        <input type="number" placeholder="Top (%)" value={top} onChange={(e) => setTop(e.target.value)} />
        <input type="number" placeholder="Bottom (%)" value={bottom} onChange={(e) => setBottom(e.target.value)} />
        <input type="number" placeholder="Left (%)" value={left} onChange={(e) => setLeft(e.target.value)} />
        <input type="number" placeholder="Right (%)" value={right} onChange={(e) => setRight(e.target.value)} />
        <button type="submit">Crop PDF</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CropPdfPage;
