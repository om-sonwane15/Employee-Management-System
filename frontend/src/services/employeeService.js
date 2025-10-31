import api from './api';

export const employeeService = {
  getAllEmployees: async () => {
    const response = await api.get('/employee/all');
    return response.data;
  },

  getEmployeeList: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/employee/emplist', {
      params: { page, limit, search }
    });
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employee/${id}`);
    return response.data;
  },

  updateProfile: async (name, email, department) => {
    const response = await api.put('/employee/updateprofile', { name, email, department });
    return response.data;
  }
};
