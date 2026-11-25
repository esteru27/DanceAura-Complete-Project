import React from 'react';
import { Award, Heart, CheckCircle2, Star, Sparkles } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="about-page">
      {/* Header Banner */}
      <div className="about-hero">
        <div className="container">
          <span className="title-cursive text-gold">Our Heritage & Rhythm</span>
          <h1 className="about-hero-title">About DanceAura Studio</h1>
          <p className="about-hero-desc">
            Founded with an enduring passion to preserve classical traditions while igniting modern expressions of dance.
          </p>
        </div>
      </div>

      {/* Main Narrative */}
      <section className="container about-section">
        <div className="about-split">
          <div className="about-text-content">
            <span className="section-subtitle">Since 2012</span>
            <h2 className="section-title">Where Dance Becomes Poetry in Motion</h2>
            <p>
              DanceAura is a vibrant sanctuary dedicated to rhythm, poise, discipline, and creative expression. Over the past twelve years, we have nurtured thousands of students—from toddlers learning their very first rhythmic steps to seasoned performers gracing international stages.
            </p>
            <p>
              Our curriculum seamlessly blends the time-honored rigor of Indian classical forms like <strong>Bharatanatyam</strong>, <strong>Kathak</strong>, and <strong>Kuchipudi</strong> with the freedom and dynamic power of <strong>Contemporary</strong>, <strong>Hip Hop</strong>, <strong>Latin Salsa</strong>, and high-energy <strong>Zumba</strong>.
            </p>

            <div className="values-grid">
              <div className="value-item">
                <CheckCircle2 className="value-icon" size={20} />
                <span>Authentic pedagogy rooted in Gurukul and conservatory traditions</span>
              </div>
              <div className="value-item">
                <CheckCircle2 className="value-icon" size={20} />
                <span>State-of-the-art sprung hardwood studios engineered for dancers' joints</span>
              </div>
              <div className="value-item">
                <CheckCircle2 className="value-icon" size={20} />
                <span>Annual stage showcases, competition rehearsals, and certified diplomas</span>
              </div>
              <div className="value-item">
                <CheckCircle2 className="value-icon" size={20} />
                <span>Inclusive community welcoming every age, background, and ability level</span>
              </div>
            </div>
          </div>

          <div className="about-visuals">
            <img src="/aboutus.jpg" alt="Dance Rehearsal" className="about-main-img" onError={(e) => {
              (e.target as HTMLImageElement).src = '/slide1.jpg';
            }} />
            <div className="about-badge-card">
              <Star className="star-icon" size={32} />
              <div>
                <h3>12+ Years</h3>
                <p>Of Excellence in Arts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Philosophy Cards */}
      <section className="philosophy-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Ethos</span>
            <h2 className="section-title">The Three Pillars of DanceAura</h2>
          </div>

          <div className="grid-3">
            <div className="card pillar-card">
              <div className="pillar-num">01</div>
              <h3>Purity of Technique</h3>
              <p>
                We believe in rigorous foundational training. Correct body alignment, mudra precision, and musicality form the bedrock of true confidence.
              </p>
            </div>
            <div className="card pillar-card">
              <div className="pillar-num">02</div>
              <h3>Expressive Soul (Bhava)</h3>
              <p>
                Dance is more than physical steps—it is heartfelt communication. We coach dancers to express narratives that touch and elevate the audience.
              </p>
            </div>
            <div className="card pillar-card">
              <div className="pillar-num">03</div>
              <h3>Nurturing Community</h3>
              <p>
                We foster a warm, supportive, and uplifting environment where fellow dancers inspire one another, celebrate milestones, and form lifelong bonds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-hero {
          background: linear-gradient(135deg, #1c3a47 0%, #4a1c6f 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }
        .about-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 44px;
          font-weight: 700;
          margin: 8px 0 14px;
        }
        .about-hero-desc {
          max-width: 600px;
          margin: 0 auto;
          color: #cbd5e1;
          font-size: 17px;
        }
        .about-section {
          padding: 80px 20px;
        }
        .about-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .about-text-content p {
          color: #475569;
          font-size: 16px;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .values-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }
        .value-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          color: #1e293b;
          font-weight: 500;
        }
        .value-icon {
          color: #27ae60;
          flex-shrink: 0;
        }
        .about-visuals {
          position: relative;
        }
        .about-main-img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .about-badge-card {
          position: absolute;
          bottom: -20px;
          left: -20px;
          background: #ffffff;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .about-badge-card h3 {
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
        }
        .about-badge-card p {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }
        .philosophy-section {
          background: #f8fafc;
          padding: 80px 0;
        }
        .pillar-card {
          padding: 32px 24px;
          border-radius: 14px;
          position: relative;
        }
        .pillar-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 38px;
          font-weight: 800;
          color: #e2e8f0;
          margin-bottom: 12px;
        }
        .pillar-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
        }
        .pillar-card p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }
        @media (max-width: 900px) {
          .about-split { grid-template-columns: 1fr; }
          .about-badge-card { left: 10px; bottom: 10px; }
        }
      `}</style>
    </div>
  );
};
