import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function CompressPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('recommended');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
  };

  const handleCompressClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file to compress.');
      return;
    }

    setLoading(true);
    setMessage('📉 Compressing PDF...');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('level', compressionLevel);

    try {
      const response = await axios.post(
        'https://simple-backend-sejz.onrender.com/api/compress',
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'compressed.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ PDF compressed successfully!');
    } catch (error) {
      setMessage('❌ Compression failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <h2>📉 Compress PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <select value={compressionLevel} onChange={(e) => setCompressionLevel(e.target.value)}>
        <option value="recommended">Recommended</option>
        <option value="high">High Quality</option>
        <option value="extreme">Maximum Compression</option>
      </select>
      <button onClick={handleCompressClick} disabled={loading}>
        {loading ? 'Compressing...' : 'Compress PDF'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default CompressPdfPage;
