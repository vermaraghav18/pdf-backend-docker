import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UnlockPdfPage.css';

function UnlockPdfPage() {
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
      const response = await axios.post(
        'http://localhost:10000/api/unlock',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'unlocked.pdf';
      link.click();
      setMessage('✅ PDF unlocked and downloaded.');
    } catch (err) {
      setMessage('❌ Failed to unlock PDF.');
    }
  };

  return (
    <div className="unlock-pdf-container">
      <h2>Unlock PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <input type="password" placeholder="Enter PDF password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Unlock PDF</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UnlockPdfPage;
