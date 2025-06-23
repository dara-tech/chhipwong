import { useState, useEffect } from "react"
import { AlertCircle, User, Mail, Save, Lock, Settings, Shield, Eye, EyeOff, CheckCircle2, XCircle, Loader } from "lucide-react"
import { useTranslation } from 'react-i18next'
import useAuth from "../../../hooks/useAuth"
import ProfilePicture from "../../admin/profile/components/ProfilePicture"
import { motion, AnimatePresence } from "framer-motion"

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 pt-20">
      <div className="max-w-5xl mx-auto">
        {/* Title Skeleton */}
        <div className="h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl w-1/3 mb-8 animate-pulse"></div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:w-1/4">
            <div className="bg-base-100/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20">
              <ul className="menu menu-vertical w-full space-y-4">
                <li>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-primary/20 rounded-lg w-24 animate-pulse"></div>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/20 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-primary/20 rounded-lg w-24 animate-pulse"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Main content Skeleton */}
          <div className="lg:w-3/4">
            <div className="bg-base-100/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
              <div className="space-y-6">
                <div className="h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-pulse relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

const Profile = () => {
  const { t } = useTranslation();
  const { profile, loading, error, updateAdminProfile, getAdminProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: null
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState("/user.png");
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Fetch user profile on component mount
  useEffect(() => {
    getAdminProfile();
  }, [getAdminProfile]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        profilePic: profile.profilePic || null
      });
      setImagePreview(profile.profilePic || "/user.png");
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSaveError(t('profile.imageSizeError'));
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({
        ...prev,
        profilePic: file
      }));
      setSelectedImage(file);
      setSaveError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      
      if (selectedImage) {
        formDataToSend.append('profilePic', selectedImage);
      } else if (formData.profilePic instanceof File) {
        formDataToSend.append('profilePic', formData.profilePic);
      }

      const response = await updateAdminProfile(formDataToSend);
      
      if (response.success) {
        setSaveSuccess(t('profile.updateSuccess'));
        await getAdminProfile();
        setSelectedImage(null);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(response.message || t('profile.updateError'));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError(err.response?.data?.message || t('profile.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      const checks = {
        minLength: value.length >= PASSWORD_REQUIREMENTS.minLength,
        hasUpperCase: PASSWORD_REQUIREMENTS.hasUpperCase.test(value),
        hasLowerCase: PASSWORD_REQUIREMENTS.hasLowerCase.test(value),
        hasNumber: PASSWORD_REQUIREMENTS.hasNumber.test(value),
        hasSpecialChar: PASSWORD_REQUIREMENTS.hasSpecialChar.test(value)
      };

      setPasswordChecks(checks);

      // Calculate password strength
      const strength = Object.values(checks).reduce((acc, check) => acc + (check ? 20 : 0), 0);
      setPasswordStrength(strength);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    const { currentPassword, newPassword, confirmPassword } = passwordFormData;

    if (newPassword !== confirmPassword) {
      setSaveError(t('validation.passwordsDontMatch'));
      return;
    }

    if (passwordStrength < 60) {
      setSaveError(t('validation.passwordTooWeak'));
      return;
    }

    try {
      setIsPasswordUpdating(true);
      setSaveError('');
      
      const formData = new FormData();
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
      
      const response = await updateAdminProfile(formData);
      
      if (response.success) {
        // Reset form
        setPasswordFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setPasswordStrength(0);
        setPasswordChecks({
          minLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
          hasSpecialChar: false
        });
        
        // Refresh profile data
        await getAdminProfile();
        
        setSaveSuccess(t('profile.passwordChangedSuccess'));
      } else {
        setSaveError(response.message || t('profile.passwordChangeError'));
      }
    } catch (error) {
      setSaveError(error.response?.data?.message || t('profile.passwordChangeError'));
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const getStrengthColor = (strength) => {
    if (strength >= 80) return 'bg-success';
    if (strength >= 60) return 'bg-warning';
    return 'bg-error';
  };

  if (loading && !profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen pt-20">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent p-2"
        >
          {t('profile.title')}
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-error mb-6 shadow-lg"
            >
              <AlertCircle className="w-6 h-6" />
              <span>{error}</span>
            </motion.div>
          )}

          {saveError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-error mb-6 shadow-lg"
            >
              <AlertCircle className="w-6 h-6" />
              <span>{saveError}</span>
            </motion.div>
          )}

          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="alert alert-success mb-6 shadow-lg"
            >
              <span>{saveSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-base-100/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20"
            >
              <ul className="menu menu-vertical w-full">
                <li className={activeTab === "general" ? "bordered" : ""}>
                  <button 
                    className="flex items-center gap-3 text-base font-medium hover:bg-primary/10 transition-colors duration-300" 
                    onClick={() => setActiveTab("general")}
                  >
                    <User className="w-5 h-5" />
                    {t('profile.generalInfo')}
                  </button>
                </li>
                <li className={activeTab === "security" ? "bordered" : ""}>
                  <button 
                    className="flex items-center gap-3 text-base font-medium hover:bg-primary/10 transition-colors duration-300" 
                    onClick={() => setActiveTab("security")}
                  >
                    <Shield className="w-5 h-5" />
                    {t('profile.security')}
                  </button>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Main content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-3/4"
          >
            <div className="bg-base-100/50 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
              {activeTab === "general" && (
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <div className="flex flex-col items-center">
                      <ProfilePicture
                        imagePreview={imagePreview}
                        handleFileChange={handleFileChange}
                        error={saveError}
                        setError={setSaveError}
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('profile.name')}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('profile.namePlaceholder')}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-5 h-5" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('profile.email')}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('profile.emailPlaceholder')}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-5 h-5" />
                    </div>
                  </div>

                  <div className="form-control mt-8">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {t('profile.saveChanges')}
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}

              {activeTab === "security" && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handlePasswordSubmit}
                  className="space-y-6"
                >
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('profile.currentPassword')}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.currentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordFormData.currentPassword}
                        onChange={handlePasswordChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('profile.currentPasswordPlaceholder')}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, currentPassword: !prev.currentPassword }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/50 hover:text-primary"
                      >
                        {showPassword.currentPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('profile.newPassword')}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.newPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordFormData.newPassword}
                        onChange={handlePasswordChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('profile.newPasswordPlaceholder')}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/50 hover:text-primary"
                      >
                        {showPassword.newPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">{t('profile.confirmPassword')}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordFormData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input input-bordered w-full pl-10"
                        placeholder={t('profile.confirmPasswordPlaceholder')}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/50 hover:text-primary"
                      >
                        {showPassword.confirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordFormData.newPassword && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {passwordStrength < 40 && t('profile.passwordStrength.weak')}
                          {passwordStrength >= 40 && passwordStrength < 80 && t('profile.passwordStrength.medium')}
                          {passwordStrength >= 80 && t('profile.passwordStrength.strong')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">{t('profile.passwordRequirements')}</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            {passwordChecks.minLength ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-error" />
                            )}
                            <span>{t('profile.passwordRequirements.minLength')}</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            {passwordChecks.hasUpperCase ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-error" />
                            )}
                            <span>{t('profile.passwordRequirements.uppercase')}</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            {passwordChecks.hasLowerCase ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-error" />
                            )}
                            <span>{t('profile.passwordRequirements.lowercase')}</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            {passwordChecks.hasNumber ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-error" />
                            )}
                            <span>{t('profile.passwordRequirements.number')}</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            {passwordChecks.hasSpecialChar ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <XCircle className="w-4 h-4 text-error" />
                            )}
                            <span>{t('profile.passwordRequirements.special')}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="form-control mt-8">
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isPasswordUpdating}
                    >
                      {isPasswordUpdating ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          {t('profile.updatePassword')}
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
