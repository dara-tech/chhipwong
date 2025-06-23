import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const SocialMedia = ({ formData, onInputChange }) => {
  const { t } = useTranslation();
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

    const socialPlatforms = [
    {
      name: 'facebook',
      label: t('socialMedia.facebook'),
      icon: <FaFacebook className="text-[#1877F2] text-xl" />,
      placeholder: t('socialMedia.facebookPlaceholder'),
      color: '#1877F2'
    },
    {
      name: 'instagram',
      label: t('socialMedia.instagram'),
      icon: <FaInstagram className="text-[#E4405F] text-xl" />,
      placeholder: t('socialMedia.instagramPlaceholder'),
      color: '#E4405F'
    },
    {
      name: 'youtube',
      label: t('socialMedia.youtube'),
      icon: <FaYoutube className="text-[#FF0000] text-xl" />,
      placeholder: t('socialMedia.youtubePlaceholder'),
      color: '#FF0000'
    },
    {
      name: 'linkedin',
      label: t('socialMedia.linkedin'),
      icon: <FaLinkedin className="text-[#0A66C2] text-xl" />,
      placeholder: t('socialMedia.linkedinPlaceholder'),
      color: '#0A66C2'
    }
  ];

  return (
    <div className="space-y-4">
      {socialPlatforms.map((platform) => (
        <div key={platform.name} className="form-control space-y-2">
          <label className="label">
            <span className="label-text font-medium capitalize flex items-center gap-2">
              {platform.icon}
              {platform.label}
            </span>
          </label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 group-hover:text-[${platform.color}] transition-colors duration-200">
              {platform.icon}
            </span>
            <input
              name={`socialMedia.${platform.name}`}
              value={formData.socialMedia[platform.name]}
              onChange={onInputChange}
              onFocus={() => handleFocus(platform.name)}
              onBlur={handleBlur}
              className={`input input-bordered w-full pl-10 transition-all duration-200 hover:border-[${platform.color}] ${
                focusedField === platform.name ? `border-[${platform.color}] ring-1 ring-[${platform.color}]` : ''
              } focus:border-none focus:ring-0 focus:outline-primary`}
              placeholder={platform.placeholder}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialMedia;