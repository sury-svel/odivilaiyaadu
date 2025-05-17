import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/i18n';

export const LanguageToggle = () => {
  const { language, setLanguage } = useAuthStore();
  const { changeLanguage } = useTranslation();

  const handleLanguageChange = (newLanguage: 'en' | 'ta') => {
    // Call both functions to ensure synchronization
    setLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          language === 'en' ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => handleLanguageChange('en')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            language === 'en' ? styles.activeText : styles.inactiveText,
          ]}
        >
          EN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          language === 'ta' ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => handleLanguageChange('ta')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            language === 'ta' ? styles.activeText : styles.inactiveText,
          ]}
        >
          தமிழ்
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: colors.text.secondary,
  },
});