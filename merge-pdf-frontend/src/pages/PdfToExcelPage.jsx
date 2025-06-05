import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PdfToExcelPage() {
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
      setMessage('❌ Please select a PDF file to convert.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Converting PDF to Excel...');
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
  'https://pdf-backend-docker.onrender.com/api/pdf-to-excel', // ✅ Corrected URL
  formData,
  { responseType: 'blob' }
);


      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('✅ Conversion complete! Click below to download.');
    } catch (error) {
      setMessage('❌ Error converting PDF to Excel.');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="tool-page">
      <h2>📄 Convert PDF to Excel</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} className="file-input" />
      <button onClick={handleConvertClick} disabled={loading} className="btn">
        {loading ? 'Converting...' : 'Convert to Excel'}
      </button>
      <p className="status-message">{message}</p>
      {downloadUrl && !loading && (
        <a href={downloadUrl} download="converted.xlsx" className="download-link">
          ⬇️ Download Excel File
        </a>
      )}
    </div>
  );
}

export default PdfToExcelPage;
