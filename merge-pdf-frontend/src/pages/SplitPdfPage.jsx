// src/pages/SplitPdfPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SplitPdfPage.css';

function SplitPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [splitAfter, setSplitAfter] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
  };

  const handleSplitClick = async () => {
    if (!selectedFile || !splitAfter) {
      setMessage('❌ Please select a PDF and enter a valid split page.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('splitAfter', splitAfter);

    setLoading(true);
    setMessage('🔧 Splitting PDF...');

    try {
      const response = await axios.post(
        'https://pdf-backend-docker.onrender.com/api/split',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'split-parts.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('✅ Split successful. Download started.');
    } catch (error) {
      console.error('Split error:', error);
      setMessage('❌ Split failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <h2>✂️ Split PDF File</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <input
        type="number"
        placeholder="Split after page..."
        value={splitAfter}
        onChange={(e) => setSplitAfter(e.target.value)}
        min={1}
      />
      <button onClick={handleSplitClick} disabled={loading}>
        {loading ? 'Processing...' : 'Split PDF'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default SplitPdfPage;
