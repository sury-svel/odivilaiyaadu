import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import { languages, defaultLanguage } from "@/constants/languages";

// Import translations
import en from "./translations/en.json";
import ta from "./translations/ta.json";

// Create i18n instance
const i18n = new I18n({
  en,
  ta,
});

// Set default locale
i18n.defaultLocale = defaultLanguage;
i18n.locale = defaultLanguage; // Default to English
i18n.enableFallback = true;

// Direct translation function for use outside of React components
export const t = (key: string, options?: Record<string, any>): string => {
  try {
    const result = i18n.t(key, options);
    
    // Check if the result is an object (nested translations)
    if (typeof result === "object" && result !== null) {
      console.warn(`Translation key "${key}" returned an object instead of a string`);
      return key; // Return the key as fallback
    }
    
    return result;
  } catch (error) {
    console.warn(`Translation error for key "${key}":`, error);
    return key;
  }
};

// Custom hook for translations
export const useTranslation = () => {
  const [language, setLanguage] = useState<string>(i18n.locale);

  useEffect(() => {
    // Load saved language from AsyncStorage
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        if (savedLanguage) {
          i18n.locale = savedLanguage;
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Failed to load language:", error);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = useCallback((lang: string) => {
    // Immediately update i18n locale
    i18n.locale = lang;
    setLanguage(lang);
    
    // Save to AsyncStorage in the background
    AsyncStorage.setItem("language", lang).catch(error => {
      console.error("Failed to save language:", error);
    });
  }, []);

  return {
    t: (key: string, options?: Record<string, any>): string => {
      try {
        const result = i18n.t(key, options);
        
        // Check if the result is an object (nested translations)
        if (typeof result === "object" && result !== null) {
          console.warn(`Translation key "${key}" returned an object instead of a string`);
          return key; // Return the key as fallback
        }
        
        return result;
      } catch (error) {
        console.warn(`Translation error for key "${key}":`, error);
        return key;
      }
    },
    language,
    changeLanguage,
    i18n,
  };
};

export default i18n;