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
        `${import.meta.env.VITE_API_BASE_URL}/api/ppt-to-pdf`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage('✅ Conversion complete. File downloaded!');
    } catch (error) {
      console.error('❌ Conversion failed:', error);
      setMessage('❌ Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <h2>📑 Convert PowerPoint to PDF</h2>
      <input
        type="file"
        accept=".ppt,.pptx"
        onChange={handleFileChange}
        className="file-input"
      />
      <button onClick={handleConvert} disabled={loading} className="btn">
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
      <p className="status-message">{message}</p>
    </div>
  );
}

export default PptToPdfPage;
