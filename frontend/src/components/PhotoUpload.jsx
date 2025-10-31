import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { profilePhotoAPI } from '../services/api';
import toast from 'react-hot-toast';

const PhotoUpload = ({ currentPhoto, onPhotoUpdate, className = "" }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, JPG, or PNG file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    await uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('profilep', file);
      
      // Extract file format from file type
      const fileFormat = file.type.replace('image/', '');
      formData.append('fileFormat', fileFormat);

      console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);

      const response = await profilePhotoAPI.uploadPhoto(formData);
      
      toast.success('Photo uploaded successfully!');
      
      // Notify parent component
      if (onPhotoUpdate) {
        onPhotoUpdate();
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
        id="photo-upload"
        disabled={uploading}
      />
      
      <label
        htmlFor="photo-upload"
        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </>
        )}
      </label>
      
      <p className="text-xs text-gray-500 mt-2">
        JPEG, JPG, PNG up to 5MB
      </p>
    </div>
  );
};

export default PhotoUpload;
