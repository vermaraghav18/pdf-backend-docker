// src/pages/SplitPdfPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SplitPdfPage.css';

function SplitPdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [splitAfter, setSplitAfter] = useState('');
  const [message, setMessage] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setMessage('');
  };

  const handleSplit = async () => {
    if (!pdfFile || !splitAfter) {
      setMessage('❌ Please provide a file and split page number.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('splitAfter', splitAfter);

    try {
      setDownloading(true);
      const response = await axios.post(
        'https://simple-backend-sejz.onrender.com/api/split',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'split-output.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMessage('✅ PDF successfully split and downloaded.');
    } catch (error) {
      console.error('Split error:', error);
      setMessage('❌ Split failed.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="split-container">
      <h2>✂️ Split PDF File</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <input
        type="number"
        placeholder="Split after page..."
        value={splitAfter}
        onChange={(e) => setSplitAfter(e.target.value)}
      />
      <button onClick={handleSplit} disabled={downloading}>
        {downloading ? 'Splitting...' : 'Split PDF'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SplitPdfPage;
