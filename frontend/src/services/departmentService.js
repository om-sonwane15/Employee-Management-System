import api from './api';

export const departmentService = {
  getAllDepartments: async () => {
    const response = await api.get('/deptlist');
    return response.data;
  },

  getDepartmentList: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/departments', {
      params: { page, limit, search }
    });
    return response.data;
  },

  addDepartment: async (name) => {
    const response = await api.post('/adddept', { name });
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/dept/${id}`);
    return response.data;
  }
};
