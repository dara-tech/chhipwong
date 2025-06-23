import { useState, useCallback } from 'react';
import axios from 'axios';
import { FaCamera, FaUserCircle, FaSpinner, FaMagic, FaTrash, FaCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePicture = ({ 
  imagePreview, 
  handleFileChange: onFileChange,
  error: propError,
  setError: propSetError
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localError, setLocalError] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Use provided setError if available, otherwise use local state
  const setError = propSetError || setLocalError;
  // Use provided error if available, otherwise use local state
  const error = propError || localError;

  const removeBackground = async (file) => {
    try {
      setIsRemovingBg(true);
      setError(null);
      setUploadProgress(0);
  
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto'); // ✅ for high-quality
  
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': 'ubuN1CfeN1T5JMyeNoXHWMdy',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
  
      const blob = new Blob([response.data], { type: 'image/png' });
      const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), { type: 'image/png' });
      
      onFileChange(newFile);
      setUploadProgress(100);
      showSuccessMessage(t('profile.picture.bgRemoved'));
      return true;
    } catch (err) {
      setError(t('profile.picture.bgRemoveError'));
      console.error('Background removal error:', err);
      return false;
    } finally {
      setIsRemovingBg(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };
  
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const validateAndSetFile = useCallback(async (file, options = { removeBg: false }) => {
    setError(null);
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError(t('profile.picture.invalidType'));
      return false;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('profile.picture.sizeLimit'));
      return false;
    }

    // Check image dimensions
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = async () => {
        if (img.width < 100 || img.height < 100) {
          setError(t('profile.picture.dimensionError'));
          setIsLoading(false);
          resolve(false);
          return;
        }

        let processedFile = file;
        
        // Remove background if requested
        if (options.removeBg) {
          const success = await removeBackground(file);
          if (!success) {
            setIsLoading(false);
            resolve(false);
            return;
          }
          // The actual file change is handled in the removeBackground function
        } else {
          onFileChange(processedFile);
          showSuccessMessage(t('profile.picture.uploaded'));
        }
        
        setIsLoading(false);
        resolve(true);
      };
      
      img.onerror = () => {
        setError(t('profile.picture.loadError'));
        setIsLoading(false);
        resolve(false);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [onFileChange, setError, t]);

  const handleFileChange = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setIsLoading(true);
      validateAndSetFile(file, { removeBg: false });
    }
  };

  const handleRemoveBg = async () => {
    if (imagePreview) {
      setIsLoading(true);
      try {
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        const file = new File([blob], 'profile-picture.png', { type: 'image/png' });
        await validateAndSetFile(file, { removeBg: true });
      } catch (err) {
        setError(t('profile.picture.bgRemoveError'));
        console.error('Error processing image:', err);
        setIsLoading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    // Create a new FileList-like object with no files
    const event = {
      target: {
        files: []
      }
    };
    // Call onFileChange with null to indicate removal
    onFileChange(null);
    // Show success message
    showSuccessMessage(t('profile.picture.removed'));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e?.dataTransfer?.files?.[0];
    if (file) {
      setIsLoading(true);
      validateAndSetFile(file, { removeBg: false });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div 
        className={`relative w-48 h-48 rounded-full overflow-hidden shadow-lg ${
          isDragging ? 'ring-4 ring-primary/50' : 'ring-2 ring-base-300/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {imagePreview ? (
          <motion.img 
            src={imagePreview} 
            alt={t('profile.picture.alt')}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-avatar.png';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
            <FaUserCircle className="w-24 h-24 text-base-300" />
          </div>
        )}

        <AnimatePresence>
          {(showControls || isLoading || isRemovingBg) && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading || isRemovingBg ? (
                <div className="flex flex-col items-center text-white">
                  <FaSpinner className="w-8 h-8 animate-spin mb-2" />
                  {uploadProgress > 0 && (
                    <motion.div className="w-24 h-1 bg-gray-300/30 rounded-full overflow-hidden mt-2">
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </motion.div>
                  )}
                  <motion.span 
                    className="text-xs mt-2 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {isRemovingBg ? t('profile.picture.removingBg') : t('profile.picture.uploading')}
                  </motion.span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <label className="cursor-pointer group flex flex-col items-center">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-200">
                      <FaCamera className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-white mt-2 font-medium">{t('profile.picture.upload')}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>

                  {imagePreview && (
                    <div className="absolute bottom-4 flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleRemoveBg}
                        className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-primary/70 transition-all duration-200"
                        title={t('profile.picture.removeBg')}
                      >
                        <FaMagic className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-error/70 transition-all duration-200"
                        title={t('profile.picture.remove')}
                      >
                        <FaTrash className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {successMessage && (
          <motion.div 
            className="flex items-center space-x-2 px-3 py-1.5 bg-success/10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheck className="w-4 h-4 text-success" />
            <span className="text-xs text-success">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePicture;
