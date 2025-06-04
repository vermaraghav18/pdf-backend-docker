// src/pages/PptToPdfPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PptToPdfPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleConvert = async () => {
    if (!file) {
      setMessage('❌ Please select a PowerPoint (.ppt or .pptx) file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage('📡 Converting PowerPoint to PDF...');

    try {
      const response = await axios.post(
        'https://simple-backend-c67l.onrender.com/api/ppt-to-pdf',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setMessage('✅ Conversion complete. File downloaded!');
    } catch (error) {
      console.error('Conversion failed:', error);
      setMessage('❌ Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ppt-to-pdf-container">
      <h2>📑 Convert PowerPoint to PDF</h2>
      <input
        type="file"
        accept=".ppt,.pptx"
        onChange={handleFileChange}
      />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default PptToPdfPage;
