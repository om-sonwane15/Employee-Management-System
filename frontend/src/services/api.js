import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/authorize/register', userData),
  login: (credentials) => api.post('/authorize/login', credentials),
  forgotPassword: (email) => api.post('/authorize/forgot', { email }),
  resetPassword: (data) => api.post('/authorize/reset', data),
  changePassword: (passwords) => api.post('/authorize/changepass', passwords),
  getProfile: () => api.get('/authorize/profile'),
};

// Employee API calls
export const employeeAPI = {
  getAllEmployees: () => api.get('/employee/all'),
  getEmployeeList: (params) => api.get('/employee/emplist', { params }),
  getEmployeeById: async (id) => {
    const response = await api.get('/employee/all');
    const employee = response.data.employees?.find(emp => emp._id === id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return { data: employee };
  },
  updateProfile: (data) => api.put('/employee/updateprofile', data),
  updateEmployee: (id, data) => api.put('/employee/updateprofile', data), 
  deleteEmployee: (id) => api.delete(`/employee/${id}`),
  createEmployee: (data) => api.post('/employee/create', data), 
};

// Department API calls
export const departmentAPI = {
  addDepartment: (data) => api.post('/adddept', data),
  deleteDepartment: (id) => api.delete(`/dept/${id}`),
  getDepartmentList: () => api.get('/deptlist'),
  getDepartments: (params) => api.get('/departments', { params }),
  updateDepartment: (id, data) => api.put(`/dept/${id}`, data), 
};


export const profilePhotoAPI = {
  uploadPhoto: async (formData) => {
    try {
      const token = localStorage.getItem('token');
    
      const response = await fetch(`${API_BASE_URL}/api/profilephoto/uploadpic`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
         
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
         
          errorMessage = response.statusText || `HTTP ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  },

  downloadPhoto: async (userId = null) => {
    try {
      const token = localStorage.getItem('token');
      const url = userId 
        ? `${API_BASE_URL}/api/profilephoto/download/${userId}`
        : `${API_BASE_URL}/api/profilephoto/download`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Photo not found');
        }
        throw new Error(`Failed to download photo: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Photo download error:', error);
      throw error;
    }
  },


  uploadPhotoAxios: async (formData) => {
    try {
      const response = await api.post('/profilephoto/uploadpic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
       
        transformRequest: [(data) => data],
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  },
};

export const attendanceAPI = {
  checkin: () => api.post("/attendance/checkin"),
  checkout: () => api.post("/attendance/checkout"),
  getMyAttendance: () => api.get("/attendance/my"),
  getAttendance: (params={}) => api.get("/attendance", { params }),
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
};
export const ticketAPI = {
  createTicket: (subject, message) => api.post("/tickets", { subject, message }),
  getMyTickets: () => api.get("/tickets/my"),
  getAllTickets: () => api.get("/tickets"),
  sendMessage: (ticketId, content) => api.post(`/tickets/${ticketId}/message`, { content }),
  updateStatus: (ticketId, status) => api.patch(`/tickets/${ticketId}/status`, { status }),
};

export const payrollAPI = {
  getPayroll: () => api.get("/payroll"),
  editPayroll: (data) => api.post("/payroll", data),
  releasePayroll: (id) => api.post(`/payroll/release/${id}`),
  exportPayroll: async () => {
    const token = localStorage.getItem("token");
    return fetch("http://localhost:3000/api/payroll/export", {
      headers: { "Authorization": `Bearer ${token}` }
    });
  }
};

export const reportsAPI = {
  getEmployeeReport: (params) => api.get('/reports/employees', { params }),
  getDepartmentReport: (params) => api.get('/reports/departments', { params }),
  getAttendanceReport: (params) => api.get('/reports/attendance', { params }),
  getPayrollReport: (params) => api.get('/reports/payroll', { params }),
};

export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  getSystemInfo: () => api.get('/settings/system'),
};

export const apiUtils = {
  downloadFile: async (url, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  },

  uploadWithProgress: async (url, formData, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve({ success: true });
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_BASE_URL}${url}`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(formData);
    });
  },

  formatError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

export default api;