import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaYoutube,
  FaGlobe,
  FaBuilding
} from 'react-icons/fa';
import useCompanies from '../../hooks/useCompanies';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const { companies, loading, error, getCompanies } = useCompanies();
  const [company, setCompany] = useState(null);

  // Default contact information
  const defaultContact = {
    address: 'Phnom Penh, Cambodia',
    phone: '+855 23 123 4567',
    email: 'info@khhara.com',
    social: {
      facebook: 'https://facebook.com/khhara',
      instagram: 'https://instagram.com/khhara',
      youtube: 'https://youtube.com/khhara',
      linkedin: 'https://linkedin.com/company/khhara'
    },
    coordinates: {
      lat: 11.5564,
      lng: 104.9282,
      zoom: 15
    }
  };

  useEffect(() => {
    if (!companies || companies.length === 0) {
      getCompanies();
    } else {
      setCompany(companies[0]);
    }
  }, [companies, getCompanies]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('contactPage.form.validation.required');
    if (!formData.email) {
      errors.email = t('contactPage.form.validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('contactPage.form.validation.email');
    }
    if (!formData.subject.trim()) errors.subject = t('contactPage.form.validation.required');
    if (!formData.message.trim()) errors.message = t('contactPage.form.validation.required');
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus({
        success: true,
        message: t('contactPage.form.success')
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: t('contactPage.form.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-200/50 to-base-100 py-12 px-4 my-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="h-12 w-3/4 mx-auto bg-base-300 rounded-xl"></div>
            <div className="h-6 w-1/2 mx-auto bg-base-300 rounded-lg mt-4"></div>
          </div>

          <div className="mb-12 rounded-xl overflow-hidden shadow-xl">
            <div className="aspect-w-16 aspect-h-9 w-full h-96 md:h-[500px] bg-base-300"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-base-100 p-8 rounded-xl shadow-lg">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-base-300 rounded"></div>
                    <div className="h-12 bg-base-300 rounded-lg"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-base-300 rounded"></div>
                    <div className="h-12 bg-base-300 rounded-lg"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-base-300 rounded"></div>
                  <div className="h-12 bg-base-300 rounded-lg"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-base-300 rounded"></div>
                  <div className="h-40 bg-base-300 rounded-lg"></div>
                </div>
                <div className="h-12 bg-base-300 rounded-lg"></div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-base-100 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-base-300 rounded-full"></div>
                  <div className="h-8 w-48 bg-base-300 rounded-lg ml-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-4 p-4">
                      <div className="w-10 h-10 bg-base-300 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-24 bg-base-300 rounded"></div>
                        <div className="h-4 w-32 bg-base-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-base-100 p-8 rounded-xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-base-300 rounded-full"></div>
                  <div className="h-8 w-48 bg-base-300 rounded-lg ml-4"></div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-12 h-12 bg-base-300 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-200/50 to-base-100 flex flex-col justify-center items-center px-4">
        <div className="bg-base-200/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
          <FaExclamationTriangle className="text-error text-5xl mx-auto mb-6" />
          <p className="text-xl text-error">{error}</p>
        </div>
      </div>
    );
  }

  const currentContact = company?.contact ? {
    ...defaultContact,
    ...company.contact,
    social: {
      ...defaultContact.social,
      ...(company.contact.social || {})
    },
    coordinates: {
      ...defaultContact.coordinates,
      ...(company.contact.coordinates || {})
    }
  } : defaultContact;

  const mapUrl = `https://maps.google.com/maps?q=${currentContact.coordinates.lat},${currentContact.coordinates.lng}&z=${currentContact.coordinates.zoom || 15}&output=embed&language=${i18n.language}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200/50 to-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary/10 to-secondary bg-clip-text mb-4 my-20">
            {t('contactPage.title')}
          </h1>
          <p className="text-lg text-base-content/70">
            {t('contactPage.subtitle')}
          </p>
        </div>

        {/* Map Section */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="aspect-w-16 aspect-h-9 w-full h-96 md:h-[500px]">
            <iframe
              title={t('contactPage.map.title')}
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-base-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            {submitStatus.message && (
              <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-error'} mb-6`}>
                {submitStatus.success ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('contactPage.form.name')}</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input input-bordered w-full transition-all duration-200 ${formErrors.name ? 'input-error' : 'hover:border-primary focus:border-primary'}`}
                    placeholder={t('contactPage.form.name')}
                  />
                  {formErrors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.name}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('contactPage.form.email')}</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input input-bordered w-full transition-all duration-200 ${formErrors.email ? 'input-error' : 'hover:border-primary focus:border-primary'}`}
                    placeholder={t('contactPage.form.email')}
                  />
                  {formErrors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.email}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('contactPage.form.subject')}</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`input input-bordered w-full transition-all duration-200 ${formErrors.subject ? 'input-error' : 'hover:border-primary focus:border-primary'}`}
                  placeholder={t('contactPage.form.subject')}
                />
                {formErrors.subject && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.subject}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{t('contactPage.form.message')}</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`textarea textarea-bordered w-full h-40 transition-all duration-200 ${formErrors.message ? 'textarea-error' : 'hover:border-primary focus:border-primary'}`}
                  placeholder={t('contactPage.form.message')}
                ></textarea>
                {formErrors.message && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.message}</span>
                  </label>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full hover:btn-secondary transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      {t('contactPage.form.sending')}
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      {t('contactPage.form.submit')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-base-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full mr-4">
                  <FaBuilding className="text-primary text-2xl" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t('contactPage.info.title')}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-base-200/50 transition-all duration-200 hover:scale-[1.02]">
                    <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                      <FaMapMarkerAlt className="text-primary text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('contactPage.info.addressTitle')}</h4>
                      <p className="text-base-content/70">
                        {currentContact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-base-200/50 transition-all duration-200 hover:scale-[1.02]">
                    <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                      <FaPhoneAlt className="text-primary text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('contactPage.info.phoneTitle')}</h4>
                      <a
                        href={`tel:${currentContact.phone.replace(/\D/g, '')}`}
                        className="text-base-content/70 hover:text-primary transition-colors"
                      >
                        {currentContact.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-base-200/50 transition-all duration-200 hover:scale-[1.02]">
                    <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                      <FaEnvelope className="text-primary text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('contactPage.info.emailTitle')}</h4>
                      <a
                        href={`mailto:${currentContact.email}`}
                        className="text-base-content/70 hover:text-primary transition-colors break-all"
                      >
                        {currentContact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-base-200/50 transition-all duration-200 hover:scale-[1.02]">
                    <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                      <FaClock className="text-primary text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('contactPage.info.hoursTitle')}</h4>
                      <p className="text-base-content/70 whitespace-pre-line">
                        {t('contactPage.info.hours')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-base-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full mr-4">
                  <FaGlobe className="text-primary text-2xl" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t('contactPage.social.title')}
                </h3>
              </div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {currentContact.social?.facebook && (
                  <a
                    href={currentContact.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-200 hover:scale-110"
                    aria-label={t('contactPage.social.facebook')}
                  >
                    <FaFacebook className="text-2xl text-[#1877F2]" />
                  </a>
                )}

                {currentContact.social?.instagram && (
                  <a
                    href={currentContact.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-200 hover:scale-110"
                    aria-label={t('contactPage.social.instagram')}
                  >
                    <FaInstagram className="text-2xl text-[#E1306C]" />
                  </a>
                )}

                {currentContact.social?.youtube && (
                  <a
                    href={currentContact.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-200 hover:scale-110"
                    aria-label={t('contactPage.social.youtube')}
                  >
                    <FaYoutube className="text-2xl text-[#FF0000]" />
                  </a>
                )}

                {currentContact.social?.linkedin && (
                  <a
                    href={currentContact.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-200 hover:scale-110"
                    aria-label={t('contactPage.social.linkedin')}
                  >
                    <FaLinkedin className="text-2xl text-[#0077B6]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;