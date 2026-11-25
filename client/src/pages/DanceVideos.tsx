import React, { useState } from 'react';
import { VideoClass } from '../types';
import { VideoModal } from '../components/VideoModal';
import { useAuth } from '../context/AuthContext';
import { Play, CheckCircle, Clock } from 'lucide-react';

// Master list of video classes matching the original studio video database
const videoCatalog: VideoClass[] = [
  // Beginner
  {
    id: 'bh_vid_1',
    title: 'Araimandi Posture & Core Stance',
    danceStyle: 'Bharatanatyam',
    level: 'Beginner',
    duration: '8 min',
    type: 'Technique',
    tags: ['Classical', 'Adavus', 'Basics'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/bharatanatyam.jpg',
    instructor: 'Meenakshi Sundaram',
  },
  {
    id: 'hip_vid_1',
    title: 'Tic Tac Toe Skip & Party Grooves',
    danceStyle: 'Hip Hop',
    level: 'Beginner',
    duration: '5 min',
    type: 'Moves',
    tags: ['Hip Hop', 'Grooves', 'Free Class'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/hiphop.jpg',
    instructor: 'Rohan Deshmukh',
  },
  {
    id: 'hip_vid_2',
    title: 'Twist and Wop Foundation Drill',
    danceStyle: 'Hip Hop',
    level: 'Beginner',
    duration: '4 min',
    type: 'Moves',
    tags: ['Hip Hop', 'Free Class'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/hiphop.jpg',
    instructor: 'Rohan Deshmukh',
  },
  {
    id: 'ballet_vid_1',
    title: 'First Position & Demi-Plié Fundamentals',
    danceStyle: 'Ballet',
    level: 'Beginner',
    duration: '9 min',
    type: 'Technique',
    tags: ['Ballet', 'Barre', 'Grace'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/ballet.jpg',
    instructor: 'Elena Rostova',
  },
  {
    id: 'salsa_vid_1',
    title: 'Basic 8-Count Timing & Forward Break',
    danceStyle: 'Salsa',
    level: 'Beginner',
    duration: '6 min',
    type: 'Moves',
    tags: ['Salsa', 'Latin', 'Rhythm'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/salsa.jpg',
    instructor: 'Carlos Mendez',
  },

  // Intermediate
  {
    id: 'kt_vid_1',
    title: 'Teental Tatkar & Speed Chakkars (Turns)',
    danceStyle: 'Kathak',
    level: 'Intermediate',
    duration: '12 min',
    type: 'Choreography',
    tags: ['Kathak', 'Rhythm', 'Footwork'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/kathak.jpg',
    instructor: 'Priyanka Sharma',
  },
  {
    id: 'hip_vid_3',
    title: 'FL Litefeet Anthem Performance',
    danceStyle: 'Hip Hop',
    level: 'Intermediate',
    duration: '12 min',
    type: 'Choreography',
    tags: ['Hip Hop', 'Litefeet', 'Fast'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/hiphop.jpg',
    instructor: 'Rohan Deshmukh',
  },
  {
    id: 'kpop_vid_1',
    title: 'K-Pop Point Choreography & Isolation',
    danceStyle: 'K-Pop',
    level: 'Intermediate',
    duration: '10 min',
    type: 'Choreography',
    tags: ['K-Pop', 'Sync', 'Choreo'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/k pop.jpg',
    instructor: 'Ji-hoon Park',
  },

  // Advanced
  {
    id: 'hip_vid_4',
    title: 'Battle Prep & Elite Street Drill',
    danceStyle: 'Hip Hop',
    level: 'Advanced',
    duration: '15 min',
    type: 'Technique',
    tags: ['Advanced', 'Battle', 'Footwork'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/hiphop.jpg',
    instructor: 'Rohan Deshmukh',
  },
  {
    id: 'kuch_vid_1',
    title: 'Tarangam Brass Plate Rhythm Mastery',
    danceStyle: 'Kuchipudi',
    level: 'Advanced',
    duration: '14 min',
    type: 'Technique',
    tags: ['Kuchipudi', 'Plate Dance', 'Mastery'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: '/kuchipudi.jpg',
    instructor: 'Meenakshi Sundaram',
  },
];

export const DanceVideos: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [activeVideo, setActiveVideo] = useState<VideoClass | null>(null);

  const completedSet = new Set<string>();
  if (user?.progress) {
    Object.values(user.progress).forEach((styleObj) => {
      Object.values(styleObj).forEach((vidArr) => {
        vidArr.forEach((vId) => completedSet.add(vId));
      });
    });
  }

  const filtered = selectedLevel === 'All'
    ? videoCatalog
    : videoCatalog.filter((v) => v.level === selectedLevel);

  return (
    <div className="videos-page">
      <div className="videos-hero">
        <div className="container">
          <span className="title-cursive text-gold">Learn At Your Own Pace</span>
          <h1 className="videos-hero-title">Free Dance Video Tutorials</h1>
          <p className="videos-hero-desc">
            Watch master drills, follow along with video choreography, and mark lessons as complete to build your student progress score.
          </p>
        </div>
      </div>

      <div className="container videos-container">
        {/* Level Filters */}
        <div className="video-filter-bar">
          <span className="filter-title">Filter By Experience:</span>
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={`filter-btn ${selectedLevel === lvl ? 'active' : ''}`}
              onClick={() => setSelectedLevel(lvl)}
            >
              {lvl} Lessons
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid-3">
          {filtered.map((video) => {
            const isDone = completedSet.has(video.id);

            return (
              <div key={video.id} className="card video-card" onClick={() => setActiveVideo(video)}>
                <div className="video-thumb-box">
                  <img src={video.thumbnail} alt={video.title} className="video-thumb" />
                  <div className="play-overlay">
                    <div className="play-circle">
                      <Play size={24} fill="white" color="white" />
                    </div>
                  </div>
                  <span className="video-duration-pill">{video.duration}</span>
                  {isDone && (
                    <div className="done-badge">
                      <CheckCircle size={14} /> Completed
                    </div>
                  )}
                </div>

                <div className="video-body">
                  <div className="tags-row">
                    <span className="badge badge-purple">{video.danceStyle}</span>
                    <span className="badge badge-green">{video.level}</span>
                  </div>
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-inst">Mentor: {video.instructor}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeVideo && (
        <VideoModal
          video={activeVideo}
          isCompleted={completedSet.has(activeVideo.id)}
          onClose={() => setActiveVideo(null)}
          onCompleted={() => refreshProfile()}
        />
      )}

      <style>{`
        .videos-hero {
          background: #111827;
          color: white;
          padding: 60px 0;
          text-align: center;
        }
        .videos-hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 40px;
          font-weight: 700;
          margin: 8px 0 10px;
        }
        .videos-hero-desc {
          max-width: 600px;
          margin: 0 auto;
          color: #9ca3af;
          font-size: 16px;
        }
        .videos-container {
          padding: 40px 20px 80px;
        }
        .video-filter-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .filter-title {
          font-weight: 600;
          color: #475569;
          font-size: 14px;
        }
        .filter-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 14px;
          color: #334155;
          transition: all 0.2s;
        }
        .filter-btn:hover, .filter-btn.active {
          background: #27ae60;
          color: white;
          border-color: #27ae60;
        }
        .video-card {
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
        }
        .video-thumb-box {
          position: relative;
          height: 200px;
          background: black;
        }
        .video-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          transition: opacity 0.3s;
        }
        .video-card:hover .video-thumb {
          opacity: 1;
        }
        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.3);
          transition: background 0.3s;
        }
        .video-card:hover .play-overlay {
          background: rgba(0,0,0,0.1);
        }
        .play-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #27ae60;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 4px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: transform 0.3s;
        }
        .video-card:hover .play-circle {
          transform: scale(1.1);
        }
        .video-duration-pill {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .done-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #27ae60;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .video-body {
          padding: 18px;
        }
        .tags-row {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }
        .video-title {
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }
        .video-inst {
          font-size: 13px;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};
