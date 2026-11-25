import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface Slide {
  image: string;
  subtitle: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    image: '/slide1.jpg',
    subtitle: 'Where Passion Meets Rhythm',
    title: 'Experience The Soul of Dance',
    description: 'Learn Classical Bharatanatyam, Kathak, Contemporary, and Hip Hop from renowned maestro instructors.',
    ctaText: 'Explore Courses',
    ctaLink: '/courses',
  },
  {
    image: '/slide2.jpg',
    subtitle: 'Expressive Movement & Poise',
    title: 'Contemporary & Classical Ballet',
    description: 'Master core alignment, graceful floor work, and emotional storytelling across international genres.',
    ctaText: 'View Categories',
    ctaLink: '/categories',
  },
  {
    image: '/slide3.jpg',
    subtitle: 'High Energy Street & Fitness',
    title: 'Urban Hip Hop & Zumba Party',
    description: 'Torch calories, build confidence, and master the latest street choreographies and party rhythms.',
    ctaText: 'Watch Free Videos',
    ctaLink: '/videos',
  },
  {
    image: '/slide4.jpg',
    subtitle: 'Audition & Showcase',
    title: 'Step Into The Limelight',
    description: 'Annual stage showcases, competition coaching, and professional certification for aspiring performers.',
    ctaText: 'Register Today',
    ctaLink: '/register',
  },
];

export const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="hero-carousel-wrapper">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="carousel-overlay" />
          <div className="container carousel-container">
            <div className="carousel-content">
              <span className="slide-subtitle">
                <Sparkles size={18} className="sparkle-icon" />
                {slide.subtitle}
              </span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-desc">{slide.description}</p>
              <div className="slide-actions">
                <Link to={slide.ctaLink} className="btn btn-primary btn-hero">
                  {slide.ctaText}
                </Link>
                <Link to="/about" className="btn btn-outline-white btn-hero">
                  About Our Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Navigation Arrows */}
      <button type="button" className="carousel-arrow prev-arrow" onClick={prevSlide} aria-label="Previous Slide">
        <ChevronLeft size={28} />
      </button>
      <button type="button" className="carousel-arrow next-arrow" onClick={nextSlide} aria-label="Next Slide">
        <ChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        .hero-carousel-wrapper {
          position: relative;
          height: 600px;
          overflow: hidden;
          background: #111;
        }
        .carousel-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1s ease-in-out, transform 1s ease;
          transform: scale(1.03);
          display: flex;
          align-items: center;
        }
        .carousel-slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }
        .carousel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(14, 18, 17, 0.85) 0%, rgba(14, 18, 17, 0.5) 60%, rgba(14, 18, 17, 0.3) 100%);
        }
        .carousel-container {
          position: relative;
          z-index: 2;
        }
        .carousel-content {
          max-width: 650px;
          color: #ffffff;
        }
        .slide-subtitle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Great Vibes', cursive;
          font-size: 32px;
          color: #2ecc71;
          margin-bottom: 8px;
        }
        .sparkle-icon {
          color: #f1c40f;
        }
        .slide-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 16px;
          color: #ffffff;
        }
        .slide-desc {
          font-size: 17px;
          color: #e2e8f0;
          margin-bottom: 28px;
          line-height: 1.6;
        }
        .slide-actions {
          display: flex;
          gap: 16px;
        }
        .btn-hero {
          padding: 13px 30px;
          font-size: 16px;
        }
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          transition: background 0.3s;
        }
        .carousel-arrow:hover {
          background: #27ae60;
        }
        .prev-arrow { left: 20px; }
        .next-arrow { right: 20px; }
        .carousel-dots {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 5;
        }
        .carousel-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.3s;
        }
        .carousel-dot.active {
          width: 32px;
          border-radius: 6px;
          background: #27ae60;
        }
        @media (max-width: 768px) {
          .hero-carousel-wrapper { height: 500px; }
          .slide-title { font-size: 34px; }
          .slide-subtitle { font-size: 26px; }
          .slide-desc { font-size: 15px; }
          .carousel-arrow { display: none; }
        }
      `}</style>
    </div>
  );
};
