import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PdfToJpgPage.css';

function PdfToJpgPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [status, setStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setStatus('');
    setDownloadUrl('');
  };

 const handleConvert = async () => {
  if (!pdfFile) {
    setStatus('Please upload a PDF file.');
    return;
  }

  setStatus('Converting PDF to JPG...');
  const formData = new FormData();
  formData.append('file', pdfFile);
  formData.append('dpi', '150'); // ✅ Must come before axios.post

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/pdf-to-jpg`, formData,
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    setDownloadUrl(url);
    setStatus('Conversion complete! Click below to download.');
  } catch (err) {
    console.error(err);
    setStatus('Conversion failed. Please try again.');
  }
};

  return (
    <div className="pdf-to-jpg-container">
      <h2>Convert PDF to JPG</h2>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      <div className="preview-box">
        {pdfFile && <p>✅ Selected: {pdfFile.name}</p>}
      </div>

      <button onClick={handleConvert}>Convert to JPG</button>

      {status && <p className="status-message">{status}</p>}

      {downloadUrl && (
        <a href={downloadUrl} download="converted-images.zip" className="download-btn">
          Download ZIP
        </a>
      )}
    </div>
  );
}

export default PdfToJpgPage;
