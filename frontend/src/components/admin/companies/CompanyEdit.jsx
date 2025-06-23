import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBuilding, FaPen, FaPhoneAlt, FaGlobe, FaFile, FaCreditCard, FaChevronDown, FaQuestionCircle, FaUserTie } from "react-icons/fa";
import useCompanies from "../../../hooks/useCompanies";
import LogoUpload from "./edit/LogoUpload";
import BasicInfo from "./edit/BasicInfo";
import ContactInfo from "./edit/ContactInfo";
import SocialMedia from "./edit/SocialMedia";
import PaymentGateway from "./edit/PaymentGateway";
import FormSection from "./edit/FormSection";
import PrivacyPolicy from "./edit/PrivacyPolicy";
import TermsAndConditions from "./edit/TermCondition";
import FAQManager from "./edit/FAQManager";
import ProfessionalsManager from './edit/ProfessionalsManager';
import { useTranslation } from "react-i18next";
import { toast } from 'react-hot-toast';

// Memoized Tab Button Component
const TabButton = memo(({ tab, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`tab tab-lg gap-2 transition-all duration-200 ${
      isActive 
        ? 'tab-active bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary text-primary shadow-lg' 
        : 'hover:bg-primary/5'
    }`}
  >
    {tab.icon}
    <span className="hidden sm:inline">{tab.label}</span>
  </button>
));

// Memoized Loading Skeleton Component
const LoadingSkeleton = memo(() => (
  <div className="container mx-auto p-6 max-w-6xl min-h-screen bg-base-100 pt-20">
    <div className="max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-10 bg-primary/10 rounded-xl w-64"></div>
        <div className="h-12 bg-primary/10 rounded-xl w-32"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex-shrink-0 h-14 w-40 bg-primary/10 rounded-xl"></div>
        ))}
      </div>
      
      {/* Content Skeleton */}
      <div className="bg-base-100 border border-primary/20 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-full"></div>
          <div className="h-8 bg-primary/10 rounded-xl w-48"></div>
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-primary/10 rounded-lg w-1/4"></div>
              <div className="h-12 bg-primary/10 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

const CompanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getCompany, updateCompany } = useCompanies();

  // Tab state
  const [activeTab, setActiveTab] = useState('logo');

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    about: "",
    aboutImage: "",
    mission: "",
    missionImage: "",
    vision: "",
    privacyPolicy: "",
    termsConditions: "",
    visionImage: "",
    heroImage: "",
    contact: {
      address: "",
      phone: "", 
      email: "",
      mapLocation: ""
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: ""
    },
    paymentGateway: "",
    paymentQR: "",
    heroImages: [],
    programsOffered: [],
    testimonials: [],
    FAQs: [],
    professionals: []
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState({
    about: null,
    mission: null,
    vision: null,
    heroImage: null,
    paymentQR: null
  });

  // Tab configuration
  const tabs = [
    { id: 'logo', label: t('company.sections.logo') || 'Logo', icon: <FaBuilding /> },
    { id: 'basic', label: t('company.sections.basicInfo') || 'Basic Info', icon: <FaPen /> },
    { id: 'contact', label: t('company.sections.contactInfo') || 'Contact Info', icon: <FaPhoneAlt /> },
    { id: 'social', label: t('company.sections.socialMedia') || 'Social Media', icon: <FaGlobe /> },
    { id: 'payment', label: t('company.sections.paymentGateway'), icon: <FaCreditCard /> },
    { id: 'privacy', label: t('company.sections.privacyPolicy') || 'Privacy Policy', icon: <FaFile /> },
    { id: 'terms', label: t('company.sections.termsAndConditions') || 'Terms & Conditions', icon: <FaFile /> },
    { id: 'faq', label: t('company.tabs.faq'), icon: <FaQuestionCircle /> },
    { id: 'professionals', label: t('professionalsManager.title'), icon: <FaUserTie /> }
  ];

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await getCompany(id);
        if (companyData) {
          setFormData({
            ...formData,
            name: companyData.name || "",
            logo: companyData.logo || "",
            about: companyData.about || "",
            aboutImage: companyData.aboutImage || "",
            mission: companyData.mission || "",
            missionImage: companyData.missionImage || "",
            vision: companyData.vision || "",
            privacyPolicy: companyData.privacyPolicy || "",
            termsConditions: companyData.termsConditions || "",
            visionImage: companyData.visionImage || "",
            heroImage: companyData.heroImage || "",
            contact: {
              address: companyData.contact?.address || "",
              phone: companyData.contact?.phone || "",
              email: companyData.contact?.email || "",
              mapLocation: companyData.contact?.mapLocation || ""
            },
            socialMedia: {
              facebook: companyData.socialMedia?.facebook || "",
              instagram: companyData.socialMedia?.instagram || "",
              youtube: companyData.socialMedia?.youtube || "",
              linkedin: companyData.socialMedia?.linkedin || ""
            },
            paymentGateway: companyData.paymentGateway || "",
            paymentQR: companyData.paymentQR || "",
            heroImages: companyData.heroImages || [],
            programsOffered: companyData.programsOffered || [],
            testimonials: companyData.testimonials || [],
            FAQs: companyData.FAQs || [],
            professionals: companyData.professionals || []
          });
          if (companyData.logo) {
            setLogoPreview(companyData.logo);
          }
          setImagePreview({
            about: companyData.aboutImage || null,
            mission: companyData.missionImage || null,
            vision: companyData.visionImage || null,
            heroImage: companyData.heroImage || null,
            paymentQR: companyData.paymentQR || null
          });
        }
      } catch (err) {
        setError(t('company.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoChange = (file) => {
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (field, file) => {
    if (!file) {
      setFormData(prev => ({
        ...prev,
        [field]: ""
      }));
      
      setImagePreview(prev => ({
        ...prev,
        [field]: null
      }));
      return;
    }

    let previewUrl;
    if (file instanceof File) {
      previewUrl = URL.createObjectURL(file);
    } else if (typeof file === 'string') {
      previewUrl = file;
    } else {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
    
    setImagePreview(prev => ({
      ...prev,
      [field]: previewUrl
    }));
  };

  const handleFaqChange = (newFaqs) => {
    setFormData(prev => ({
      ...prev,
      FAQs: newFaqs
    }));
  };

  const handleProfessionalsChange = (newProfessionals) => {
    setFormData(prev => ({
      ...prev,
      professionals: newProfessionals
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!formData.name.trim()) throw new Error(t('company.companyNameRequired'));

      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("about", formData.about || "");
      formDataToSend.append("mission", formData.mission || "");
      formDataToSend.append("vision", formData.vision || "");
      formDataToSend.append("privacyPolicy", formData.privacyPolicy || "");
      formDataToSend.append("termsConditions", formData.termsConditions || "");
      
      // Handle logo file if updated
      if (formData.logo instanceof File) {
        formDataToSend.append("logo", formData.logo);
      } else if (typeof formData.logo === 'string') {
        formDataToSend.append("logo", formData.logo);
      }

      // Handle hero image (single image)
      if (formData.heroImage instanceof File) {
        formDataToSend.append("heroImage", formData.heroImage);
      } else if (typeof formData.heroImage === 'string') {
        formDataToSend.append("heroImage", formData.heroImage);
      }

      // Handle section images
      if (formData.aboutImage instanceof File) {
        formDataToSend.append("aboutImage", formData.aboutImage);
      } else if (typeof formData.aboutImage === 'string') {
        formDataToSend.append("aboutImage", formData.aboutImage);
      }
      
      // Handle payment QR code
      if (formData.paymentQR instanceof File) {
        formDataToSend.append("paymentQR", formData.paymentQR);
      } else if (typeof formData.paymentQR === 'string') {
        formDataToSend.append("paymentQR", formData.paymentQR);
      }

      if (formData.missionImage instanceof File) {
        formDataToSend.append("missionImage", formData.missionImage);
      } else if (typeof formData.missionImage === 'string') {
        formDataToSend.append("missionImage", formData.missionImage);
      }

      if (formData.visionImage instanceof File) {
        formDataToSend.append("visionImage", formData.visionImage);
      } else if (typeof formData.visionImage === 'string') {
        formDataToSend.append("visionImage", formData.visionImage);
      }

      // Append contact as JSON string
      formDataToSend.append("contact", JSON.stringify({
        address: formData.contact.address || "",
        phone: formData.contact.phone || "",
        email: formData.contact.email || "",
        mapLocation: formData.contact.mapLocation || ""
      }));
      
      // Append social media as JSON string  
      formDataToSend.append("socialMedia", JSON.stringify({
        facebook: formData.socialMedia.facebook || "",
        instagram: formData.socialMedia.instagram || "",
        youtube: formData.socialMedia.youtube || "",
        linkedin: formData.socialMedia.linkedin || ""
      }));
      
      // Append payment gateway
      formDataToSend.append("paymentGateway", formData.paymentGateway || "");

      // Handle arrays
      if (Array.isArray(formData.programsOffered)) {
        formData.programsOffered.forEach((program, index) => {
          formDataToSend.append(`programsOffered[${index}]`, program);
        });
      }

      if (Array.isArray(formData.heroImages)) {
        formData.heroImages.forEach((image, index) => {
          formDataToSend.append(`heroImages[${index}]`, image);
        });
      }

      if (formData.testimonials && Array.isArray(formData.testimonials)) {
        formDataToSend.append('testimonials', JSON.stringify(formData.testimonials));
      }

      if (formData.FAQs && Array.isArray(formData.FAQs)) {
        formDataToSend.append('FAQs', JSON.stringify(formData.FAQs));
      }

      // Handle professionals data
      if (formData.professionals && Array.isArray(formData.professionals)) {
        // First, collect all new image files and their indices
        const newImageFiles = [];
        const imageIndices = [];
        
        // Debug log for incoming professionals data
        console.log('Raw professionals data:', formData.professionals);
        
        // Format professionals data for the backend
        const professionalsData = formData.professionals.map((prof, index) => {
          // Debug log for each professional
          console.log(`Processing professional ${index}:`, {
            name: prof.name,
            phone: prof.phone,
            hasPhone: !!prof.phone,
            phoneType: typeof prof.phone
          });

          // If this professional has a new image, add it to the arrays
          if (prof.newImageFile) {
            newImageFiles.push(prof.newImageFile);
            imageIndices.push(index);
          }
          
          const processedProf = {
            _id: prof._id, // Preserve the existing ID if any
            name: prof.name || '',
            role: prof.role || '',
            email: prof.email || '',
            phone: prof.phone || '',
            description: prof.description || '',
            image: prof.newImageFile ? '' : (prof.originalImage || prof.image || '')
          };

          // Debug log for processed professional
          console.log(`Processed professional ${index}:`, processedProf);
          
          return processedProf;
        });

        // Debug log for final professionals data
        console.log('Final professionals data to be sent:', professionalsData);

        // Remove any duplicate indices
        const uniqueIndices = [...new Set(imageIndices)];
        
        // Validate that we have the correct number of indices
        if (uniqueIndices.length !== newImageFiles.length) {
          console.error('Mismatch between image files and indices:', {
            filesCount: newImageFiles.length,
            indicesCount: uniqueIndices.length,
            fileDetails: newImageFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
            indices: uniqueIndices
          });
          throw new Error('Invalid image data: number of images does not match indices');
        }

        // Append professionals data
        formDataToSend.append('professionals', JSON.stringify(professionalsData));

        // Append image indices and files if there are new images
        if (uniqueIndices.length > 0) {
          formDataToSend.append('professionalImageIndices', uniqueIndices.join(','));
          newImageFiles.forEach((file, index) => {
            console.log(`Appending image ${index}:`, {
              name: file.name,
              size: file.size,
              type: file.type
            });
            formDataToSend.append('professionalImages', file);
          });
        }

        // Log the data being sent for debugging
        const debugData = {
          professionals: professionalsData.map(p => ({
            name: p.name,
            image: p.image,
            hasNewImage: !!p.newImageFile
          })),
          imageData: {
            files: newImageFiles.map(f => ({
              name: f.name,
              size: f.size,
              type: f.type
            })),
            indices: uniqueIndices
          }
        };
        console.log('Sending professionals data:', debugData);

        // Log the FormData contents
        console.log('FormData contents:', {
          professionals: JSON.stringify(professionalsData),
          imageIndices: uniqueIndices.join(',')
        });
      }

      const updated = await updateCompany(id, formDataToSend);
      if (!updated) throw new Error(t('company.errors.updateFailed'));

      toast.success(t('company.updateSuccess', 'Company updated successfully!'));
    } catch (err) {   
      console.error("Update error:", err);
      setError(err.message || "Failed to update company");
    } finally {
      setSubmitting(false);
    }
  };

  // Memoized handlers
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handlePreviousTab = useCallback(() => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  }, [activeTab, tabs]);

  const handleNextTab = useCallback(() => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  }, [activeTab, tabs]);

  // Memoized tab content
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'logo':
        return (
          <LogoUpload
            logo={formData.logo}
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
            error={error}
            setError={setError}
          />
        );
      case 'basic':
        return (
          <BasicInfo
            formData={formData}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            imagePreview={imagePreview}
          />
        );
      case 'contact':
        return (
          <ContactInfo
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 'social':
        return (
          <SocialMedia
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 'payment':
        return (
          <PaymentGateway
            formData={formData}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
          />
        );
      case 'privacy':
        return (
          <PrivacyPolicy
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 'terms':
        return (
          <TermsAndConditions
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      case 'faq':
        return (
          <FAQManager
            faqs={formData.FAQs}
            onFaqChange={handleFaqChange}
          />
        );
      case 'professionals':
        return (
          <ProfessionalsManager
            professionals={formData.professionals}
            onProfessionalsChange={handleProfessionalsChange}
          />
        );
      default:
        return null;
    }
  }, [activeTab, formData, logoPreview, error]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl min-h-screen pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('company.editTitle')}
          </h2>
          <button 
            onClick={() => navigate("/admin/companies")}
            className="btn btn-ghost hover:bg-primary/10 transition-colors duration-200"
          >
            {t('company.backToCompanies')}
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <div className="tabs tabs-boxed bg-base-200/50 backdrop-blur-sm p-1 mb-8 rounded-xl border border-primary/20">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => handleTabChange(tab.id)}
                />
              ))}
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="lg:hidden mb-8">
            <div className="dropdown dropdown-bottom w-full">
              <div tabIndex={0} role="button" className="btn btn-outline w-full justify-between bg-base-100/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 transition-colors duration-200">
                <div className="flex items-center gap-2">
                  {tabs.find(tab => tab.id === activeTab)?.icon}
                  <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
                </div>
                <FaChevronDown className="text-sm" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100/95 backdrop-blur-sm rounded-xl w-full mt-1 z-10 border border-primary/20">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-2 hover:bg-primary/5 transition-colors duration-200 ${
                        activeTab === tab.id ? 'bg-primary/10 text-primary' : ''
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-base-100/50 backdrop-blur-sm border border-primary/20 rounded-xl p-8 shadow-lg min-h-[400px]">
            <div className="flex items-center gap-2 mb-6">
              {tabs.find(tab => tab.id === activeTab)?.icon}
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
            </div>
            
            <div className="relative">
              {tabContent}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePreviousTab}
                className="btn btn-outline btn-sm hover:bg-primary/5 transition-colors duration-200"
                disabled={activeTab === tabs[0].id}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextTab}
                className="btn btn-outline btn-sm hover:bg-primary/5 transition-colors duration-200"
                disabled={activeTab === tabs[tabs.length - 1].id}
              >
                Next
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={() => navigate("/admin/companies")}
                className="btn btn-ghost btn-sm hover:bg-primary/10 transition-colors duration-200"
                disabled={submitting}
              >
                {t('company.cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm relative overflow-hidden group"
                disabled={submitting}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {t('company.updating')}
                    </>
                  ) : (
                    <>
                      <span className="group-hover:scale-105 transition-transform duration-200">
                        {t('company.updateCompany')}
                      </span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(CompanyEdit);