import axios from "axios";

const API_BASE_URL =
  "https://careerconnect-backend-production-18fd.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

export const jobService = {
  getAllJobs: () => api.get("/jobs"),
  getJobById: (id) => api.get(`/jobs/${id}`),
  searchJobs: (keyword) => api.get(`/jobs/search?keyword=${keyword}`),
  createJob: (data) => api.post("/jobs/recruiter", data),
  getMyJobs: () => api.get("/jobs/recruiter"),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

export const applicationService = {
  applyForJob: (jobId) => api.post(`/applications/apply/${jobId}`),
  getMyApplications: () => api.get("/applications/my"),
  getApplicationsByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) =>
    api.put(`/applications/${id}/status?status=${status}`),
};

export default api;
