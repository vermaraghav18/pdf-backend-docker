import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function PdfToPptPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(file ? `📂 Selected: ${file.name}` : '');
    setDownloadUrl(null);
  };

  const handleConvertClick = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a PDF file.');
      return;
    }

    setLoading(true);
    setMessage('⏳ Converting to PowerPoint...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'https://pdf-backend-docker.onrender.com/api/pdf-to-ppt',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });

      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('✅ Conversion complete! Download your PPT below.');
    } catch (error) {
      setMessage('❌ Conversion failed.');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="tool-page">
      <h2>📄 Convert PDF to PowerPoint</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} className="file-input" />
      <button onClick={handleConvertClick} disabled={loading} className="btn">
        {loading ? 'Converting...' : 'Convert to PPT'}
      </button>
      <p className="status-message">{message}</p>
      {downloadUrl && !loading && (
        <a href={downloadUrl} download="converted.pptx" className="download-link">
          ⬇️ Download PPTX File
        </a>
      )}
    </div>
  );
}

export default PdfToPptPage;
