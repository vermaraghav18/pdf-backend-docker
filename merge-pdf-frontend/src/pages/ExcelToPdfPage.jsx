import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function ExcelToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected file: ${file.name}` : '');
    setDownloadUrl(null);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select an Excel file to convert.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Converting Excel to PDF...');
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/excel-to-pdf`,
      formData,
      { responseType: 'blob' }
    );


      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('✅ Conversion complete! Click below to download.');
    } catch (error) {
      setMessage('❌ Error converting Excel to PDF.');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="tool-page">
      <h2>📊 Convert Excel to PDF</h2>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} className="file-input" />
      <button onClick={handleConvertClick} disabled={loading} className="btn">
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
      <p className="status-message">{message}</p>
      {downloadUrl && (
        <a href={downloadUrl} download="converted.pdf" className="download-link">
          ⬇️ Download PDF File
        </a>
      )}
    </div>
  );
}

export default ExcelToPdfPage;
