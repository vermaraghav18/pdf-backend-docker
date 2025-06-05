import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ProtectPdfPage.css';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:10000'
    : 'https://your-backend.onrender.com';

function ProtectPdfPage() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !password) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', password);

    try {
    const response = await axios.post(`${BASE_URL}/api/protect`, formData, {
      responseType: 'blob',
    });


      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'protected.pdf';
      link.click();
      setMessage('✅ PDF protected and downloaded.');
    } catch (err) {
      setMessage('❌ Failed to protect PDF.');
    }
  };

  return (
    <div className="protect-pdf-container">
      <h2>Protect PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Protect PDF</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProtectPdfPage;
