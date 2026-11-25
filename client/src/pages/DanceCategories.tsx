import React, { useEffect, useState } from 'react';
import { Category } from '../types';
import { courseAPI } from '../services/api';
import { CategoryCard } from '../components/CategoryCard';
import { Sparkles } from 'lucide-react';

export const DanceCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseAPI.getCategories()
      .then((res) => {
        if (res.categories) setCategories(res.categories);
      })
      .catch((err) => console.error('Categories error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="categories-page">
      <div className="cat-hero">
        <div className="container">
          <span className="title-cursive text-gold">Tradition Meets Modernity</span>
          <h1 className="cat-hero-title">Dance Categories & Styles</h1>
          <p className="cat-hero-desc">
            Explore 13 distinct dance forms taught by dedicated master instructors with classical roots and modern choreographic flair.
          </p>
        </div>
      </div>

      <div className="container section-padding">
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner" />
            <p className="text-muted mt-4">Loading dance styles...</p>
          </div>
        ) : (
          <div className="grid-3">
            {categories.map((cat, idx) => (
              <CategoryCard key={idx} category={cat} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .cat-hero {
          background: linear-gradient(135deg, #1c3a47 0%, #4a1c6f 100%);
          color: white;
          padding: 70px 0;
          text-align: center;
        }
        .cat-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 42px;
          font-weight: 700;
          margin: 8px 0 12px;
        }
        .cat-hero-desc {
          max-width: 620px;
          margin: 0 auto;
          color: #cbd5e1;
          font-size: 16px;
        }
        .section-padding {
          padding: 60px 20px;
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
