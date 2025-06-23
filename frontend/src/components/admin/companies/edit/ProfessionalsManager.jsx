import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrash, FaUserCog, FaUser, FaBriefcase, FaEnvelope, FaAlignLeft, FaPhone } from 'react-icons/fa';
import ImageUpload from './ImageUpload';

const ProfessionalsManager = ({ professionals = [], onProfessionalsChange, loading = false }) => {
  const { t } = useTranslation();

  // Default professional structure
  const createDefaultProfessional = () => ({
    name: '',
    role: '',
    email: '',
    phone: '',
    description: '',
    image: null,
    newImageFile: null,
    images: [],
    newImageFiles: []
  });

  const handleAddProfessional = () => {
    try {
      const newProfessionals = Array.isArray(professionals) ? [...professionals] : [];
      newProfessionals.push(createDefaultProfessional());
      onProfessionalsChange(newProfessionals);
    } catch (error) {
      console.error('Error adding professional:', error);
    }
  };

  const handleRemoveProfessional = (index) => {
    try {
      if (!Array.isArray(professionals) || index < 0 || index >= professionals.length) {
        console.error('Invalid index for removing professional:', index);
        return;
      }
      
      // Clean up object URLs to prevent memory leaks
      const professionalToRemove = professionals[index];
      if (professionalToRemove?.image && professionalToRemove.image.startsWith('blob:')) {
        URL.revokeObjectURL(professionalToRemove.image);
      }
      if (Array.isArray(professionalToRemove?.images)) {
        professionalToRemove.images.forEach(img => {
          if (typeof img === 'string' && img.startsWith('blob:')) {
            URL.revokeObjectURL(img);
          }
        });
      }

      const newProfessionals = professionals.filter((_, i) => i !== index);
      onProfessionalsChange(newProfessionals);
    } catch (error) {
      console.error('Error removing professional:', error);
    }
  };

  const handleInputChange = (index, field, value) => {
    try {
      if (!Array.isArray(professionals) || index < 0 || index >= professionals.length) {
        console.error('Invalid index or professionals array:', index, professionals);
        return;
      }

      const newProfessionals = professionals.map((prof, i) => {
        if (i === index) {
          // Ensure prof is an object and has the required structure
          const currentProf = prof && typeof prof === 'object' ? prof : createDefaultProfessional();
          return { ...currentProf, [field]: value };
        }
        return prof;
      });
      
      onProfessionalsChange(newProfessionals);
    } catch (error) {
      console.error('Error updating professional input:', error);
    }
  };

  const handleImageChange = (index, field, file) => {
    try {
      if (!Array.isArray(professionals) || index < 0 || index >= professionals.length) {
        console.error('Invalid index or professionals array:', index, professionals);
        return;
      }

      const newProfessionals = professionals.map((prof, i) => {
        if (i === index) {
          const currentProf = prof && typeof prof === 'object' ? prof : createDefaultProfessional();
          
          // Clean up old blob URL if it exists
          if (currentProf.image && typeof currentProf.image === 'string' && currentProf.image.startsWith('blob:')) {
            URL.revokeObjectURL(currentProf.image);
          }

          // If file is null, it means the image was removed
          if (!file) {
            return {
              ...currentProf,
              image: '',
              newImageFile: null,
              hasNewImage: false,
              originalImage: null
            };
          }

          // Create new blob URL for preview
          const newImageUrl = URL.createObjectURL(file);

          // Handle single image (primary image)
          if (field === 'image') {
            return {
              ...currentProf,
              image: newImageUrl,
              newImageFile: file,
              hasNewImage: true,
              originalImage: currentProf.image && !currentProf.image.startsWith('blob:') ? currentProf.image : null
            };
          }
          
          return currentProf;
        }
        return prof;
      });
      
      // Log the state change for debugging
      console.log('Updating professionals with new image:', {
        index,
        field,
        newProfessionals,
        fileType: file?.type,
        fileSize: file?.size,
        hasNewImage: newProfessionals[index]?.hasNewImage
      });
      
      onProfessionalsChange(newProfessionals);
    } catch (error) {
      console.error('Error handling image change:', error);
    }
  };

  // Add a function to handle image preview
  const getImagePreview = (professional) => {
    if (!professional) return null;
    
    // If there's a new image file, use its blob URL
    if (professional.newImageFile) {
      return professional.image;
    }
    
    // If there's an existing image URL (either blob or cloudinary), use it
    if (professional.image) {
      return professional.image;
    }
    
    return null;
  };

  // Add a function to handle image removal
  const handleImageRemove = (professionalIndex, imageIndex) => {
    try {
      if (!Array.isArray(professionals) || professionalIndex < 0 || professionalIndex >= professionals.length) {
        console.error('Invalid professional index:', professionalIndex);
        return;
      }

      const newProfessionals = professionals.map((prof, i) => {
        if (i === professionalIndex) {
          const currentProf = prof && typeof prof === 'object' ? prof : createDefaultProfessional();
          
          // Clean up blob URL if it exists
          if (currentProf.image && typeof currentProf.image === 'string' && currentProf.image.startsWith('blob:')) {
            URL.revokeObjectURL(currentProf.image);
          }

          // If removing the primary image
          if (imageIndex === -1) {
            return {
              ...currentProf,
              image: null,
              newImageFile: null,
              hasNewImage: false,
              originalImage: null
            };
          }

          // If removing an additional image
          const currentImages = Array.isArray(currentProf.images) ? currentProf.images : [];
          const currentImageFiles = Array.isArray(currentProf.newImageFiles) ? currentProf.newImageFiles : [];
          
          if (imageIndex < 0 || imageIndex >= currentImages.length) {
            console.error('Invalid image index:', imageIndex);
            return currentProf;
          }

          // Clean up blob URL
          const imageToRemove = currentImages[imageIndex];
          if (typeof imageToRemove === 'string' && imageToRemove.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove);
          }

          return {
            ...currentProf,
            images: currentImages.filter((_, idx) => idx !== imageIndex),
            newImageFiles: currentImageFiles.filter((_, idx) => idx !== imageIndex),
            hasNewImages: true
          };
        }
        return prof;
      });
      
      onProfessionalsChange(newProfessionals);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  // Cleanup effect for component unmount
  React.useEffect(() => {
    return () => {
      // Clean up all blob URLs when component unmounts
      if (Array.isArray(professionals)) {
        professionals.forEach(prof => {
          if (prof?.image && typeof prof.image === 'string' && prof.image.startsWith('blob:')) {
            URL.revokeObjectURL(prof.image);
          }
          if (Array.isArray(prof?.images)) {
            prof.images.forEach(img => {
              if (typeof img === 'string' && img.startsWith('blob:')) {
                URL.revokeObjectURL(img);
              }
            });
          }
        });
      }
    };
  }, [professionals]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4 w-full max-w-3xl">
          <div className="h-8 bg-base-300 rounded w-1/4"></div>
          <div className="h-48 bg-base-300 rounded"></div>
          <div className="h-48 bg-base-300 rounded"></div>
        </div>
      </div>
    );
  }

  // Ensure professionals is always an array
  const safeProfessionals = Array.isArray(professionals) ? professionals : [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('professionalsManager.allProfessionals')}
          </h3>
          <p className="text-sm text-base-content/60">
            {t('professionalsManager.description', 'Manage your team members and their roles')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProfessional}
          className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          {t('professionalsManager.addProfessional')}
        </button>
      </div>

      <div className="space-y-6">
        {safeProfessionals.map((prof, index) => {
          // Ensure prof is a valid object
          const safeProfessional = prof && typeof prof === 'object' ? prof : createDefaultProfessional();
          
          return (
            <div 
              key={`professional-${index}`}
              className="p-6 border border-base-300 rounded-xl bg-base-200/50 backdrop-blur-sm relative grid grid-cols-1 md:grid-cols-3 gap-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="form-control md:col-span-1">
                <ImageUpload 
                  field="image"
                  currentImage={getImagePreview(safeProfessional)}
                  onImageChange={(field, file) => handleImageChange(index, field, file)}
                  aspectRatio="aspect-square"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FaUser className="text-primary" />
                      {t('professionalsManager.name')}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={safeProfessional.name || ''}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className="input input-bordered w-full focus:border-none focus:ring-0 focus:outline-primary transition-all duration-300"
                    placeholder={t('professionalsManager.namePlaceholder')}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FaBriefcase className="text-primary" />
                      {t('professionalsManager.role')}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={safeProfessional.role || ''}
                    onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                    className="input input-bordered w-full focus:border-none focus:ring-0 focus:outline-primary transition-all duration-300"
                    placeholder={t('professionalsManager.rolePlaceholder')}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FaEnvelope className="text-primary" />
                      {t('professionalsManager.email')}
                    </span>
                  </label>
                  <input
                    type="email"
                    value={safeProfessional.email || ''}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    className="input input-bordered w-full focus:border-none focus:ring-0 focus:outline-primary transition-all duration-300"
                    placeholder={t('professionalsManager.emailPlaceholder')}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FaPhone className="text-primary" />
                      {t('professionalsManager.phone')}
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={safeProfessional.phone || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d+()\s-]/g, '');
                      handleInputChange(index, 'phone', value);
                    }}
                    className="input input-bordered w-full focus:border-none focus:ring-0 focus:outline-primary transition-all duration-300"
                    placeholder={t('professionalsManager.phonePlaceholder', '+1 (555) 123-4567')}
                    pattern="[0-9\s+\-()]*"
                    maxLength="20"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <FaAlignLeft className="text-primary" />
                      {t('professionalsManager.description')}
                    </span>
                  </label>
                  <textarea
                    value={safeProfessional.description || ''}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    className="textarea textarea-bordered w-full h-32 focus:border-none focus:ring-0 focus:outline-primary transition-all duration-300"
                    placeholder={t('professionalsManager.descriptionPlaceholder')}
                  ></textarea>
                </div>

                {/* Multiple Images Display */}
                {Array.isArray(safeProfessional.images) && safeProfessional.images.length > 0 && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Additional Images</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {safeProfessional.images.map((img, imgIndex) => (
                        <div key={`image-${imgIndex}`} className="relative">
                          <img 
                            src={img} 
                            alt={`Additional ${imgIndex + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageRemove(index, imgIndex)}
                            className="absolute -top-2 -right-2 btn btn-xs btn-circle btn-error"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveProfessional(index)}
                className="btn btn-ghost btn-sm btn-circle absolute top-4 right-4 hover:bg-error/10 transition-colors duration-300"
                aria-label={t('professionalsManager.removeProfessional')}
              >
                <FaTrash className="text-error" />
              </button>
            </div>
          );
        })}
      </div>

      {safeProfessionals.length === 0 && (
        <div className="text-center py-12 bg-base-200/50 rounded-xl border border-dashed border-base-300">
          <FaUserCog className="mx-auto text-4xl text-base-content/30 mb-4" />
          <p className="text-base-content/60 text-lg">{t('professionalsManager.noProfessionals')}</p>
          <button
            type="button"
            onClick={handleAddProfessional}
            className="btn btn-primary btn-sm gap-2 mt-4"
          >
            <FaPlus />
            {t('professionalsManager.addFirstProfessional')}
          </button>
        </div>
      )}
    </div>
  );
};

ProfessionalsManager.propTypes = {
  professionals: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      role: PropTypes.string,
      email: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      newImageFile: PropTypes.oneOfType([PropTypes.object, PropTypes.instanceOf(File)]),
      images: PropTypes.arrayOf(PropTypes.string),
      newImageFiles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.instanceOf(File)]))
    })
  ),
  onProfessionalsChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ProfessionalsManager.defaultProps = {
  professionals: [],
  loading: false
};

export default ProfessionalsManager;