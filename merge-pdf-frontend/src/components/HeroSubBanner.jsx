import React from 'react';
import Lottie from 'lottie-react';
import editAnimation from '../assets/lottie/editPdfAnimation.json';
import { Link } from 'react-router-dom';
import '../styles/HeroSubBanner.css';

function HeroSubBanner() {
  return (
    <section className="hero-sub-banner">
      <div className="hero-sub-left">
        <h2 className="hero-sub-title">✏️ Work Directly on Your Files</h2>
        <p className="hero-sub-description">
          Edit, sign, and annotate your PDFs without leaving the browser. Everything stays private, fast, and easy to use.
        </p>
        <Link to="/edit" className="hero-sub-cta">Edit a PDF now →</Link>
      </div>

      <div className="hero-sub-right">
        <Lottie animationData={editAnimation} loop={true} className="hero-sub-lottie" />
      </div>
    </section>
  );
}

export default HeroSubBanner;
