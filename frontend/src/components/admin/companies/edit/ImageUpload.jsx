import { useState, useEffect } from 'react';
import { FaCamera, FaInfoCircle, FaTimes, FaUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ImageUpload = ({ 
  field, 
  label, 
  currentImage, 
    previewImage: previewImageProp, 
  onImageChange, 
  tooltip,
  aspectRatio = "aspect-square"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreviewImage(currentImage);
  }, [currentImage]);

  const handleImageChange = async (file) => {
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Only call onImageChange if it exists
      if (typeof onImageChange === 'function') {
        await onImageChange(field, file);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      // Reset preview image on error
      setPreviewImage(currentImage);
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (typeof onImageChange === 'function') {
      onImageChange(field, null);
    }
  };

  return (
    <div className="form-control space-y-2">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
        {tooltip && (
          <div className="tooltip" data-tip={tooltip}>
            <FaInfoCircle className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </label>
      
      <div 
        className={`relative ${aspectRatio} border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragging ? 'border-primary bg-primary/5' : 'border-base-300'
        } ${!previewImage ? 'hover:border-primary/50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {previewImage ? (
          <div className="relative w-full h-full group">
            <img 
              src={previewImage} 
              alt={`${field} preview`} 
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <label 
                className={`btn btn-circle btn-sm ${isUploading ? 'btn-disabled' : 'btn-primary'}`}
                title="Change image"
              >
                <FaCamera className="w-4 h-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileInput}
                  disabled={isUploading}
                />
              </label>
              <button
                onClick={removeImage}
                className="btn btn-circle btn-sm btn-error"
                title="Remove image"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <FaUpload className="w-8 h-8 text-base-300 mb-2" />
            <p className="text-sm text-base-content/70">
              Drag and drop an image here, or{' '}
              <label className="link link-primary cursor-pointer">
                browse
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileInput}
                  disabled={isUploading}
                />
              </label>
            </p>
            <p className="text-xs text-base-content/50 mt-1">
              Max file size: 5MB
            </p>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-base-100/80 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;