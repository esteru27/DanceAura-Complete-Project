import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="card category-card">
      <div className="cat-img-wrapper">
        <img src={category.image} alt={category.name} className="cat-img" />
        <div className="cat-img-overlay" />
        <span className="cat-origin-badge">{category.origin}</span>
      </div>

      <div className="cat-content">
        <h3 className="cat-title">{category.name}</h3>
        <p className="cat-desc">{category.description}</p>
        <Link to={`/courses?category=${encodeURIComponent(category.name)}`} className="cat-link">
          <span>View Classes & Schedule</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      <style>{`
        .category-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
        }
        .cat-img-wrapper {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .category-card:hover .cat-img {
          transform: scale(1.06);
        }
        .cat-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
        }
        .cat-origin-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(39, 174, 96, 0.9);
          color: white;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .cat-content {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .cat-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }
        .cat-desc {
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 16px;
          flex: 1;
        }
        .cat-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #27ae60;
          font-weight: 600;
          font-size: 14px;
          transition: gap 0.2s;
        }
        .cat-link:hover {
          gap: 10px;
          color: #219653;
        }
      `}</style>
    </div>
  );
};
