import { User } from '../models/User';
import { Instructor } from '../models/Instructor';
import { DanceCourse } from '../models/DanceCourse';
import { Enrollment } from '../models/Enrollment';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';

export const seedDatabase = async (): Promise<void> => {
  try {
    // 1. Seed Instructors
    const instructorCount = await Instructor.countDocuments();
    let seededInstructors: any[] = [];

    if (instructorCount === 0) {
      console.log('[Seed] Seeding dance instructors...');
      const instructorsData = [
        {
          name: 'Meenakshi Sundaram',
          email: 'meenakshi@danceaura.com',
          phone: '+91 98450 11221',
          bio: 'Kalaimamani awardee with over 18 years of dedication to classical Bharatanatyam. Renowned exponent of Kalakshetra style.',
          danceStyles: ['Bharatanatyam', 'Kuchipudi'],
          experienceYears: 18,
          image: '/ins1.png',
          rating: 4.95,
        },
        {
          name: 'Rohan Deshmukh',
          email: 'rohan@danceaura.com',
          phone: '+91 98765 22334',
          bio: 'International Hip Hop competitor and urban street choreographer. Trained in NYC and London dance camps.',
          danceStyles: ['Hip Hop', 'Contemporary'],
          experienceYears: 10,
          image: '/ins2.png',
          rating: 4.9,
        },
        {
          name: 'Priyanka Sharma',
          email: 'priyanka@danceaura.com',
          phone: '+91 97654 33445',
          bio: 'Senior disciple of Lucknow Gharana with extensive mastery over Tatkar footwork, Chakkars, and Bhav abhinaya.',
          danceStyles: ['Kathak'],
          experienceYears: 14,
          image: '/ins3.png',
          rating: 4.88,
        },
        {
          name: 'Elena Rostova',
          email: 'elena@danceaura.com',
          phone: '+91 96543 44556',
          bio: 'Former soloist ballerina certified by Royal Academy of Dance. Specializes in classical ballet techniques and poise.',
          danceStyles: ['Ballet', 'Contemporary'],
          experienceYears: 15,
          image: '/ins4.png',
          rating: 4.92,
        },
        {
          name: 'Carlos Mendez',
          email: 'carlos@danceaura.com',
          phone: '+91 95432 55667',
          bio: 'World Salsa Championship finalist bringing fiery Latin passion, partner connection, and rhythmic musicality.',
          danceStyles: ['Salsa'],
          experienceYears: 12,
          image: '/ins5.png',
          rating: 4.87,
        },
        {
          name: 'Sophia Chen',
          email: 'sophia@danceaura.com',
          phone: '+91 94321 66778',
          bio: 'Licensed Zumba fitness trainer and certified aerobics coach dedicated to transformational cardio dance sessions.',
          danceStyles: ['Zumba', 'Aerobics'],
          experienceYears: 8,
          image: '/ins6.png',
          rating: 4.94,
        },
        {
          name: 'Ji-hoon Park',
          email: 'jihoon@danceaura.com',
          phone: '+91 93210 77889',
          bio: 'Former Seoul dance academy trainer specializing in sync K-pop choreography, high-energy stage presence, and covers.',
          danceStyles: ['K-Pop', 'Hip Hop'],
          experienceYears: 7,
          image: '/ins7.png',
          rating: 4.91,
        },
        {
          name: 'Harpreet Singh',
          email: 'harpreet@danceaura.com',
          phone: '+91 92109 88990',
          bio: 'Folk maestro celebrating Punjab energetic Bhangra and Gujarat vibrant Garba and Dandiya rhythms.',
          danceStyles: ['Bhangra', 'Garba'],
          experienceYears: 11,
          image: '/ins8.png',
          rating: 4.93,
        },
      ];

      seededInstructors = await Instructor.insertMany(instructorsData);
      console.log(`[Seed] Seeded ${seededInstructors.length} instructors.`);
    } else {
      seededInstructors = await Instructor.find();
    }

    // 2. Seed Dance Courses
    const courseCount = await DanceCourse.countDocuments();
    let seededCourses: any[] = [];

    if (courseCount === 0) {
      console.log('[Seed] Seeding dance courses...');
      const coursesData = [
        {
          title: 'Bharatanatyam Foundation & Adavus',
          description: 'Master basic Araimandi posture, footwork, Hasta mudras, and classic Tatta and Natta Adavus.',
          category: 'Bharatanatyam',
          level: 'Beginner',
          instructor: seededInstructors[0]?._id,
          instructorName: seededInstructors[0]?.name || 'Meenakshi Sundaram',
          durationWeeks: 12,
          price: 59,
          schedule: 'Tue & Thu, 5:30 PM',
          image: '/bharatanatyam.jpg',
          enrolledCount: 14,
          syllabus: ['Posture & Stance: Araimandi', 'Tatta Adavu sequence', 'Natta Adavu sequence', 'Intro to Asamyuta Hastas'],
        },
        {
          title: 'Kathak Rhythms & Chakkars',
          description: 'Immerse in the rhythmic world of Tatkar, Teental cycles, pirouettes, and graceful storytelling gestures.',
          category: 'Kathak',
          level: 'Intermediate',
          instructor: seededInstructors[2]?._id,
          instructorName: seededInstructors[2]?.name || 'Priyanka Sharma',
          durationWeeks: 10,
          price: 69,
          schedule: 'Mon & Wed, 6:00 PM',
          image: '/kathak.jpg',
          enrolledCount: 9,
          syllabus: ['Teental Tatkar variations', 'Speed Chakkars (turns)', 'Tukdas and Parans', 'Abhinaya to Thumri'],
        },
        {
          title: 'Classical Ballet Technique & Poise',
          description: 'Barre fundamentals, turnout, pliés, tendus, port de bras, and center floor combinations.',
          category: 'Ballet',
          level: 'Beginner',
          instructor: seededInstructors[3]?._id,
          instructorName: seededInstructors[3]?.name || 'Elena Rostova',
          durationWeeks: 12,
          price: 79,
          schedule: 'Tue & Thu, 7:00 PM',
          image: '/ballet.jpg',
          enrolledCount: 18,
          syllabus: ['Barre warmup & Posture', 'First to Fifth positions', 'Adagio & Port de bras', 'Allegro & jumps'],
        },
        {
          title: 'Urban Hip Hop Grooves & Litefeet',
          description: 'Bounce, rock, wave, and groove. Learn iconic street combos, Litefeet anthem, and freestyle battles.',
          category: 'Hip Hop',
          level: 'All Levels',
          instructor: seededInstructors[1]?._id,
          instructorName: seededInstructors[1]?.name || 'Rohan Deshmukh',
          durationWeeks: 8,
          price: 49,
          schedule: 'Mon, Wed & Fri, 6:30 PM',
          image: '/hiphop.jpg',
          enrolledCount: 22,
          syllabus: ['Party dances & bounces', 'Popping & isolations', 'Litefeet basics', 'Full routine performance'],
        },
        {
          title: 'Sensual Latin Salsa & Partnering',
          description: 'Master the 8-count beat, cross-body leads, open breaks, spins, and infectious Caribbean musicality.',
          category: 'Salsa',
          level: 'Beginner',
          instructor: seededInstructors[4]?._id,
          instructorName: seededInstructors[4]?.name || 'Carlos Mendez',
          durationWeeks: 8,
          price: 59,
          schedule: 'Sat & Sun, 6:00 PM',
          image: '/salsa.jpg',
          enrolledCount: 19,
          syllabus: ['Basic step on 1', 'Right & Left turns', 'Cross Body Lead', 'Partner combination'],
        },
      ];

      seededCourses = await DanceCourse.insertMany(coursesData);
      console.log(`[Seed] Seeded ${seededCourses.length} dance courses.`);
    } else {
      seededCourses = await DanceCourse.find();
    }

    // 3. Seed Lessons for each course
    const existingLessonsCount = await Lesson.countDocuments();
    if (existingLessonsCount === 0) {
      console.log('[Seed] Seeding structured lessons for courses...');
      const lessonsToInsert: any[] = [];

      for (const course of seededCourses) {
        lessonsToInsert.push(
          {
            course: course._id,
            title: `${course.category} Lesson 1: Fundamentals & Stance`,
            description: `Core posture, spinal alignment, and breathing techniques essential for ${course.category}.`,
            duration: '10 min',
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            type: 'Technique',
            difficulty: course.level || 'Beginner',
          },
          {
            course: course._id,
            title: `${course.category} Lesson 2: Rhythm & Primary Footwork`,
            description: 'Synchronizing foot beats to rhythmic cycles and basic movement patterns.',
            duration: '12 min',
            order: 2,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            type: 'Moves',
            difficulty: course.level || 'Beginner',
          },
          {
            course: course._id,
            title: `${course.category} Lesson 3: Core Combinations & Transitions`,
            description: 'Linking basic movements into smooth, continuous transitional sequences.',
            duration: '15 min',
            order: 3,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            type: 'Moves',
            difficulty: course.level || 'Beginner',
          },
          {
            course: course._id,
            title: `${course.category} Lesson 4: Expressive Musicality & Nuance`,
            description: 'Emotional expression, upper-body fluidity, and musical interpretation.',
            duration: '14 min',
            order: 4,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            type: 'Choreography',
            difficulty: course.level || 'Beginner',
          },
          {
            course: course._id,
            title: `${course.category} Lesson 5: Full Rehearsal & Graduation Showcase`,
            description: 'The master performance routine integrating all concepts taught across previous modules.',
            duration: '18 min',
            order: 5,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            type: 'Choreography',
            difficulty: course.level || 'Beginner',
          }
        );
      }

      await Lesson.insertMany(lessonsToInsert);
      console.log(`[Seed] Seeded ${lessonsToInsert.length} lessons.`);
    }

    // 4. Seed Admin User: admin@danceaura.com / admin123
    const existingAdmin = await User.findOne({ email: 'admin@danceaura.com' });
    if (!existingAdmin) {
      await User.create({
        firstName: 'Studio',
        lastName: 'Director',
        email: 'admin@danceaura.com',
        phone: '9845000000',
        gender: 'other',
        streetAddress1: 'DanceAura Headquarters',
        city: 'Hyderabad',
        region: 'Telangana',
        zipCode: '500081',
        country: 'India',
        danceType: 'All',
        startDate: new Date(),
        startTime: '09:00 AM',
        comments: 'Studio Head Administrator',
        password: 'admin123',
        role: 'admin',
        isPaid: true,
      });
      console.log('[Seed] Created default admin user: admin@danceaura.com (admin123)');
    }

    // 5. Seed Instructor User: instructor@danceaura.com / dance123
    const existingInstructorUser = await User.findOne({ email: 'instructor@danceaura.com' });
    if (!existingInstructorUser) {
      await User.create({
        firstName: 'Meenakshi',
        lastName: 'Sundaram',
        email: 'instructor@danceaura.com',
        phone: '9845011221',
        gender: 'female',
        streetAddress1: 'DanceAura Master Studio',
        city: 'Chennai',
        region: 'Tamil Nadu',
        zipCode: '600004',
        country: 'India',
        danceType: 'Bharatanatyam',
        startDate: new Date(),
        startTime: '09:00 AM',
        comments: 'Studio Master Instructor',
        password: 'dance123',
        role: 'instructor',
        isPaid: true,
      });
      console.log('[Seed] Created instructor user: instructor@danceaura.com (dance123)');
    }

    // 6. Seed Student User: Akhila
    let akhilaUser = await User.findOne({ email: 'akhilareddyevuri1908@gmail.com' });
    if (!akhilaUser) {
      akhilaUser = await User.create({
        firstName: 'Akhila',
        lastName: 'Evuri',
        email: 'akhilareddyevuri1908@gmail.com',
        phone: '9876543210',
        gender: 'female',
        streetAddress1: '123 Temple Road',
        city: 'Hyderabad',
        region: 'Telangana',
        zipCode: '500081',
        country: 'India',
        danceType: 'Bharatanatyam',
        startDate: new Date(),
        startTime: '10:00 AM',
        comments: 'Passionate about Indian classical dance.',
        password: '1234',
        role: 'student',
        isPaid: true,
        progress: {},
      });
      console.log('[Seed] Created student user: Akhila (1234)');
    }

    // 7. Seed Student Enrollment & Initial Lesson Progress
    if (akhilaUser) {
      const firstCourse = await DanceCourse.findOne();
      if (firstCourse) {
        let existingEnrollment = await Enrollment.findOne({
          student: akhilaUser._id,
          course: firstCourse._id,
        });

        const courseLessons = await Lesson.find({ course: firstCourse._id }).sort({ order: 1 });

        if (!existingEnrollment) {
          existingEnrollment = await Enrollment.create({
            student: akhilaUser._id,
            course: firstCourse._id,
            amountPaid: firstCourse.price,
            paymentStatus: 'paid',
            danceType: firstCourse.category,
            scheduleTime: firstCourse.schedule,
            totalLessonsCount: courseLessons.length,
            completedLessonsCount: 2,
            progressPercentage: courseLessons.length > 0 ? Math.round((2 / courseLessons.length) * 100) : 40,
            isCompleted: false,
            lastAccessedAt: new Date(),
          });

          // Mark first 2 lessons as completed
          if (courseLessons.length >= 2) {
            await LessonProgress.create([
              {
                student: akhilaUser._id,
                course: firstCourse._id,
                lesson: courseLessons[0]._id,
                completed: true,
                completedAt: new Date(Date.now() - 86400000 * 2),
              },
              {
                student: akhilaUser._id,
                course: firstCourse._id,
                lesson: courseLessons[1]._id,
                completed: true,
                completedAt: new Date(),
              },
            ]);
          }
          console.log('[Seed] Seeded initial enrollment and lesson progress for Akhila.');
        }
      }
    }
  } catch (error: any) {
    console.error('[Seed] Database seeding error:', error.message);
  }
};
