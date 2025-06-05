import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddPageNumbers.css';

function AddPageNumbers() {
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
        'https://simple-backend-lfh7.onrender.com/api/add-page-numbers',
        formData, { responseType: 'blob' }
      );
      const blob = new Blob([res.data], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));
      setMessage("✅ Page numbers added!");
    } catch {
      setMessage("❌ Failed to add page numbers.");
    }
  };

  return (
    <div className="tool-container">
      <h2>🔢 Add Page Numbers</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
      <p>{message}</p>
      {downloadUrl && <a href={downloadUrl} download="numbered.pdf">📥 Download PDF</a>}
    </div>
  );
}

export default AddPageNumbers;
