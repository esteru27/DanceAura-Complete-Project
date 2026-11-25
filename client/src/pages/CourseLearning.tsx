import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentProgressAPI } from '../services/api';
import {
  CheckCircle2,
  Play,
  Clock,
  ArrowLeft,
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const CourseLearning: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [data, setData] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [completionAlert, setCompletionAlert] = useState<string | null>(null);

  const fetchLessons = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const res = await studentProgressAPI.getCourseLessons(courseId);
      if (res.success) {
        setData(res);
        if (res.lessons && res.lessons.length > 0) {
          // Set first uncompleted lesson as active, or first lesson
          const firstPending = res.lessons.find((l: any) => !l.completed);
          setActiveLesson(firstPending || res.lessons[0]);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const handleToggleComplete = async (lesson: any) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      if (lesson.completed) {
        await studentProgressAPI.uncompleteLesson(lesson._id);
      } else {
        const res = await studentProgressAPI.completeLesson(lesson._id);
        if (res.progress?.newlyCompleted) {
          setCompletionAlert(`🎉 Congratulations! You have completed all lessons in ${data.course?.title}!`);
        }
      }
      await fetchLessons();
    } catch (err: any) {
      alert(err.message || 'Error updating lesson progress');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <div className="spinner mx-auto mb-3" />
        <p className="text-muted">Loading course curriculum and learning modules...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h2>Course not found or not enrolled</h2>
        <Link to="/dashboard" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { course, enrollment, progress, lessons } = data;

  return (
    <div className="learning-page">
      {/* Top Header */}
      <div className="learning-header">
        <div className="container">
          <Link to="/dashboard" className="back-link mb-2 inline-flex items-center gap-1 text-sm text-slate-300">
            <ArrowLeft size={16} /> Back to Student Dashboard
          </Link>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="badge badge-purple mb-1">{course.category} • {course.level}</span>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-sm text-slate-300">Instructor: {course.instructorName}</p>
            </div>

            {/* Progress Badge Card */}
            <div className="header-prog-box">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Progress: {progress.completedLessons} / {progress.totalLessons} Lessons</span>
                <span className="text-accent">{progress.progressPercentage}%</span>
              </div>
              <div className="progress-track w-48">
                <div className="progress-fill" style={{ width: `${progress.progressPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container learning-body py-8">
        {/* Course Completion Banner */}
        {(progress.isCompleted || completionAlert) && (
          <div className="completion-banner mb-6">
            <div className="flex items-center gap-3">
              <Award className="text-gold flex-shrink-0" size={36} />
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {completionAlert || `Course Completed! 100% Progress Achieved!`}
                </h3>
                <p className="text-sm text-slate-600">
                  You have successfully completed every lesson in this course! Completed on:{' '}
                  <strong>{new Date(enrollment.completedAt || Date.now()).toLocaleDateString()}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid-learning">
          {/* Main Content: Active Lesson Video Player & Details */}
          <div className="learning-main">
            {activeLesson ? (
              <div className="card p-0 overflow-hidden">
                <div className="video-player-container">
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">
                        Lesson {activeLesson.order} of {lessons.length} • {activeLesson.type}
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900 mt-1">{activeLesson.title}</h2>
                    </div>

                    <button
                      type="button"
                      className={`btn ${activeLesson.completed ? 'btn-outline' : 'btn-primary'} flex items-center gap-2`}
                      onClick={() => handleToggleComplete(activeLesson)}
                      disabled={actionLoading}
                    >
                      <CheckCircle2 size={18} />
                      {activeLesson.completed ? 'Completed (Click to Undo)' : 'Mark Lesson as Completed'}
                    </button>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-6">{activeLesson.description}</p>

                  <div className="flex gap-4 text-sm text-slate-500 border-t pt-4">
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> Duration: {activeLesson.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers size={16} /> Difficulty: {activeLesson.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center text-muted">Select a lesson to begin learning.</div>
            )}
          </div>

          {/* Sidebar: Course Lesson Playlist */}
          <div className="learning-sidebar">
            <div className="card p-4">
              <h3 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-accent" /> Course Modules ({lessons.length})
              </h3>

              <div className="lesson-playlist">
                {lessons.map((lesson: any) => {
                  const isActive = activeLesson?._id === lesson._id;

                  return (
                    <div
                      key={lesson._id}
                      className={`playlist-item ${isActive ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                      onClick={() => setActiveLesson(lesson)}
                    >
                      <div className="playlist-check">
                        <input
                          type="checkbox"
                          checked={lesson.completed}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(lesson);
                          }}
                          className="checkbox-custom"
                        />
                      </div>
                      <div className="playlist-info">
                        <span className="playlist-order">Lesson {lesson.order}</span>
                        <h4 className="playlist-title">{lesson.title}</h4>
                        <span className="playlist-meta">
                          <Clock size={12} className="inline mr-1" />
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .learning-page {
          background-color: #f8fafc;
          min-height: 90vh;
          padding-bottom: 80px;
        }
        .learning-header {
          background: #0f172a;
          color: white;
          padding: 30px 0;
        }
        .header-prog-box {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px 18px;
          border-radius: 10px;
        }
        .completion-banner {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 20px 24px;
          border-radius: 12px;
        }
        .grid-learning {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 28px;
        }
        .video-player-container {
          position: relative;
          padding-top: 56.25%;
          background: black;
        }
        .video-player-container iframe {
          position: absolute;
          inset: 0;
          border: none;
        }
        .lesson-playlist {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 550px;
          overflow-y: auto;
        }
        .playlist-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid #f1f5f9;
          transition: all 0.2s;
        }
        .playlist-item:hover {
          background: #f1f5f9;
        }
        .playlist-item.active {
          background: #e0f2fe;
          border-color: #38bdf8;
        }
        .playlist-item.completed {
          background: #f0fdf4;
        }
        .playlist-order {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          display: block;
        }
        .playlist-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin: 2px 0;
        }
        .playlist-meta {
          font-size: 12px;
          color: #94a3b8;
        }
        .checkbox-custom {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #27ae60;
        }
        @media (max-width: 900px) {
          .grid-learning { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
