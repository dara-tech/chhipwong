import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrash, FaQuestionCircle, FaCommentAlt, FaList } from 'react-icons/fa';

const FAQManager = ({ faqs, onFaqChange, loading = false }) => {
  const { t } = useTranslation();

  const handleAddFaq = () => {
    onFaqChange([...(faqs || []), { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    onFaqChange(newFaqs);
  };

  const handleFaqInputChange = (index, field, value) => {
    const newFaqs = faqs.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq
    );
    onFaqChange(newFaqs);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-8 bg-base-300 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-base-300 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="w-32 h-10 bg-base-300 animate-pulse rounded-md"></div>
        </div>
        <div className="space-y-6">
          {[1, 2].map((item) => (
            <div key={item} className="p-6 border border-base-300 rounded-xl bg-base-200/50 backdrop-blur-sm relative shadow-lg">
              <div className="space-y-4">
                <div className="form-control">
                  <div className="w-32 h-5 bg-base-300 animate-pulse rounded mb-2"></div>
                  <div className="w-full h-10 bg-base-300 animate-pulse rounded"></div>
                </div>
                <div className="form-control">
                  <div className="w-32 h-5 bg-base-300 animate-pulse rounded mb-2"></div>
                  <div className="w-full h-24 bg-base-300 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('company.faqs.title', 'Frequently Asked Questions')}
          </h3>
          <p className="text-sm text-base-content/60">
            {t('company.faqs.description', 'Manage your company\'s frequently asked questions')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddFaq}
          className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          {t('company.faqs.add')}
        </button>
      </div>

      <div className="space-y-6">
        {(faqs || []).map((faq, index) => (
          <div
            key={index}
            className="p-6 border border-base-300 rounded-xl bg-base-200/50 backdrop-blur-sm relative shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FaQuestionCircle className="text-primary" />
                    {t('company.faqs.question')} #{index + 1}
                  </span>
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqInputChange(index, 'question', e.target.value)
                  }
                  className="input input-bordered w-full focus:border-none focus:ring-0 focus:outline-primary transition-all duration-300"
                  placeholder={t('company.faqs.questionPlaceholder')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FaCommentAlt className="text-primary" />
                    {t('company.faqs.answer')} #{index + 1}
                  </span>
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqInputChange(index, 'answer', e.target.value)
                  }
                  className="textarea textarea-bordered w-full h-32 focus:border-none focus:ring-0 focus:outline-primary transition-all duration-300"
                  placeholder={t('company.faqs.answerPlaceholder')}
                ></textarea>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveFaq(index)}
              className="btn btn-ghost btn-sm btn-circle absolute top-4 right-4 hover:bg-error/10 transition-colors duration-300"
              aria-label={t('company.faqs.remove')}
            >
              <FaTrash className="text-error" />
            </button>
          </div>
        ))}
      </div>

      {(!faqs || faqs.length === 0) && (
        <div className="text-center py-12 bg-base-200/50 rounded-xl border border-dashed border-base-300">
          <FaList className="mx-auto text-4xl text-base-content/30 mb-4" />
          <p className="text-base-content/60 text-lg">{t('company.faqs.noFaqs')}</p>
          <button
            type="button"
            onClick={handleAddFaq}
            className="btn btn-primary btn-sm gap-2 mt-4"
          >
            <FaPlus />
            {t('company.faqs.addFirstFaq')}
          </button>
        </div>
      )}
    </div>
  );
};

// ✅ PropTypes for better validation
FAQManager.propTypes = {
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired,
    })
  ),
  onFaqChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default FAQManager;
