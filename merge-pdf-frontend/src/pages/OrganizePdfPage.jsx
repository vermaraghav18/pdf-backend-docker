import React, { useState } from 'react';
import axios from 'axios';
import '../styles/OrganizePdfPage.css';

function OrganizePdfPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a PDF");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    // Sample operation: rotate page 0 by 180°
    const operations = [
      { type: 'rotate', pageIndex: 0, rotate: 180 }
    ];
    formData.append('operations', JSON.stringify(operations));

    try {
      setLoading(true);
      const response = await axios.post(
        'https://simple-backend-c67l.onrender.com/api/organize',
        formData,
        {
          headers: {
            // DO NOT manually set Content-Type — let browser handle it
          },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('✅ Organized PDF is ready!');
    } catch (err) {
      console.error('❌ Organize Error:', err);
      setMessage('❌ Failed to process PDF. Server might be sleeping.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="organize-container">
      <h2>Organize PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      <p>{message}</p>
      {downloadUrl && (
        <a href={downloadUrl} download="organized.pdf">📥 Download PDF</a>
      )}
    </div>
  );
}

export default OrganizePdfPage;
