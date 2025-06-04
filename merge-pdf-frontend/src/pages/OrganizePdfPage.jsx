import React, { useState } from 'react';
import axios from 'axios';
import '../styles/OrganizePdfPage.css';

function OrganizePdfPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF");

    const formData = new FormData();
    formData.append('pdf', file);

    // Example: rotate page 0 by 180°
    const operations = [
      { type: 'rotate', pageIndex: 0, rotate: 180 }
    ];

    formData.append('operations', JSON.stringify(operations));

    try {
      const res = await axios.post(
        'https://simple-backend-c67l.onrender.com/api/organize',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('✅ Organized PDF is ready!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to process PDF.');
    }
  };

  return (
    <div className="organize-container">
      <h2>Organize PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
      {downloadUrl && (
        <a href={downloadUrl} download="organized.pdf">📥 Download PDF</a>
      )}
    </div>
  );
}

export default OrganizePdfPage;
