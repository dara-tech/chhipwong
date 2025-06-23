import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaCamera, FaImage, FaSpinner, FaCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// Enhanced skeleton loader with modern design
const LogoSkeleton = () => (
  <div className="flex flex-col items-center space-y-4 p-6">
    <div className="avatar">
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
    </div>
    <div className="h-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded w-3/4 animate-pulse"></div>
    <div className="h-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded w-1/2 animate-pulse"></div>
  </div>
);

const LogoUpload = ({ logo, logoPreview, onLogoChange, error, setError }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'

  const isLoading = isRemovingBg || isCheckingImage || isUploading;

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setUploadState('uploading');
      validateAndSetFile(e.target.files[0]);
    }
  }, []);

  const validateAndSetFile = useCallback((file) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError(t('logoUpload.errorInvalidType'));
      setUploadState('error');
      setIsUploading(false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError(t('logoUpload.errorSizeTooLarge'));
      setUploadState('error');
      setIsUploading(false);
      return;
    }
    checkImageSuitability(file);
  }, [setError, t]);

  const checkImageSuitability = useCallback((file) => {
    setIsCheckingImage(true);
    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        setError(t('logoUpload.errorTooSmall'));
        setIsCheckingImage(false);
        setIsUploading(false);
        setUploadState('error');
        return;
      }
      onLogoChange(file);
      setIsCheckingImage(false);
      setIsUploading(false);
      setUploadState('success');
    };
    img.onerror = () => {
      setError(t('logoUpload.errorCorrupted'));
      setIsCheckingImage(false);
      setIsUploading(false);
      setUploadState('error');
    };
    img.src = URL.createObjectURL(file);
  }, [onLogoChange, setError, t]);

  const handleDragEvents = useCallback((e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIsUploading(true);
      setUploadState('uploading');
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [handleDragEvents, validateAndSetFile]);

  const removeBackground = useCallback(async () => {
    if (!logo) return;
    setIsRemovingBg(true);
    setError(null);
    setUploadProgress(0);
    setUploadState('uploading');

    const formData = new FormData();
    formData.append('image_file', logo);
    formData.append('size', 'auto');

    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: { 'X-Api-Key': 'ubuN1CfeN1T5JMyeNoXHWMdy' },
        responseType: 'arraybuffer',
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      const blob = new Blob([response.data], { type: 'image/png' });
      const newFile = new File([blob], logo.name.replace(/\.[^/.]+$/, '.png'), { type: 'image/png' });
      onLogoChange(newFile);
      setUploadState('success');
    } catch (err) {
      setError(t('logoUpload.errorBgRemoval'));
      setUploadState('error');
      console.error('Background removal error:', err);
    } finally {
      setIsRemovingBg(false);
    }
  }, [logo, onLogoChange, setError, t]);

  const statusMessage = useMemo(() => {
    switch (uploadState) {
      case 'uploading':
        if (isRemovingBg) return t('logoUpload.statusRemovingBg', { progress: uploadProgress });
        if (isCheckingImage) return t('logoUpload.statusAnalyzing');
        return t('logoUpload.statusUploading');
      case 'success':
        return t('logoUpload.statusSuccess');
      case 'error':
        return t('logoUpload.statusError');
      default:
        return t('logoUpload.statusIdle');
    }
  }, [uploadState, isRemovingBg, isCheckingImage, uploadProgress, t]);

  if (!onLogoChange) return <LogoSkeleton />;

  return (
    <div className="form-control w-full max-w-md mx-auto">
      <div
        className={`relative p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-base-300'
        } ${error ? 'border-error' : ''} ${uploadState === 'success' ? 'border-success' : ''}`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="avatar">
              <div className={`w-48 h-48 rounded-full ring-4 ring-offset-base-100 ring-offset-4 overflow-hidden transition-all duration-300 ${
                uploadState === 'success' ? 'ring-success/20' : 'ring-primary/20'
              }`}>
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt={t('logoUpload.previewAlt')} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-full h-full flex items-center justify-center text-5xl text-base-content/30">
                    <FaImage />
                  </div>
                )}
              </div>
            </div>

            <label 
              className={`absolute bottom-2 right-2 btn btn-circle shadow-lg cursor-pointer transition-all duration-300 ${
                uploadState === 'success' ? 'btn-success' : 'btn-primary'
              }`}
            >
              {isLoading ? (
                <FaSpinner className="h-5 w-5 animate-spin" />
              ) : uploadState === 'success' ? (
                <FaCheck className="h-5 w-5" />
              ) : (
                <FaCamera className="h-5 w-5" />
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/png, image/jpeg, image/gif" 
                onChange={handleFileChange} 
                disabled={isLoading} 
              />
            </label>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('logoUpload.title')}
            </p>
            <p className={`text-sm px-4 transition-colors duration-300 ${
              uploadState === 'success' ? 'text-success' : 
              uploadState === 'error' ? 'text-error' : 
              'text-base-content/70'
            }`}>
              {statusMessage}
            </p>
          </div>

          {logo && (
            <button 
              onClick={removeBackground} 
              disabled={isRemovingBg} 
              className={`btn btn-sm group relative overflow-hidden ${
                uploadState === 'success' ? 'btn-success' : 'btn-secondary'
              }`}
            >
              <span className="relative z-10 flex items-center">
                {isRemovingBg ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaImage className="mr-2" />
                )}
                {t('logoUpload.removeBgButton')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            </button>
          )}

          {isRemovingBg && (
            <div className="w-56">
              <progress 
                className="progress progress-primary w-full" 
                value={uploadProgress} 
                max="100"
              ></progress>
            </div>
          )}
          
          <div className="text-xs text-base-content/50 pt-2">
            {t('logoUpload.supportedFormats')}
          </div>
        </div>
      </div>

      {error && (
        <div 
          role="alert" 
          className="alert alert-error mt-4 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;