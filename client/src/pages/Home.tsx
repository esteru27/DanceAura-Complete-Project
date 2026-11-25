import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import { CategoryCard } from '../components/CategoryCard';
import { CourseCard } from '../components/CourseCard';
import { InstructorCard } from '../components/InstructorCard';
import { Category, Course, Instructor } from '../types';
import { courseAPI, instructorAPI } from '../services/api';
import { Sparkles, Award, Users, Heart, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, courseRes, insRes] = await Promise.all([
          courseAPI.getCategories(),
          courseAPI.getAll(),
          instructorAPI.getAll(),
        ]);
        if (catRes.categories) setCategories(catRes.categories.slice(0, 6));
        if (courseRes.courses) setFeaturedCourses(courseRes.courses.slice(0, 4));
        if (insRes.instructors) setInstructors(insRes.instructors.slice(0, 4));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Feature Highlights Bar */}
      <section className="features-ribbon">
        <div className="container ribbon-grid">
          <div className="ribbon-item">
            <Award className="ribbon-icon" size={28} />
            <div>
              <h4>Master Dancers</h4>
              <p>Internationally certified and award-winning mentors</p>
            </div>
          </div>
          <div className="ribbon-item">
            <Sparkles className="ribbon-icon" size={28} />
            <div>
              <h4>Diverse Genres</h4>
              <p>Classical Bharatanatyam, Kathak to Urban Hip Hop & Salsa</p>
            </div>
          </div>
          <div className="ribbon-item">
            <Users className="ribbon-icon" size={28} />
            <div>
              <h4>Individual Attention</h4>
              <p>Small batches with curated technique progression</p>
            </div>
          </div>
          <div className="ribbon-item">
            <Heart className="ribbon-icon" size={28} />
            <div>
              <h4>Stage Showcases</h4>
              <p>Annual studio festivals, competitions, and certificates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dance Categories Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Discover Styles</span>
            <h2 className="section-title">Popular Dance Categories</h2>
            <p className="section-desc">
              From temple traditions of South India to vibrant urban street choreographies, find the rhythm that moves your heart.
            </p>
          </div>

          <div className="grid-3">
            {categories.map((cat, idx) => (
              <CategoryCard key={idx} category={cat} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/categories" className="btn btn-secondary">
              <span>View All 13 Dance Categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section-padding bg-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Enroll Today</span>
            <h2 className="section-title">Featured Studio Courses</h2>
            <p className="section-desc">
              Structured progressive courses designed for Beginners to Advanced dancers with weekly sessions and feedback.
            </p>
          </div>

          <div className="grid-4">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/courses" className="btn btn-primary">
              <span>Browse All Studio Courses</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Instructors Showcase */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Meet Our Mentors</span>
            <h2 className="section-title">Renowned Dance Gurus</h2>
            <p className="section-desc">
              Our faculty members bring decades of performing arts excellence and nurturing guidance to every rehearsal.
            </p>
          </div>

          <div className="grid-4">
            {instructors.map((ins) => (
              <InstructorCard key={ins._id} instructor={ins} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner">
        <div className="container cta-container">
          <div className="cta-content">
            <span className="title-cursive text-gold">Ready to Begin?</span>
            <h2 className="cta-heading">Book Your First Trial Rehearsal</h2>
            <p className="cta-text">
              Step into our dance haven, meet the instructors, and discover how movement can enrich your strength, grace, and life.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Register as Student
              </Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">
                Contact Auditions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .features-ribbon {
          background-color: #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.06);
          padding: 30px 0;
          position: relative;
          z-index: 10;
          margin-top: -30px;
          border-radius: 12px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        .ribbon-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .ribbon-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .ribbon-icon {
          color: #27ae60;
          flex-shrink: 0;
        }
        .ribbon-item h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
        }
        .ribbon-item p {
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }
        .section-padding {
          padding: 80px 0;
        }
        .bg-alt {
          background-color: #f1f5f9;
        }
        .text-center { text-align: center; }
        .mt-8 { margin-top: 32px; }
        .cta-banner {
          background: linear-gradient(135deg, #4a1c6f 0%, #1c3a47 100%);
          color: white;
          padding: 90px 0;
          text-align: center;
        }
        .cta-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 42px;
          font-weight: 700;
          margin: 10px 0 16px;
        }
        .cta-text {
          max-width: 620px;
          margin: 0 auto 30px;
          font-size: 17px;
          color: #e2e8f0;
          line-height: 1.6;
        }
        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .btn-lg {
          padding: 14px 34px;
          font-size: 16px;
        }
        @media (max-width: 1024px) {
          .ribbon-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .ribbon-grid { grid-template-columns: 1fr; }
          .cta-heading { font-size: 30px; }
          .cta-actions { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};
