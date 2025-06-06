import React, { useState } from 'react';
import axios from 'axios';
import '../styles/JpgToPdfPage.css';

function JpgToPdfPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
    setPdfUrl('');
    setStatus('');
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) {
      setStatus('Please upload at least one JPG image.');
      return;
    }

    setStatus('Converting JPG to PDF...');

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('images', file));

    try {
      const response = await axios.post(
        'http://localhost:10008/',
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setStatus('Conversion successful!');
    } catch (error) {
      setStatus('Error during conversion. Please try again.');
    }
  };

  return (
    <div className="jpg-to-pdf-container">
      <h2>JPG to PDF Converter</h2>
      <input
        type="file"
        accept="image/jpeg"
        multiple
        onChange={handleFileChange}
      />
      {selectedFiles.length > 0 && (
        <div className="preview-box">
          {selectedFiles.map((file, idx) => (
            <p key={idx}>{file.name}</p>
          ))}
        </div>
      )}
      <button onClick={handleConvert}>Convert to PDF</button>
      <div className="status-message">{status}</div>
      {pdfUrl && (
        <a href={pdfUrl} download="converted.pdf" className="download-btn">
          Download PDF
        </a>
      )}
    </div>
  );
}

export default JpgToPdfPage;
