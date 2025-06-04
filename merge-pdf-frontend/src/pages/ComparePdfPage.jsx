import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ComponentStyles.css';

function ComparePdfPage() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!file1 || !file2) {
      setMessage('❌ Please upload both PDF files.');
      return;
    }

    setLoading(true);
    setMessage('🔍 Comparing PDFs...');

    const formData = new FormData();
    formData.append('pdf1', file1);
    formData.append('pdf2', file2);

    try {
      const response = await axios.post(
        'https://simple-backend-c67l.onrender.com/api/compare',
        formData
      );
      setResult(response.data);
      setMessage('✅ Comparison complete!');
    } catch (error) {
      setMessage('❌ Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-container">
      <h2>🧩 Compare PDF</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setFile1(e.target.files[0])} />
      <input type="file" accept="application/pdf" onChange={(e) => setFile2(e.target.files[0])} />
      <button onClick={handleCompare} disabled={loading}>
        {loading ? 'Comparing...' : 'Compare PDFs'}
      </button>
      <p>{message}</p>

      {result && (
        <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
          <h4>Similarity: {result.similarity}</h4>
          <h5>Differences:</h5>
          {result.differences.length === 0 ? (
            <p>🎉 No differences found</p>
          ) : (
            <ul>
              {result.differences.map((diff, i) => (
                <li key={i}>
                  <strong>Line {diff.line}:</strong><br />
                  📄 PDF1: {diff.pdf1}<br />
                  📄 PDF2: {diff.pdf2}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ComparePdfPage;
