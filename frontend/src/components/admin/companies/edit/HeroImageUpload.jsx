import React, { useState, useRef, useReducer, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaCamera,
  FaTrash,
  FaSpinner,
  FaMagic,
  FaUpload,
  FaImage,
} from 'react-icons/fa';
import axios from 'axios';


// Initial state for the reducer
const initialState = {
  file: null,
  previewUrl: '',
  isLoading: false,
  progress: 0,
  error: null,
};

// Reducer to manage the component's state logic
function uploadReducer(state, action) {
  switch (action.type) {
    case 'START_PROCESSING':
      return { ...state, isLoading: true, progress: 0, error: null };
    case 'PROCESS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        file: action.payload.file,
        previewUrl: action.payload.previewUrl,
      };
    case 'PROCESS_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'REMOVE_IMAGE':
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }
      return { ...initialState };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const HeroImageUpload = ({ currentImage, onImageChange }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [state, dispatch] = useReducer(uploadReducer, {
    ...initialState,
    previewUrl: currentImage || '',
  });

  const [isDragging, setIsDragging] = useState(false);

  // Memoized callback for handling file selection
  const handleFileSelected = useCallback((file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return;
    }
    
    // Revoke the old URL if it exists, to prevent memory leaks
    if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    dispatch({ type: 'PROCESS_SUCCESS', payload: { file, previewUrl } });
    onImageChange(file);
  }, [onImageChange, t, state.previewUrl]);

  // Memoized callback for removing the background
  const removeBackground = useCallback(async () => {
    if (!state.file) return;
    dispatch({ type: 'START_PROCESSING' });

    try {
      const formData = new FormData();
      formData.append('image_file', state.file);
      const { data } = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          responseType: 'blob',
          headers: { 'X-Api-Key': 'ubuN1CfeN1T5JMyeNoXHWMdy' }, // Replace with your API key
          onUploadProgress: (event) => {
            const progress = event.total ? Math.round((event.loaded * 100) / event.total) : 0;
            dispatch({ type: 'SET_PROGRESS', payload: progress });
          }
        }
      );
      const newFile = new File([data], `no-bg_${state.file.name}`, { type: 'image/png' });
      const newUrl = URL.createObjectURL(newFile);
      
      // Update state with the new image
      dispatch({ type: 'PROCESS_SUCCESS', payload: { file: newFile, previewUrl: newUrl } });
      onImageChange(newFile);
    } catch (error) {
      console.error(error);
      const errorMessage = t('imageUpload.bgRemoveError');
      dispatch({ type: 'PROCESS_ERROR', payload: errorMessage });
    }
  }, [state.file, onImageChange, t]);

  // Memoized callback for removing the image
  const removeImage = useCallback(() => {
    dispatch({ type: 'REMOVE_IMAGE' });
    onImageChange(null);
  }, [onImageChange]);
  
  // Handlers for drag and drop functionality
  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.isLoading) setIsDragging(dragging);
  };
  
  const handleDrop = (e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 flex justify-center items-center group
          ${isDragging ? 'border-primary scale-105 bg-primary/10' : 'border-base-300'}
          ${state.error ? 'border-error' : ''}
          ${state.previewUrl && !state.isLoading ? 'min-h-96' : 'h-64'}`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleDrop}
        onClick={() => !state.previewUrl && !state.isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {/* Placeholder for when there is no image */}
        {!state.previewUrl && !state.isLoading && (
          <div className="text-center cursor-pointer p-8">
            <FaUpload className="mx-auto text-5xl text-base-content/30 mb-4" />
            <p className="font-semibold text-lg text-base-content">
              {t('common.uploadImage')}
            </p>
            <p className="text-sm text-base-content/60 mt-1">
              {t('common.dragAndDrop')} or click to browse
            </p>
            <p className="text-xs text-base-content/40 mt-2">
              Supports JPG, PNG, GIF. Max size: 10MB
            </p>
          </div>
        )}

        {/* Loading state indicator */}
        {state.isLoading && (
          <div className="flex flex-col items-center text-center p-4">
            <FaSpinner className="text-4xl text-primary animate-spin" />
            <p className="mt-4 font-semibold text-base-content">Processing Image...</p>
            <progress
              className="progress progress-primary w-56 mt-2"
              value={state.progress}
              max="100"
            />
          </div>
        )}

        {/* Image preview and actions */}
        {state.previewUrl && !state.isLoading && (
          <div className="w-full h-full p-2">
            <img
              src={state.previewUrl}
              alt={t('profile.picture.alt') || 'Uploaded Preview'}
              className="object-contain w-full h-full rounded-lg max-h-96"
            />
            <div className="absolute top-3 right-3 flex flex-col items-center gap-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={removeBackground} className="btn btn-circle btn-primary" aria-label={t('common.removeBg')} data-tip={t('common.removeBg')}>
                <FaMagic/>
              </button>
              <button onClick={removeImage} className="btn btn-circle btn-error" aria-label={t('common.remove')} data-tip={t('common.remove')}>
                <FaTrash/>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroImageUpload;