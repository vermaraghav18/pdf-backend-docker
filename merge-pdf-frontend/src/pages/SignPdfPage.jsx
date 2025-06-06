    import React, { useRef, useState } from 'react';
    import axios from 'axios';
    import '../styles/SignPdfPage.css';

    function SignPdfPage() {
    const [file, setFile] = useState(null);
    const [signatureText, setSignatureText] = useState('');
    const [signatureMethod, setSignatureMethod] = useState('type');
    const [x, setX] = useState(100);
    const [y, setY] = useState(100);
    const [page, setPage] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [message, setMessage] = useState('');
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDrawStart = (e) => {
        isDrawing.current = true;
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    };

    const handleDraw = (e) => {
        if (!isDrawing.current) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const handleDrawEnd = () => {
        isDrawing.current = false;
    };

    const handleSubmit = async () => {
        if (!file) return setMessage('Please upload a PDF.');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('method', signatureMethod);
        formData.append('text', signatureText);
        formData.append('x', x);
        formData.append('y', y);
        formData.append('page', page);
        
        if (signatureMethod === 'draw') {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL();
        const blob = await (await fetch(dataURL)).blob();
        formData.append('image', blob, 'signature.png');
        }

        try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/sign`,
            formData,
            { responseType: 'blob' }
        );

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'signed.pdf';
        a.click();
        setMessage('✅ Signed PDF downloaded.');
        } catch (err) {
        console.error(err);
        setMessage('❌ Failed to sign PDF');
        }
    };

    return (
        <div className="sign-container">
        <h2>🖊️ Sign PDF</h2>

        <div className="input-group">
            <label>Upload PDF</label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <div className="input-group">
            <label>Signature Method</label>
            <div className="radio-options">
            <label><input type="radio" value="type" checked={signatureMethod === 'type'} onChange={() => setSignatureMethod('type')} /> Typed</label>
            <label><input type="radio" value="draw" checked={signatureMethod === 'draw'} onChange={() => setSignatureMethod('draw')} /> Draw</label>
            </div>
        </div>

        {signatureMethod === 'type' && (
            <div className="input-group">
            <label>Typed Name</label>
            <input type="text" placeholder="Your Name" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} />
            </div>
        )}

        {signatureMethod === 'draw' && (
            <div className="canvas-section">
            <label>Draw your Signature</label>
            <canvas
                ref={canvasRef}
                width={300}
                height={100}
                onMouseDown={handleDrawStart}
                onMouseMove={handleDraw}
                onMouseUp={handleDrawEnd}
            />
            </div>
        )}

        <div className="input-group">
            <label>X Position</label>
            <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} />
        </div>
        <div className="input-group">
            <label>Y Position</label>
            <input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} />
        </div>
        <div className="input-group">
            <label>Page Number</label>
            <input type="number" value={page} onChange={(e) => setPage(Number(e.target.value))} />
        </div>
        <div className="input-group">
            <label>Opacity (0 to 1)</label>
            <input type="number" step="0.1" min="0" max="1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
        </div>

        <div className="input-group">
            <button onClick={handleSubmit}>Sign and Download</button>
        </div>

        <p className="message">{message}</p>
        </div>
    );
    }

    export default SignPdfPage;
