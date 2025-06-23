import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCompanies from '../../hooks/useCompanies';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const FaqPage = () => {
  const { id } = useParams();
  const { getCompanies, loading, error } = useCompanies();
  const [company, setCompany] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCompany = async () => {
      const companies = await getCompanies();
      if (companies && companies.length > 0) {
        setCompany(companies[0]);
      }
    };
    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-base-300 animate-pulse shadow-lg"></div>
            <div className="h-10 w-64 mx-auto bg-base-300 animate-pulse rounded-lg"></div>
            <div className="h-6 w-40 mx-auto mt-4 bg-base-300 animate-pulse rounded-lg"></div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border border-base-300 rounded-2xl bg-base-200/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="px-8 py-6">
                  <div className="h-8 bg-base-300 animate-pulse rounded-lg w-4/5"></div>
                </div>
                <div className="px-8 pb-6">
                  <div className="h-5 bg-base-300 animate-pulse rounded-lg w-full mb-3"></div>
                  <div className="h-5 bg-base-300 animate-pulse rounded-lg w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-base-200/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-bold text-error mb-4">{t('company.errors.fetchFailed')}</h2>
          <p className="text-lg text-base-content/70 max-w-md">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {company?.logo && (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src={company.logo}
              alt={`${company.name} Logo`}
              className="w-28 h-28 mx-auto mb-6 rounded-2xl object-cover shadow-xl hover:shadow-2xl transition-all duration-300"
            />
          )}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold text-base-content mb-4"
          >
            {company.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-base-content/70"
          >
            {t('company.tabs.faq')}
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          {company?.FAQs?.length > 0 ? (
            company.FAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className={`group border border-base-300 rounded-2xl bg-base-200/50 backdrop-blur-sm transition-all duration-300 ${
                    openIndex === index ? 'shadow-xl' : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full text-left px-8 py-6 text-xl font-semibold text-base-content group-hover:text-primary transition-colors duration-300 flex justify-between items-center"
                  >
                    <span>{faq.question}</span>
                    <motion.span
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl"
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-6 text-lg text-base-content/80 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-base-200/50 backdrop-blur-sm rounded-2xl shadow-lg"
            >
              <p className="text-xl text-base-content/70">{t('company.faqs.noFaqs')}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
