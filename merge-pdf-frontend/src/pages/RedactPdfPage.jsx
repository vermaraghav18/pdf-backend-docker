import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RedactPdfPage.css';

function RedactPdfPage() {
  const [file, setFile] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleSubmit = async () => {
    if (!file || !keywords) return alert("Upload PDF & enter keywords");
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('keywords', keywords);
    try {
          const res = await axios.post('http://localhost:10000/api/redact', formData, {
      responseType: 'blob'
    });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setMessage("✅ Redaction complete!");
    } catch {
      setMessage("❌ Redaction failed.");
    }
  };

  return (
    <div className="tool-container">
      <h2>🕵️‍♂️ Redact PDF</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Enter keywords to redact"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <p>{message}</p>
      {downloadUrl && <a href={downloadUrl} download="redacted.pdf">📥 Download PDF</a>}
    </div>
  );
}

export default RedactPdfPage;
