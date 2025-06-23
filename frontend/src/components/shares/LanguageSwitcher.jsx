import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { FaGlobeAmericas, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'km', name: t('khmer'), flag: '🇰🇭' }
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm rounded-btn flex items-center gap-2 hover:bg-base-200 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isOpen}
        aria-label={t('language')}
      >
        <FaGlobeAmericas className="w-4 h-4" />
        <span className="font-medium">{currentLang.toUpperCase()}</span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-[100] mt-2 w-56 origin-top-right rounded-md bg-base-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu-button"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <motion.li 
                  key={lang.code}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                >
                  <button 
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm ${
                      currentLang === lang.code ? 'bg-base-200 font-medium text-primary' : 'text-base-content'
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    {currentLang === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <FaCheck className="text-primary" />
                      </motion.div>
                    )}
                  </button>
                </motion.li>
              ))}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
