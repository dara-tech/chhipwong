import React, { useEffect, useState } from 'react'
import useCompanies from '../../hooks/useCompanies'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaFileAlt, FaHome } from 'react-icons/fa'
import { motion } from 'framer-motion'

const PolicyPrivacy = () => {
  const { t } = useTranslation()
  const { companies, getCompanies } = useCompanies()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      await getCompanies()
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 py-2 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12 pt-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-primary/10 p-3 rounded-2xl"
          >
            <FaFileAlt className="text-primary text-2xl" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-bold text-base-content"
          >
            {t('company.privacyPolicy')}
          </motion.h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-base-200/50 backdrop-blur-sm rounded-2xl shadow-xl border border-base-300 p-8"
        >
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: item * 0.1 }}
                >
                  <div className="h-5 bg-base-300 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-base-300 rounded-lg w-full"></div>
                </motion.div>
              ))}
            </div>
          ) : companies?.[0]?.privacyPolicy ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg max-w-none prose-headings:text-base-content prose-p:text-base-content/80 prose-strong:text-primary prose-a:text-primary hover:prose-a:text-primary-focus"
              dangerouslySetInnerHTML={{ __html: companies[0].privacyPolicy }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-base-300/20 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
              >
                <FaFileAlt className="text-base-300 text-5xl" />
              </motion.div>
              <p className="text-xl text-base-content/70">{t('company.privacyPolicyPlaceholder')}</p>
            </motion.div>
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-primary hover:text-primary-focus transition-colors font-medium group"
          >
            <motion.div
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors"
            >
              <FaHome className="text-xl" />
            </motion.div>
            <span className="text-lg">{t('home')}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default PolicyPrivacy
