import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal,
  ScrollView, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { Mail, Lock, User } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { registerForPushNotificationsAsync } from '@/utils/notification';
import { supabase } from "@/config/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError, registerPushToken } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [processingNotif, setProcessingNotif] = useState(false);
  const { t } = useTranslation(); // Use the custom hook to ensure re-renders
  
  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert(
        t("login.error.loginFailedTitle"),
        !email
          ? t("login.error.emailRequired")
          : t("login.error.passwordRequired")
      );
      return;
    }

    const success = await login(email, password);

    if (!success) {
      if (error) {
        Alert.alert(t("login.error.loginFailedTitle"), error);
        clearError();
      }
      return;
    }

    // 3. Fetch current user and their push_token
    const user = useAuthStore.getState().user!;
    const { data: profile, error: profileErr } = await supabase
      .from("user_profiles")
      .select("push_token")
      .eq("id", user.id)
      .single();

    if (profileErr) {
      console.error("Could not fetch user profile:", profileErr);
      // fallback to prompting in case of error
      setShowNotifPrompt(true);
      return;
    }

    // 4. Conditionally prompt or skip
    if (profile.push_token) {
      // already have a token → just go home
      router.push("/");
    } else {
      // no token yet → ask permission
      setShowNotifPrompt(true);
    }
  };

  const onNoThanks = () => {
    setShowNotifPrompt(false);
    router.push("/");
  };

  const onAllow = async () => {
    setProcessingNotif(true);
    try {
      const pushToken = await registerForPushNotificationsAsync();
      console.log("Got push token:", pushToken);
      if (pushToken) {
        console.log("registerPushToken:", pushToken);
        const saved = await registerPushToken(pushToken);
        console.log("registerPushToken result:", saved);
        if (!saved) {
          console.error("Failed to save push token to database.");
        }
      }
    } catch (e) {
      console.error("Error in notification flow:", e);
    } finally {
      setProcessingNotif(false);
      setShowNotifPrompt(false);
      router.push("/");
    }
  };




  const handleRegister = () => {
    router.push("/(modal)/auth/register");
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("login.title")}</Text>
          <Text style={styles.subtitle}>{t("login.subtitle")}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label={t("login.email")}
            placeholder={t("login.emailPlaceholder")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.text.secondary} />}
          />

          <TextInput
            label={t("login.password")}
            placeholder={t("login.passwordPlaceholder")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={colors.text.secondary} />}
          />



          <Button
            title={t("auth.login")}
            onPress={handleLogin}
            isLoading={isLoading}
            style={styles.loginButton}
          />


          <Modal
            visible={showNotifPrompt}
            transparent
            animationType="fade"
            onRequestClose={onNoThanks}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Stay Updated!</Text>
                <Text style={styles.modalBody}>
                  We’ll send you notifications when your child’s game starts and
                  when scores are published.
                </Text>
                {processingNotif ? (
                  <ActivityIndicator />
                ) : (
                  <View style={styles.modalButtons}>
                    <Text style={styles.modalButton} onPress={onNoThanks}>
                      No Thanks
                    </Text>
                    <Text style={styles.modalButton} onPress={onAllow}>
                      Allow
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.registerLink}
            activeOpacity={0.7}
          >
            <Text style={styles.registerText}>
              {t("login.noAccount")}{" "}
              <Text style={styles.registerTextBold}>
                {t("common.register")}
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/auth/recovery")}  
            style={styles.registerLink}
            activeOpacity={0.7}
          >
            <Text style={styles.registerText}>
              {t("login.forgotPassword")}{" "}
              <Text style={styles.registerTextBold}>
                {t("login.useRecoveryLink")}  
              </Text>
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
  loginButton: {
    marginTop: 16,
  },
  registerLink: {
    marginTop: 16,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  registerTextBold: {
    fontWeight: "700",
    color: colors.primary,
  },
  demoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  demoNote: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  demoButtons: {
    gap: 12,
  },
  demoButton: {
    marginBottom: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalBody: { fontSize: 14, marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: { fontSize: 16, color: colors.primary },
});
