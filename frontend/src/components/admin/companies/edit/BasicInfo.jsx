import { useState } from 'react';
import { IoInformationCircle } from 'react-icons/io5';

import { useTranslation } from 'react-i18next';
import ImageUpload from './ImageUpload';
import HeroImageUpload from './HeroImageUpload';

const BasicInfo = ({ formData, onInputChange, onImageChange, imagePreview }) => {
  const { t } = useTranslation();
  const [focusedField, setFocusedField] = useState(null);


  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Validate text length
  const validateTextLength = (text, maxLength) => {
    return text.length <= maxLength;
  };

  // Handle text input with validation
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    const maxLengths = {
      about: 500,
      mission: 200,
      vision: 200
    };

    if (maxLengths[name] && !validateTextLength(value, maxLengths[name])) {
      return;
    }

    onInputChange(e);
  };

  const renderTextArea = (field, label, placeholder, maxLength, tooltip) => (
    <div className="form-control space-y-2">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
        <div className="tooltip" data-tip={tooltip}>
          <IoInformationCircle className="w-4 h-4 text-gray-400" />
        </div>
      </label>
      <div className="relative">
        <textarea
          name={field}
          value={formData[field] || ''}
          onChange={handleTextChange}
          onFocus={() => handleFocus(field)}
          onBlur={handleBlur}
          className={`textarea w-full textarea-bordered h-32 transition-all duration-200 ${
            focusedField === field ? 'textarea-primary' : ''
          } focus:border-none focus:ring-0 focus:outline-primary`}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {formData[field]?.length || 0}/{maxLength}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text font-medium">{t('company.companyName')}</span>
          <div className="tooltip" data-tip={t('company.companyNameTooltip')}>
            <IoInformationCircle className="w-4 h-4 text-gray-400" />
          </div>
        </label>
        <input 
          name="name" 
          value={formData.name || ''} 
          onChange={onInputChange}
          onFocus={() => handleFocus('name')}
          onBlur={handleBlur}
          className={`input input-bordered w-full transition-all duration-200 ${
            focusedField === 'name' ? 'input-primary' : ''
          } focus:border-none focus:ring-0 focus:outline-primary`}
          placeholder={t('company.companyNamePlaceholder')} 
          required 
        />
      </div>

      {/* Hero Image Section */}
      <div className="mb-8 pb-6 border-b">
        <h3 className="text-lg font-medium mb-4">{t('company.heroSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
<HeroImageUpload 
  currentImage={formData.heroImage} 
  onImageChange={(file) => onImageChange('heroImage', file)} 
/>
          </div>
          <div className="flex items-center">
            <p className="text-sm text-gray-500">
              {t('company.heroImageDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* About, Mission, Vision Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {renderTextArea(
            'about',
            t('basicInfo.about'),
            t('basicInfo.aboutPlaceholder'),
            500,
            t('basicInfo.aboutTooltip')
          )}
          <ImageUpload
            field="aboutImage"
            label={t('basicInfo.aboutImage')}
            currentImage={formData.aboutImage}
            onImageChange={onImageChange}
            tooltip={t('basicInfo.aboutImageTooltip')}
            aspectRatio="aspect-video"
          />
        </div>

        <div className="space-y-4">
          {renderTextArea(
            'mission',
            t('basicInfo.mission'),
            t('basicInfo.missionPlaceholder'),
            200,
            t('basicInfo.missionTooltip')
          )}
          <ImageUpload
            field="missionImage"
            label={t('basicInfo.missionImage')}
            currentImage={formData.missionImage}
            onImageChange={onImageChange}
            tooltip={t('basicInfo.missionImageTooltip')}
            aspectRatio="aspect-video"
          />
        </div>

        <div className="space-y-4">
          {renderTextArea(
            'vision',
            t('basicInfo.vision'),
            t('basicInfo.visionPlaceholder'),
            200,
            t('basicInfo.visionTooltip')
          )}
          <ImageUpload
            field="visionImage"
            label={t('basicInfo.visionImage')}
            currentImage={formData.visionImage}
            onImageChange={onImageChange}
            tooltip={t('basicInfo.visionImageTooltip')}
            aspectRatio="aspect-video"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;