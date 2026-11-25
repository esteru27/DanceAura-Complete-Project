const API_BASE_URL = '/api';

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers = {}, ...rest } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const storedToken = token !== undefined ? token : localStorage.getItem('dance_aura_token');
  if (storedToken) {
    defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...rest,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// Authentication Endpoints
export const authAPI = {
  register: (userData: any) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  forgotPassword: (email: string) =>
    apiRequest('/auth/forgotpassword', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (resetToken: string, password: string) =>
    apiRequest(`/auth/resetpassword/${resetToken}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (profileData: any) =>
    apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  trackProgress: (data: { danceStyle: string; level: string; videoId: string }) =>
    apiRequest('/auth/trackprogress', { method: 'POST', body: JSON.stringify(data) }),
  getProgress: () => apiRequest('/auth/progress'),
};

// Course Endpoints
export const courseAPI = {
  getAll: (params?: { category?: string; level?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.level) query.append('level', params.level);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiRequest(`/courses${queryString}`);
  },
  getById: (id: string) => apiRequest(`/courses/${id}`),
  getCategories: () => apiRequest('/courses/categories'),
  createCourse: (courseData: any) =>
    apiRequest('/courses', { method: 'POST', body: JSON.stringify(courseData) }),
  updateCourse: (id: string, courseData: any) =>
    apiRequest(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(courseData) }),
  deleteCourse: (id: string) => apiRequest(`/courses/${id}`, { method: 'DELETE' }),
};

// Enrollment Endpoints
export const enrollmentAPI = {
  enroll: (courseId: string, scheduleTime?: string) =>
    apiRequest('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId, scheduleTime }),
    }),
  getMyEnrollments: () => apiRequest('/enrollments/my'),
  cancelEnrollment: (id: string) =>
    apiRequest(`/enrollments/${id}/cancel`, { method: 'PUT' }),
};

// Progress Endpoints (Legacy / Summary)
export const progressAPI = {
  getSummary: () => apiRequest('/progress/summary'),
  getByStyle: (style: string, level: string) => apiRequest(`/progress/${style}/${level}`),
};

// Instructor Endpoints
export const instructorAPI = {
  getAll: () => apiRequest('/instructors'),
  getById: (id: string) => apiRequest(`/instructors/${id}`),
  getDashboardStats: () => apiRequest('/instructors/dashboard/stats'),
};

// Contact Form Endpoint
export const contactAPI = {
  submit: (formData: { name: string; email: string; phone?: string; subject: string; message: string }) =>
    apiRequest('/contact', { method: 'POST', body: JSON.stringify(formData) }),
  getAll: () => apiRequest('/contact'),
};

// ==========================================
// FEATURE 1: ADMIN MANAGEMENT APIS
// ==========================================
export const adminAPI = {
  getDashboard: () => apiRequest('/admin/dashboard'),
  getStudents: (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/admin/students${q}`);
  },
  getStudentById: (id: string) => apiRequest(`/admin/students/${id}`),
  updateStudent: (id: string, data: any) =>
    apiRequest(`/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id: string) =>
    apiRequest(`/admin/students/${id}`, { method: 'DELETE' }),

  getInstructors: () => apiRequest('/admin/instructors'),
  createInstructor: (data: any) =>
    apiRequest('/admin/instructors', { method: 'POST', body: JSON.stringify(data) }),
  updateInstructor: (id: string, data: any) =>
    apiRequest(`/admin/instructors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInstructor: (id: string) =>
    apiRequest(`/admin/instructors/${id}`, { method: 'DELETE' }),

  getCourses: () => apiRequest('/admin/courses'),
  createCourse: (data: any) =>
    apiRequest('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: string, data: any) =>
    apiRequest(`/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: string) =>
    apiRequest(`/admin/courses/${id}`, { method: 'DELETE' }),
};

// ==========================================
// FEATURE 2: STUDENT LEARNING PROGRESS APIS
// ==========================================
export const studentProgressAPI = {
  getDashboard: () => apiRequest('/student/dashboard'),
  getProgress: () => apiRequest('/student/progress'),
  getCourseLessons: (courseId: string) => apiRequest(`/student/courses/${courseId}/progress`),
  completeLesson: (lessonId: string) =>
    apiRequest(`/student/lessons/${lessonId}/complete`, { method: 'POST' }),
  uncompleteLesson: (lessonId: string) =>
    apiRequest(`/student/lessons/${lessonId}/uncomplete`, { method: 'POST' }),
};
