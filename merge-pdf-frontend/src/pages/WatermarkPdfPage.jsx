import React, { useState, useRef } from 'react';
import '../styles/WatermarkPdfPage.css';

function WatermarkPdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [watermarkType, setWatermarkType] = useState('text');
  const [text, setText] = useState('');
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState('#000000');
  const [position, setPosition] = useState('center');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const canvasRef = useRef(null);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!pdfFile) return setMessage("Please upload a PDF.");
    setMessage("Applying watermark...");

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('type', watermarkType);
    formData.append('position', position);
    formData.append('opacity', opacity);

    if (watermarkType === 'text') {
      formData.append('text', text);
      formData.append('font', font);
      formData.append('fontSize', fontSize);
      formData.append('color', color);
    } else if (watermarkType === 'image') {
      if (!imageFile) return setMessage("Please upload an image.");
      formData.append('image', imageFile);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/watermark-pdf`,
        formData,
        { responseType: 'blob' }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'watermarked.pdf';
      a.click();
      setMessage('✅ Watermark applied successfully.');
    } catch (err) {
      setMessage('❌ Failed to apply watermark.');
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setImageFile(null);
    setPreviewUrl('');
    setText('');
    setFont('Arial');
    setFontSize(24);
    setColor('#000000');
    setOpacity(0.5);
    setPosition('center');
    setMessage('');
  };

  return (
    <div className="watermark-container">
      <h2>Watermark PDF</h2>

      <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
      {pdfFile && (
        <div className="preview-box">
          <embed src={previewUrl} type="application/pdf" width="100%" height="400px" />
        </div>
      )}

      <select value={watermarkType} onChange={(e) => setWatermarkType(e.target.value)}>
        <option value="text">Text Watermark</option>
        <option value="image">Image Watermark</option>
      </select>

      {watermarkType === 'text' ? (
        <>
          <input
            type="text"
            placeholder="Watermark text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Courier New</option>
            <option>Verdana</option>
          </select>
          <input type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </>
      ) : (
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      )}

      <label>Opacity</label>
      <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} />

      <label>Position</label>
      <select value={position} onChange={(e) => setPosition(e.target.value)}>
        <option value="top-left">Top Left</option>
        <option value="top-center">Top Center</option>
        <option value="top-right">Top Right</option>
        <option value="center">Center</option>
        <option value="bottom-left">Bottom Left</option>
        <option value="bottom-center">Bottom Center</option>
        <option value="bottom-right">Bottom Right</option>
      </select>

      <div className="watermark-actions">
        <button onClick={handleSubmit}>Apply Watermark</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default WatermarkPdfPage;
