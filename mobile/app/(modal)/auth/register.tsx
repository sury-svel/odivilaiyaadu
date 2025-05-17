import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { CheckBox } from "@/components/CheckBox";
import { Mail, Lock, User, Phone, MapPin } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { Language } from "@/constants/languages";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"parent" | "volunteer">("parent");
  const [agreedToSafety, setAgreedToSafety] = useState(false);
  const [showWaiver, setShowWaiver] = useState(false);
  // const [useCognito, setUseCognito] = useState(false);
  const { t } = useTranslation(); // Use the custom hook to ensure re-renders
  
  const handleRegister = async () => {
    // Validate inputs
    if (!fullName) {
      Alert.alert(t("register.error.title"), t("register.error.fullNameRequired"));
      return;
    }
    
    if (!email) {
      Alert.alert(t("register.error.title"), t("register.error.emailRequired"));
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert(t("register.error.title"), t("register.error.emailRequired"));
      return;
    }

    
    if (!phone) {
      Alert.alert(t("register.error.title"), t("register.error.phoneRequired"));
      return;
    }
    
    if (!address) {
      Alert.alert(t("register.error.title"), t("register.error.addressRequired"));
      return;
    }
    
    if (!password) {
      Alert.alert(t("register.error.title"), t("register.error.passwordRequired"));
      return;
    }
    
    if (password.length < 6) {
      Alert.alert(t("register.error.title"), t("register.error.passwordLength"));
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert(t("register.error.title"), t("register.error.passwordsDoNotMatch"));
      return;
    }
    
    if (!agreedToSafety) {
      Alert.alert(t("register.error.title"), t("register.error.safetyAgreementRequired"));
      return;
    }
    
    const userData = {
      fullName,
      email,
      phone,
      address,
      role,
      agreedToSafety,
      language: "en" as Language // Explicitly type as Language
    };
    
    console.log("Registering with userData:", userData);
    
    let success = await register(userData, password);

    if (success) {
      Alert.alert(
        t("register.success.title"),  t("register.success.verifyEmail"),    [
          {
            text: "OK",
            onPress: () => router.push("/(modal)/auth/login")
          }]
      );
    } else if (error) {
      Alert.alert(t("register.error.title"), error);
      clearError();
    }
  };
  
  const handleLogin = () => {
    router.push("/(modal)/auth/login");
  };
  
  const toggleWaiver = () => {
    setShowWaiver(!showWaiver);
  };
  
  const toggleSafetyAgreement = () => {
    setAgreedToSafety(!agreedToSafety);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("register.title")}</Text>
          <Text style={styles.subtitle}>{t("register.subtitle")}</Text>
        </View>
        
        <View style={styles.form}>
          <TextInput
            label={t("register.fields.fullName")}
            placeholder={t("register.placeholders.fullName")}
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<User size={20} color={colors.text.secondary} />}
          />
          
          <TextInput
            label={t("register.fields.email")}
            placeholder={t("register.placeholders.email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.text.secondary} />}
          />
          
          <TextInput
            label={t("register.fields.phone")}
            placeholder={t("register.placeholders.phone")}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={colors.text.secondary} />}
          />
          
          <TextInput
            label={t("register.fields.address")}
            placeholder={t("register.placeholders.address")}
            value={address}
            onChangeText={setAddress}
            leftIcon={<MapPin size={20} color={colors.text.secondary} />}
          />
          
          <TextInput
            label={t("register.fields.password")}
            placeholder={t("register.placeholders.password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={colors.text.secondary} />}
          />
          
          <TextInput
            label={t("register.fields.confirmPassword")}
            placeholder={t("register.placeholders.confirmPassword")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={colors.text.secondary} />}
          />
          
          <Text style={styles.roleLabel}>{t("register.whoAreYou")}</Text>
          <View style={styles.roleButtons}>
            <Button
              title={t("roles.parent")}
              onPress={() => setRole("parent")}
              variant={role === "parent" ? "primary" : "outline"}
              style={styles.roleButton}
            />
            <Button
              title={t("roles.volunteer")}
              onPress={() => setRole("volunteer")}
              variant={role === "volunteer" ? "primary" : "outline"}
              style={styles.roleButton}
            />
          </View>
          
          {/* <TouchableOpacity 
            onPress={() => setUseCognito(!useCognito)}
            style={styles.cognitoToggle}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, useCognito && styles.checkboxChecked]}>
              {useCognito && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.cognitoText}>Use email authentication</Text>
          </TouchableOpacity> */}
          
          <View style={styles.waiverContainer}>
            <View style={styles.waiverHeader}>
              <Text style={styles.waiverTitle}>{t("register.waiver.title")}</Text>
              <TouchableOpacity onPress={toggleWaiver} activeOpacity={0.7}>
                <Text style={styles.waiverToggle}>
                  {showWaiver ? t("register.waiver.hide") : t("register.waiver.show")}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showWaiver && (
              <Text style={styles.waiverText}>
                In consideration of being permitted to participate in AmChaTS/APS Odi Vilayaadu Kids event, I hereby waive, release and discharge any and all claims for damages for personal injury, death, or property damage which I may have, or which hereafter accrue to me, against AmChaTS and APS as a result of my participation in the event. This release is intended to discharge the organizers, volunteers, and other entities from and against any and all liability arising out of or connected in any way with my participation in the event, even though that liability may arise out of the negligence or carelessness on the part of persons or entities mentioned above. I understand that this event involves an element of risk and danger of accidents, and knowing those risks, I hereby assume those risks. I SIGN IT OF MY OWN FREE WILL.
              </Text>
            )}
            
            <CheckBox
              label={t("register.waiver.agree")}
              checked={agreedToSafety}
              onPress={toggleSafetyAgreement}
            />
          </View>
          
          <Button
            title={t("register.registerButton")}
            onPress={handleRegister}
            isLoading={isLoading}
            style={styles.registerButton}
          />
          
          <TouchableOpacity 
            onPress={handleLogin}
            style={styles.loginLink}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>
              {t("register.alreadyHaveAccount")} <Text style={styles.loginTextBold}>{t("common.login")}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  form: {
    marginBottom: 32,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
  },
  waiverContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  waiverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  waiverTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  waiverToggle: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  waiverText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  registerButton: {
    marginTop: 16,
  },
  loginLink: {
    marginTop: 16,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  loginTextBold: {
    fontWeight: "700",
    color: colors.primary,
  },
  cognitoToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: "white",
    fontSize: 14,
  },
  cognitoText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});