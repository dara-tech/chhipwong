import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaMoneyBillWave } from 'react-icons/fa';

const PaymentLinks = ({ isMobile, setIsMenuOpen }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const paymentLink = {
    to: '/payments',
    label: t('paymentViewer.title'),
    icon: <FaMoneyBillWave />,
    activeIcon: <FaMoneyBillWave />,
  };

  const isActive = location.pathname.startsWith(paymentLink.to);

  if (isMobile) {
    return (
      <Link
        to={paymentLink.to}
        onClick={() => setIsMenuOpen && setIsMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
          isActive
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
          {isActive ? paymentLink.activeIcon : paymentLink.icon}
        </span>
        {paymentLink.label}
      </Link>
    );
  }

  return (
    <Link
      to={paymentLink.to}
      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {isActive ? paymentLink.activeIcon : paymentLink.icon}
      </span>
      {paymentLink.label}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      )}
    </Link>
  );
};

export default PaymentLinks;
