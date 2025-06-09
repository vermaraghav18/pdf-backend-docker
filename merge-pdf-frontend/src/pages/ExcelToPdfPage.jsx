import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function ExcelToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage('');
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setLoading(true);

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) throw new Error('VITE_API_BASE_URL is not defined.');

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/excel-to-pdf`,
        formData,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = selectedFile.name.replace(/\.(xlsx|xls)$/i, '.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage('✅ File converted and downloaded.');
    } catch (error) {
      setMessage('❌ Conversion failed.');
      console.error('🛑 Excel to PDF error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <h2>Convert Excel to PDF</h2>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Converting...' : 'Convert & Download'}
      </button>
      <p>{message}</p>
    </div>
  );
}

export default ExcelToPdfPage;
