import React, { useState } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Lottie from 'lottie-react';
import successTick from '../assets/successTick.json';
import OrganizeIcon from '../assets/icons/organize.png';
import '../styles/MergePdfPage.css';
import '../styles/OrganizePdfPage.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function OrganizePdfPage() {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageImages, setPageImages] = useState([]);
  const [operations, setOperations] = useState([]);
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setOperations([]);
    setDownloadUrl('');
    setMessage('');
    setShowAnimation(false);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      try {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        setNumPages(pdf.numPages);

        const imgs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.4 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          imgs.push(canvas.toDataURL());
        }

        setPageImages(imgs);
      } catch (err) {
        setMessage('❌ Failed to render PDF preview');
        console.error(err);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleRotate = (index) => {
    setOperations((prev) => [...prev, { type: 'rotate', pageIndex: index, rotate: 90 }]);
    setMessage(`Page ${index + 1} marked for rotation`);
  };

  const handleDelete = (index) => {
    setOperations((prev) => [...prev, { type: 'delete', pageIndex: index }]);
    setMessage(`Page ${index + 1} marked for deletion`);
  };

  const handleDuplicate = (index) => {
    setOperations((prev) => [...prev, { type: 'duplicate', pageIndex: index, times: 2 }]);
    setMessage(`Page ${index + 1} will be duplicated`);
  };

  const handleSubmit = async () => {
    if (!pdfFile) return alert("Please upload a PDF first.");
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('operations', JSON.stringify(operations));

    try {
      setLoading(true);
      const res = await axios.post(
        'https://pdf-backend-docker.onrender.com/api/organize',
        formData,
        { responseType: 'blob' }
      );
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('✅ Organized PDF is ready!');
      setShowAnimation(true);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to organize PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="merge-hero-container">
      <div className="merge-page">
        <main className="merge-main">
          <div className="merge-layout">
            {/* ✅ Left Column */}
            <div className="merge-left">
              <div className="merge-title-section">
                <img src={OrganizeIcon} alt="Organize Icon" className="merge-icon-floating" />
                <div>
                  <h1>Organize PDF</h1>
                  <p>Reorder, rotate, delete, or duplicate pages in your PDF.</p>
                </div>
              </div>

              <section className="tool-info">
                <h2>Tool Info</h2>
                <p className="tool-instructions">
                  Upload your PDF to preview all pages.<br />
                  Use the 🔄, ❌, and ➕ buttons to modify the layout.<br />
                  Click <strong>“Submit & Download”</strong> to save changes.
                </p>
              </section>
            </div>

            {/* ✅ Right Column */}
            <div className="merge-right">
              <div className="drop-zone">
                <h3>📥 Drop or Choose a PDF</h3>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />

                <div className="thumbnail-grid">
                  {pageImages.map((img, index) => (
                    <div key={index} className="thumbnail-box">
                      <img src={img} alt={`Page ${index + 1}`} />
                      <div className="actions">
                        <button onClick={() => handleRotate(index)}>🔄</button>
                        <button onClick={() => handleDelete(index)}>❌</button>
                        <button onClick={() => handleDuplicate(index)}>➕</button>
                      </div>
                      <p>Page {index + 1}</p>
                    </div>
                  ))}
                </div>

                {pageImages.length > 0 && (
                  <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Processing...' : 'Submit & Download'}
                  </button>
                )}

                {message && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{message}</p>}

                {downloadUrl && (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <a href={downloadUrl} download="organized.pdf" className="primary-btn">
                      📥 Download PDF
                    </a>
                  </div>
                )}

                {showAnimation && (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                    <Lottie animationData={successTick} loop={false} style={{ width: 150, height: 150 }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Floating Icons */}
      <img src={OrganizeIcon} alt="Organize" className="merge-float-icon float-top-left" />
      <img src={OrganizeIcon} alt="Organize" className="merge-float-icon float-bottom-right" />
    </div>
  );
}

export default OrganizePdfPage;
