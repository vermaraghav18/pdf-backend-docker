import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RepairPdfPage.css';

function RepairPdfPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadUrl('');
    setMessage('');
  };

  const handleSubmit = async () => {
    if (!file) return alert("Upload a PDF");
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const res = await axios.post(
        'https://pdf-backend-docker.onrender.com/api/repair',
        formData, { responseType: 'blob' }
      );
      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setMessage("✅ PDF repaired successfully!");
    } catch {
      setMessage("❌ Failed to repair PDF.");
    }
  };

  return (
    <div className="tool-container">
      <h2>🛠 Repair PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
      <p>{message}</p>
      {downloadUrl && <a href={downloadUrl} download="repaired.pdf">📥 Download PDF</a>}
    </div>
  );
}

export default RepairPdfPage;
    