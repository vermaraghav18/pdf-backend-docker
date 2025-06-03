import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MergePdfPage.css';

function MergePdfPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleMerge = async () => {
    if (files.length !== 2) {
      setMessage('❌ Please select exactly 2 PDF files.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('pdfs', file));

    setLoading(true);
    setMessage('📡 Merging PDFs...');

    try {
      const response = await axios.post(
        'https://simple-backend-sejz.onrender.com/api/merge',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();

      setMessage('✅ Merge complete. File downloaded!');
    } catch (err) {
      setMessage('❌ Merge failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-container">
      <h2>🧩 Merge PDF Files</h2>
      <input type="file" multiple accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleMerge} disabled={loading}>
        {loading ? 'Merging...' : 'Merge PDFs'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default MergePdfPage;
