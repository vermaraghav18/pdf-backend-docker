import React, { useState, useRef } from 'react';
import '../styles/WatermarkPdfPage.css';

function WatermarkPdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [text, setText] = useState('');
  const [opacity, setOpacity] = useState(0.5);
  const [message, setMessage] = useState('');

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const handleSubmit = async () => {
    if (!pdfFile) {
      setMessage('Please upload a PDF first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('method', 'text');
    formData.append('text', text);
    formData.append('x', 100); // adjust as needed
    formData.append('y', 150);
    formData.append('page', 0); // first page
    formData.append('opacity', opacity);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/watermark`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Request failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'watermarked.pdf');
      document.body.appendChild(link);
      link.click();
      setMessage('✅ Watermark applied successfully.');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error applying watermark.');
    }
  };

  return (
    <div className="watermark-container">
      <h2>Watermark PDF</h2>
      <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter watermark text"
      />
      <input
        type="number"
        min="0"
        max="1"
        step="0.1"
        value={opacity}
        onChange={(e) => setOpacity(e.target.value)}
      />
      <button onClick={handleSubmit}>Apply Watermark</button>
      <p>{message}</p>
    </div>
  );
}

export default WatermarkPdfPage;
