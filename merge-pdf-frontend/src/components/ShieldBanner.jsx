import React from 'react';
import Lottie from 'lottie-react';
import protectAnimation from '../assets/lottie/protectPdfAnimation.json';
import { Link } from 'react-router-dom';
import '../styles/ShieldBanner.css';

function ShieldBanner() {
  return (
    <section className="shield-banner">
      <div className="shield-left">
        <h2 className="shield-title">Protect Your PDFs with Confidence</h2>
        <p className="shield-description">
          Encrypt your documents with a secure password. Prevent unauthorized access, copying, editing, or printing with just one click.
        </p>
        <Link to="/protect" className="shield-cta">🔐 Protect a PDF Now</Link>
      </div>

      <div className="shield-right">
        <Lottie animationData={protectAnimation} loop={true} className="shield-lottie" />
      </div>
    </section>
  );
}

export default ShieldBanner;
