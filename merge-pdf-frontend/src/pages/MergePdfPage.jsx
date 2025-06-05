import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MergePdfPage.css';

function MergePdfPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setMessage(selected.length ? `📂 Selected ${selected.length} files` : '');
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
        'https://pdf-backend-docker.onrender.com/api/merge', // ✅ Corrected URL
        formData,
        { responseType: 'blob' }
      );


      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setMessage('✅ Merge complete. File downloaded!');
    } catch (error) {
      console.error('Merge failed:', error);
      setMessage('❌ Merge failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-container">
      <h2>🧩 Merge PDF Files</h2>
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button onClick={handleMerge} disabled={loading}>
        {loading ? 'Merging...' : 'Merge PDFs'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default MergePdfPage;
