import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Course } from '../types';
import { courseAPI } from '../services/api';
import { CourseCard } from '../components/CourseCard';
import { Search, Filter } from 'lucide-react';

export const DanceCourses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'All';
  const selectedLevel = searchParams.get('level') || 'All';
  const searchTerm = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    courseAPI.getCategories().then((res) => {
      if (res.categories) {
        setCategories(['All', ...res.categories.map((c: any) => c.name)]);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    courseAPI
      .getAll({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        level: selectedLevel !== 'All' ? selectedLevel : undefined,
        search: searchTerm || undefined,
      })
      .then((res) => {
        if (res.courses) setCourses(res.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedLevel, searchTerm]);

  const handleCategoryClick = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') next.delete('category');
    else next.set('category', cat);
    setSearchParams(next);
  };

  const handleLevelChange = (lvl: string) => {
    const next = new URLSearchParams(searchParams);
    if (lvl === 'All') next.delete('level');
    else next.set('level', lvl);
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set('search', searchInput.trim());
    else next.delete('search');
    setSearchParams(next);
  };

  return (
    <div className="courses-page">
      <div className="courses-hero">
        <div className="container">
          <span className="title-cursive text-gold">Structured Studio Learning</span>
          <h1 className="courses-hero-title">Dance Courses & Masterclasses</h1>
          <p className="courses-hero-desc">
            Explore comprehensive term courses across Indian classical and international dance genres.
          </p>
        </div>
      </div>

      <div className="container courses-container">
        {/* Search & Filter Bar */}
        <div className="filter-controls-card">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search courses, instructors, styles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="search-field"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-search">
              Search
            </button>
          </form>

          <div className="level-filter-box">
            <Filter size={16} className="text-muted" />
            <span className="filter-label">Level:</span>
            {['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`level-pill ${selectedLevel === lvl ? 'active' : ''}`}
                onClick={() => handleLevelChange(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Ribbon */}
        <div className="cat-pills-row">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner" />
            <p className="text-muted mt-3">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses match your filter criteria</h3>
            <p className="text-muted">Try choosing another category or clearing your search term.</p>
            <button
              type="button"
              className="btn btn-outline mt-4"
              onClick={() => {
                setSearchParams({});
                setSearchInput('');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .courses-hero {
          background: linear-gradient(135deg, #1c3a47 0%, #4a1c6f 100%);
          color: white;
          padding: 60px 0;
          text-align: center;
        }
        .courses-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 40px;
          font-weight: 700;
          margin: 8px 0 10px;
        }
        .courses-hero-desc {
          max-width: 600px;
          margin: 0 auto;
          color: #cbd5e1;
          font-size: 16px;
        }
        .courses-container {
          padding: 40px 20px 80px;
        }
        .filter-controls-card {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .search-form {
          display: flex;
          gap: 10px;
          flex: 1;
          min-width: 280px;
        }
        .search-input-box {
          position: relative;
          flex: 1;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .search-field {
          width: 100%;
          padding: 10px 10px 10px 38px;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          font-size: 14px;
        }
        .search-field:focus {
          outline: none;
          border-color: #27ae60;
        }
        .btn-search {
          padding: 8px 18px;
          font-size: 14px;
        }
        .level-filter-box {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .filter-label {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }
        .level-pill {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          color: #475569;
          transition: all 0.2s;
        }
        .level-pill:hover, .level-pill.active {
          background: #27ae60;
          color: white;
          border-color: #27ae60;
        }
        .cat-pills-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 14px;
          margin-bottom: 30px;
        }
        .cat-pill {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          color: #334155;
          transition: all 0.2s;
        }
        .cat-pill:hover, .cat-pill.active {
          background: #4a1c6f;
          color: white;
          border-color: #4a1c6f;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #27ae60;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
