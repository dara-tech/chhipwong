import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContactInfo = ({ formData, onInputChange }) => {
  const { t } = useTranslation();
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const inputClasses = (fieldName) => `
    input input-bordered w-full transition-all duration-200
    ${focusedField === fieldName ? 'input-primary' : ''}
    focus:border-none focus:ring-0 focus:outline-primary
  `;

  return (
    <div className="space-y-4">
      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text font-medium">{t('contactInfo.address')}</span>
        </label>
        <input
          name="contact.address"
          value={formData.contact.address}
          onChange={onInputChange}
          onFocus={() => handleFocus('address')}
          onBlur={handleBlur}
          className={inputClasses('address')}
          placeholder={t('contactInfo.addressPlaceholder')}
        />
      </div>

      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text font-medium">{t('contactInfo.phone')}</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
            📞
          </span>
          <input
            name="contact.phone"
            value={formData.contact.phone}
            onChange={onInputChange}
            onFocus={() => handleFocus('phone')}
            onBlur={handleBlur}
            className={`${inputClasses('phone')} pl-10`}
            placeholder={t('contactInfo.phonePlaceholder')}
          />
        </div>
      </div>

      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text font-medium">{t('contactInfo.email')}</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
            ✉️
          </span>
          <input
            name="contact.email"
            value={formData.contact.email}
            onChange={onInputChange}
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            className={`${inputClasses('email')} pl-10`}
            type="email"
            placeholder={t('contactInfo.emailPlaceholder')}
          />
        </div>
      </div>

      <div className="form-control space-y-2    ">
        <label className="label">
          <span className="label-text font-medium">{t('contactInfo.mapLocation')}</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
            📍
          </span>
          <input
            name="contact.mapLocation"
            value={formData.contact.mapLocation}
            onChange={onInputChange}
            onFocus={() => handleFocus('mapLocation')}
            onBlur={handleBlur}
            className={`${inputClasses('mapLocation')} pl-10`}
            placeholder={t('contactInfo.mapLocationPlaceholder')}
          />
        </div>
        <label className="label">
          <span className="label-text-alt text-base-content/50">
            {t('contactInfo.mapLocationHelper')}
          </span>
        </label>
      </div>
    </div>
  );
};

export default ContactInfo; 