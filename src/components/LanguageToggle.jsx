import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      // ELIMINAMOS 'fixed top-4 right-4'. Ahora es solo un botón bonito.
      className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-all z-50"
    >
      <Globe className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium text-gray-700">
        {t('change_lang')}
      </span>
    </button>
  );
};

export default LanguageToggle;