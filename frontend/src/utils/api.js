import axios from 'axios';

// Configured via frontend/.env (see .env.example). Falls back to the local backend.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL:API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me')
};

// Mentor API
export const mentorAPI = {
    createGroup: (data) => api.post('/mentor/create-group', data),
    getGroups: () => api.get('/mentor/groups'),
    addStudents: (groupId, emails) => api.post(`/mentor/add-students/${groupId}`, { studentEmails: emails }),
    createContest: (groupId, data) => api.post(`/mentor/create-contest/${groupId}`, data),
    createGlobalContest: (data) => api.post('/mentor/create-global-contest', data),
    getGlobalContests: () => api.get('/mentor/global-contests'),
    updateGlobalContest: (contestId, data) => api.put(`/mentor/global-contests/${contestId}`, data),
    deleteGlobalContest: (contestId) => api.delete(`/mentor/global-contests/${contestId}`),
    getContestLeaderboard: (contestId) => api.get(`/student/contest-leaderboard/${contestId}`),
    viewProgress: (groupId, contestId) => api.get(`/mentor/progress/${groupId}/${contestId}`),
    addGroupProblem: (groupId, data) => api.post(`/mentor/group-problem/${groupId}`, data),
    getGroupStats: (groupId) => api.get(`/mentor/group-stats/${groupId}`),
    createSet: (groupId, data) => api.post(`/mentor/create-set/${groupId}`, data),
    getProblemSets: (groupId) => api.get(`/mentor/problem-sets/${groupId}`)
};

// Student API
export const studentAPI = {
    getParticipatedContests: () => api.get('/student/participated-contests'),
    getMyContests: () => api.get('/student/my-contests'),
    getUpsolveQueue: () => api.get('/student/upsolve-queue'),
    smartUpsolve: (contestId, count) => api.post('/student/smart-upsolve', { contestId, count }),
    addPersonalContest: (cfContestId, count) => api.post('/student/add-personal-contest', { cfContestId, count }),
    bulkUpsolve: () => api.post('/student/bulk-upsolve'),
    verifyProblem: (id) => api.post(`/student/verify-problem/${id}`),
    verifyQueue: () => api.post('/student/verify-queue'),
    markSolved: (problemStatusId) => api.put(`/student/mark-solved/${problemStatusId}`),
    getMyStats: () => api.get('/student/my-stats'),
    getGroupProblems: () => api.get('/student/group-problems'),
    submitGroupSolve: (problemId, data) => api.post(`/student/submit-solve/${problemId}`, data),
    getGlobalContests: () => api.get('/student/global-contests'),
    registerForContest: (contestId) => api.post(`/student/register-contest/${contestId}`),
    getContestLeaderboard: (contestId) => api.get(`/student/contest-leaderboard/${contestId}`)
};

// Codeforces Stats API
export const codeforcesStatsAPI = {
    analyzeStats: (handle) => api.get(`/codeforces-stats/analyze/${encodeURIComponent(handle)}`)
};

// Contact API
export const contactAPI = {
    submit: (data) => api.post('/contact/submit', data)
};

export default api;
