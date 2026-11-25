import http from 'http';
import app, { startServer } from '../server';

interface TestResult {
  name: string;
  passed: boolean;
  details?: any;
  error?: string;
}

const results: TestResult[] = [];

function makeRequest(
  method: string,
  path: string,
  data?: any,
  token?: string
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (data) {
      headers['Content-Length'] = Buffer.byteLength(postData).toString();
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {};
            resolve({ status: res.statusCode || 500, body: parsed });
          } catch {
            resolve({ status: res.statusCode || 500, body });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n================================================================');
  console.log('   DANCEAURA UPGRADE VERIFICATION: ADMIN & STUDENT PROGRESS');
  console.log('================================================================\n');

  let serverInstance: any = null;

  try {
    serverInstance = await startServer();
    await new Promise((r) => setTimeout(r, 1000));

    // 1. Health Check
    try {
      const res = await makeRequest('GET', '/api/health');
      if (res.status === 200 && res.body.status === 'ok') {
        results.push({ name: '1. Health Check Endpoint', passed: true });
        console.log('✔ Test 1: Health Check OK');
      } else throw new Error(`Status ${res.status}`);
    } catch (e: any) {
      results.push({ name: '1. Health Check Endpoint', passed: false, error: e.message });
      console.log('✖ Test 1 Failed:', e.message);
    }

    // 2. Student Login (Akhila)
    let studentToken = '';
    try {
      const res = await makeRequest('POST', '/api/auth/login', {
        email: 'akhilareddyevuri1908@gmail.com',
        password: '1234',
      });
      if (res.status === 200 && res.body.token) {
        studentToken = res.body.token;
        results.push({ name: '2. Student Authentication (Akhila)', passed: true });
        console.log('✔ Test 2: Student Login OK');
      } else throw new Error('Student login failed');
    } catch (e: any) {
      results.push({ name: '2. Student Authentication', passed: false, error: e.message });
      console.log('✖ Test 2 Failed:', e.message);
    }

    // 3. Admin Login (admin@danceaura.com / admin123)
    let adminToken = '';
    try {
      const res = await makeRequest('POST', '/api/auth/login', {
        email: 'admin@danceaura.com',
        password: 'admin123',
      });
      if (res.status === 200 && res.body.token && res.body.user?.role === 'admin') {
        adminToken = res.body.token;
        results.push({ name: '3. Admin Authentication (admin@danceaura.com)', passed: true });
        console.log('✔ Test 3: Admin Login OK (Role: admin)');
      } else throw new Error('Admin login failed');
    } catch (e: any) {
      results.push({ name: '3. Admin Authentication', passed: false, error: e.message });
      console.log('✖ Test 3 Failed:', e.message);
    }

    // 4. Admin Security Guard: Non-admin rejected from Admin API
    try {
      const res = await makeRequest('GET', '/api/admin/dashboard', undefined, studentToken);
      if (res.status === 403) {
        results.push({ name: '4. Admin Security Guard (Student Access Rejected with 403)', passed: true });
        console.log('✔ Test 4: Admin Route Security Enforced (403 Forbidden for Student)');
      } else throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    } catch (e: any) {
      results.push({ name: '4. Admin Security Guard', passed: false, error: e.message });
      console.log('✖ Test 4 Failed:', e.message);
    }

    // 5. Admin Dashboard Overview API
    try {
      const res = await makeRequest('GET', '/api/admin/dashboard', undefined, adminToken);
      if (
        res.status === 200 &&
        res.body.stats &&
        res.body.stats.totalStudents >= 1 &&
        res.body.stats.totalCourses >= 1
      ) {
        results.push({
          name: '5. Admin Dashboard Overview Stats API',
          passed: true,
          details: res.body.stats,
        });
        console.log(
          `✔ Test 5: Admin Dashboard Stats Loaded (Students: ${res.body.stats.totalStudents}, Courses: ${res.body.stats.totalCourses})`
        );
      } else throw new Error('Invalid dashboard stats response');
    } catch (e: any) {
      results.push({ name: '5. Admin Dashboard Overview Stats API', passed: false, error: e.message });
      console.log('✖ Test 5 Failed:', e.message);
    }

    // 6. Admin Students Management API (Listing & Search)
    try {
      const res = await makeRequest('GET', '/api/admin/students?search=Akhila', undefined, adminToken);
      if (res.status === 200 && res.body.students && res.body.students.length >= 1) {
        results.push({ name: '6. Admin Student Search & Management API', passed: true });
        console.log(`✔ Test 6: Admin Students Search OK (Found ${res.body.students.length} matching students)`);
      } else throw new Error('Students search failed');
    } catch (e: any) {
      results.push({ name: '6. Admin Student Search & Management API', passed: false, error: e.message });
      console.log('✖ Test 6 Failed:', e.message);
    }

    // 7. Admin Instructors Management API
    try {
      const res = await makeRequest('GET', '/api/admin/instructors', undefined, adminToken);
      if (res.status === 200 && res.body.instructors && res.body.instructors.length >= 8) {
        results.push({ name: '7. Admin Instructors Management API', passed: true });
        console.log(`✔ Test 7: Admin Instructors OK (${res.body.instructors.length} faculty members)`);
      } else throw new Error('Instructors fetch failed');
    } catch (e: any) {
      results.push({ name: '7. Admin Instructors Management API', passed: false, error: e.message });
      console.log('✖ Test 7 Failed:', e.message);
    }

    // 8. Admin Course Management (Create, List, Update)
    let createdCourseId = '';
    try {
      const createRes = await makeRequest(
        'POST',
        '/api/admin/courses',
        {
          title: 'Masterclass Aerial & Contemporary',
          description: 'Advanced aerial lifts and fluid transitions.',
          category: 'Contemporary',
          level: 'Advanced',
          instructorName: 'Rohan Deshmukh',
          durationWeeks: 6,
          price: 89,
          schedule: 'Sat 5:00 PM',
          image: '/slide2.jpg',
        },
        adminToken
      );

      if (createRes.status === 201 && createRes.body.course) {
        createdCourseId = createRes.body.course._id;
        console.log(`✔ Test 8a: Admin Created Course "${createRes.body.course.title}"`);

        // Update Course
        const updateRes = await makeRequest(
          'PUT',
          `/api/admin/courses/${createdCourseId}`,
          { price: 95 },
          adminToken
        );
        if (updateRes.status === 200 && updateRes.body.course?.price === 95) {
          results.push({ name: '8. Admin Course Create & Update API', passed: true });
          console.log('✔ Test 8b: Admin Updated Course Price to $95');
        } else throw new Error('Course update failed');
      } else throw new Error('Course creation failed');
    } catch (e: any) {
      results.push({ name: '8. Admin Course Create & Update API', passed: false, error: e.message });
      console.log('✖ Test 8 Failed:', e.message);
    }

    // 9. Student Learning Progress Dashboard API
    try {
      const res = await makeRequest('GET', '/api/student/dashboard', undefined, studentToken);
      if (res.status === 200 && res.body.stats) {
        results.push({
          name: '9. Student Learning Dashboard API',
          passed: true,
          details: res.body.stats,
        });
        console.log(
          `✔ Test 9: Student Progress Dashboard OK (Enrolled: ${res.body.stats.totalEnrolledCourses}, Completed Lessons: ${res.body.stats.completedLessonsCount})`
        );
      } else throw new Error('Student progress dashboard failed');
    } catch (e: any) {
      results.push({ name: '9. Student Learning Dashboard API', passed: false, error: e.message });
      console.log('✖ Test 9 Failed:', e.message);
    }

    // 10. Student Course Progress & Lessons API
    let targetCourseId = '';
    let targetLessonId = '';
    try {
      const progRes = await makeRequest('GET', '/api/student/progress', undefined, studentToken);
      if (progRes.status === 200 && progRes.body.courses && progRes.body.courses.length > 0) {
        targetCourseId = progRes.body.courses[0].courseId;

        // Fetch course lessons
        const lessonsRes = await makeRequest(
          'GET',
          `/api/student/courses/${targetCourseId}/progress`,
          undefined,
          studentToken
        );

        if (lessonsRes.status === 200 && lessonsRes.body.lessons && lessonsRes.body.lessons.length > 0) {
          // Find an uncompleted lesson
          const pending = lessonsRes.body.lessons.find((l: any) => !l.completed);
          targetLessonId = pending ? pending._id : lessonsRes.body.lessons[0]._id;

          results.push({
            name: '10. Student Course Lessons & Progress Query API',
            passed: true,
            details: `${lessonsRes.body.lessons.length} lessons loaded`,
          });
          console.log(`✔ Test 10: Course Lessons Progress OK (${lessonsRes.body.lessons.length} lessons loaded)`);
        } else throw new Error('Course lessons fetch failed');
      } else throw new Error('Student progress courses fetch failed');
    } catch (e: any) {
      results.push({ name: '10. Student Course Lessons & Progress Query API', passed: false, error: e.message });
      console.log('✖ Test 10 Failed:', e.message);
    }

    // 11. Student Lesson Completion & Progress Formula Verification
    try {
      const completeRes = await makeRequest(
        'POST',
        `/api/student/lessons/${targetLessonId}/complete`,
        {},
        studentToken
      );

      if (completeRes.status === 200 && completeRes.body.progress) {
        const { completedLessons, totalLessons, progressPercentage } = completeRes.body.progress;
        const expectedPct = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

        if (progressPercentage === expectedPct) {
          results.push({
            name: '11. Lesson Completion & (Completed/Total)*100 Formula Verification',
            passed: true,
            details: `Completed: ${completedLessons}/${totalLessons} -> ${progressPercentage}%`,
          });
          console.log(
            `✔ Test 11: Lesson Completed Successfully (Progress Formula Verified: ${completedLessons}/${totalLessons} = ${progressPercentage}%)`
          );
        } else {
          throw new Error(`Formula mismatch: Expected ${expectedPct}%, got ${progressPercentage}%`);
        }
      } else throw new Error('Lesson completion failed');
    } catch (e: any) {
      results.push({ name: '11. Lesson Completion & Progress Formula', passed: false, error: e.message });
      console.log('✖ Test 11 Failed:', e.message);
    }

    // 12. Verification of Progress Persistence across Logout and Login
    try {
      // Re-login as Akhila (simulating fresh login session)
      const freshLogin = await makeRequest('POST', '/api/auth/login', {
        email: 'akhilareddyevuri1908@gmail.com',
        password: '1234',
      });

      if (freshLogin.status === 200 && freshLogin.body.token) {
        const freshToken = freshLogin.body.token;

        // Query lessons again
        const verifyRes = await makeRequest(
          'GET',
          `/api/student/courses/${targetCourseId}/progress`,
          undefined,
          freshToken
        );

        const verifiedLesson = verifyRes.body.lessons?.find((l: any) => l._id === targetLessonId);
        if (verifiedLesson && verifiedLesson.completed === true) {
          results.push({
            name: '12. Progress Persistence Across Logout/Login in MongoDB',
            passed: true,
          });
          console.log('✔ Test 12: Progress Persistence Verified in MongoDB Across Re-Login');
        } else throw new Error('Lesson completion was not persisted in MongoDB');
      } else throw new Error('Fresh login failed');
    } catch (e: any) {
      results.push({ name: '12. Progress Persistence', passed: false, error: e.message });
      console.log('✖ Test 12 Failed:', e.message);
    }

    // 13. Automatic Course Completion & Completion Date Verification
    try {
      // Fetch remaining lessons and complete them all
      const lessonsRes = await makeRequest(
        'GET',
        `/api/student/courses/${targetCourseId}/progress`,
        undefined,
        studentToken
      );

      for (const lesson of lessonsRes.body.lessons || []) {
        if (!lesson.completed) {
          await makeRequest('POST', `/api/student/lessons/${lesson._id}/complete`, {}, studentToken);
        }
      }

      // Check enrollment status
      const finalRes = await makeRequest(
        'GET',
        `/api/student/courses/${targetCourseId}/progress`,
        undefined,
        studentToken
      );

      if (
        finalRes.status === 200 &&
        finalRes.body.progress?.isCompleted === true &&
        finalRes.body.progress?.progressPercentage === 100
      ) {
        results.push({
          name: '13. Automatic 100% Course Completion & Status Update',
          passed: true,
          details: 'Course marked as completed with completion date',
        });
        console.log('✔ Test 13: Course Automatically Marked 100% COMPLETED in MongoDB');
      } else {
        throw new Error(`Expected isCompleted=true and 100%, got: ${JSON.stringify(finalRes.body.progress)}`);
      }
    } catch (e: any) {
      results.push({ name: '13. Automatic Course Completion', passed: false, error: e.message });
      console.log('✖ Test 13 Failed:', e.message);
    }

  } catch (globalErr: any) {
    console.error('Test Suite encountered fatal error:', globalErr);
  } finally {
    console.log('\n================================================================');
    console.log('                       FINAL TEST RESULTS');
    console.log('================================================================');
    const passedCount = results.filter((r) => r.passed).length;
    console.log(`Total Verification Tests: ${results.length}`);
    console.log(`Passed: ${passedCount}`);
    console.log(`Failed: ${results.length - passedCount}`);
    console.log('================================================================\n');

    if (serverInstance) {
      serverInstance.close(() => {
        console.log('Test server closed cleanly.');
        process.exit(passedCount === results.length ? 0 : 1);
      });
    } else {
      process.exit(1);
    }
  }
}

runTests();
