// app/profile/change-pwd.tsx

import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Button } from "@/components/Button";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "@/i18n";
import { supabase } from "@/config/supabase";
import { colors } from "@/constants/colors";

export default function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert(t("common.error"), t("auth.passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(t("common.error"), t("auth.passwordsDoNotMatch"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setLoading(false);

    if (error) {
      console.error("Error updating password:", error);
      Alert.alert(t("common.error"), error.message);
    } else {
      Alert.alert(t("common.success"), t("auth.passwordUpdated"), [
        {
          text: t("common.ok"),
          onPress: () => router.back(),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t("profile.changePassword") }} />

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
        title={t("profile.changePassword")}
        onPress={handleChangePassword}
        isLoading={loading}
        style={styles.submitButton}
      />
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
