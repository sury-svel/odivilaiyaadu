import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Button } from "@/components/Button";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "@/i18n";
import { supabase } from "@/config/supabase";
import { colors } from "@/constants/colors";

export default function RecoveryScreen() {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();

  // Step 1: send recovery code
  const sendCode = async () => {
    if (!email) {
      Alert.alert(t("common.error"), t("auth.enterEmail"));
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      Alert.alert(t("common.error"), error.message);
    } else {
      setStep("confirm");
    }
  };

  // Step 2: verify code and reset password
  const confirmReset = async () => {
    if (newPassword.length < 6) {
      Alert.alert(t("common.error"), t("auth.passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t("common.error"), t("auth.passwordsDoNotMatch"));
      return;
    }

    setLoading(true);
    // verify the recovery code
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
    if (verifyError) {
      setLoading(false);
      Alert.alert(t("common.error"), verifyError.message);
      return;
    }
    // update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);
    if (updateError) {
      Alert.alert(t("common.error"), updateError.message);
    } else {
      Alert.alert(t("common.success"), t("auth.passwordResetSuccess"), [
        { text: t("common.ok"), onPress: () => router.replace("/auth/login") },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: step === "request" ? t("auth.forgotPassword") : t("auth.resetPassword") }}
      />

      {step === "request" ? (
        <>
          <Text style={styles.label}>{t("auth.email")}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Button
            title={t("auth.sendCode")}
            onPress={sendCode}
            isLoading={loading}
            style={styles.submitButton}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>{t("auth.recoveryCode")}</Text>
          <TextInput
            style={styles.input}
            value={token}
            onChangeText={setToken}
          />

          <Text style={styles.label}>{t("auth.newPassword")}</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>{t("auth.confirmPassword")}</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Button
            title={t("auth.resetPassword")}
            onPress={confirmReset}
            isLoading={loading}
            style={styles.submitButton}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  submitButton: {
    marginTop: 32,
  },
});
