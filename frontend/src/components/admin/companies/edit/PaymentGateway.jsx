import { useState } from 'react';
import { FaLink, FaQrcode } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ImageUpload from './ImageUpload';

const PaymentGateway = ({ formData, onInputChange, onImageChange }) => {
  const { t } = useTranslation();
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="space-y-6">
      {/* Payment Gateway Link */}
      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaLink className="text-primary" />
            {t('company.paymentGateway.link')}
          </span>
        </label>
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 group-hover:text-primary transition-colors duration-200">
            <FaLink className="text-primary" />
          </span>
          <input
            name="paymentGateway"
            value={formData.paymentGateway || ''}
            onChange={onInputChange}
            onFocus={() => handleFocus('paymentGateway')}
            onBlur={handleBlur}
            className={`input input-bordered w-full pl-10 transition-all duration-200 hover:border-primary ${
              focusedField === 'paymentGateway' ? 'border-primary ring-1 ring-primary' : ''
            } focus:border-none focus:ring-0 focus:outline-primary`}
            placeholder={t('company.paymentGateway.linkPlaceholder')}
          />
        </div>
      </div>

      {/* QR Code Image Upload */}
      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <FaQrcode className="text-primary" />
            {t('company.paymentGateway.qrCode')}
          </span>
        </label>
        <ImageUpload
          field="paymentQR"
          name="paymentQR"
          currentImage={formData.paymentQR}
          onImageChange={onImageChange}
          previewImage={formData.paymentQR}
          aspectRatio="1/1"
          className=""
        />
        <p className="text-xs text-gray-500 mt-1">{t('company.paymentGateway.qrDescription')}</p>
      </div>
    </div>
  );
};

export default PaymentGateway;
