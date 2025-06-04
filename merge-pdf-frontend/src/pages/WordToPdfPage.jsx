import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function WordToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage(e.target.files[0] ? `📂 Selected: ${e.target.files[0].name}` : '');
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a Word (.docx) file.');
      return;
    }

    setLoading(true);
    setMessage('📄 Converting to PDF...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'https://simple-backend-sejz.onrender.com/api/word-to-pdf',
        formData,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('✅ Converted and ready to download!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <h2>📄 Word to PDF</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default WordToPdfPage;
