import { ReactNode } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './translations';

type I18nProviderProps = {
  children: ReactNode;
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export const useI18n = () => {
  const { t, i18n: i18nextInstance } = useTranslation();

  return {
    t,
    lang: i18nextInstance.language,
  };
};

