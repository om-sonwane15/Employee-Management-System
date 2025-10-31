import api from './api';

export const profileService = {
  uploadProfilePhoto: async (file, fileFormat) => {
    const formData = new FormData();
    formData.append('profilep', file);
    formData.append('fileFormat', fileFormat);
    
    const response = await api.post('/profilephoto/uploadpic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadProfilePhoto: async () => {
    const response = await api.get('/profilephoto/download', {
      responseType: 'blob'
    });
    return response.data;
  }
};
