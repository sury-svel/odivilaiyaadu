import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Switch
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { 
  User, 
  Mail, 
  Phone, 
  LogOut, 
  ChevronRight, 
  Globe, 
  Bell, 
  Moon, 
  Key, 
  Trash2,
  Shield
} from "lucide-react-native";
import { useTranslation } from "@/i18n";

export default function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, user, logout, authMode } = useAuthStore();
  const { t } = useTranslation();
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedInContainer}>
          <Text style={styles.notLoggedInTitle}>
            {t("profile.notLoggedIn.title")}
          </Text>
          <Text style={styles.notLoggedInText}>
            {t("profile.notLoggedIn.message")}
          </Text>
          <Button 
            title={t("common.login")} 
            onPress={() => router.push("/(modal)/auth/login")}
            style={styles.loginButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const handleLogout = () => {
    Alert.alert(
      t("profile.logoutConf.confirmTitle"),
      t("profile.logoutConf.confirmMessage"),
      [
        {
          text: t("common.cancel"),
          style: "cancel"
        },
        {
          text: t("common.logout"),
          style: "destructive",
          onPress: async () => {
            await logout();
            Alert.alert(t("auth.logoutSuccess"));
            router.push("/");
          }
        }
      ]
    );
  };
  
  // const handleDeleteAccount = () => {
  //   Alert.alert(
  //     t("profile.delete.confirmTitle"),
  //     t("profile.delete.confirmMessage"),
  //     [
  //       {
  //         text: t("common.cancel"),
  //         style: "cancel"
  //       },
  //       {
  //         text: t("common.delete"),
  //         style: "destructive",
  //         onPress: async () => {
  //           // Delete account logic would go here
  //           await logout();
  //           router.push("/");
  //         }
  //       }
  //     ]
  //   );
  // };
  
  const handleEditProfile = () => {
    // Navigate to edit profile screen TBD
 //   router.push("/profile/edit");
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color={colors.text.tertiary} />
            </View>
            {authMode === "supabase" && (
              <View style={styles.authBadge}>
                <Shield size={16} color="white" />
              </View>
            )}
          </View>

          <Text style={styles.userName}>{user?.name || user?.fullName}</Text>
          <Text style={styles.userRole}>{t(`roles.${user?.role}`)}</Text>

          <Button
            title={t("profile.editProfile")}
            variant="outline"
            onPress={handleEditProfile}
            style={styles.editButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.personalInfo")}</Text>

          <View style={styles.infoItem}>
            <Mail size={20} color={colors.text.tertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t("profile.fields.email")}</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Phone size={20} color={colors.text.tertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t("profile.fields.phone")}</Text>
              <Text style={styles.infoValue}>{user?.phone || "-"}</Text>
            </View>
          </View>

          {/* {authMode === "supabase" && (
            <View style={styles.authModeInfo}>
              <Shield size={16} color={colors.primary} />
              <Text style={styles.authModeText}>
                {t("profile.cognitoAuthenticated")}
              </Text>
            </View>
          )} */}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.preferences")}</Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Globe size={20} color={colors.text.tertiary} />
              <Text style={styles.preferenceLabel}>
                {t("profile.language")}
              </Text>
            </View>
            <LanguageToggle />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Bell size={20} color={colors.text.tertiary} />
              <Text style={styles.preferenceLabel}>
                {t("profile.notifications")}
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Moon size={20} color={colors.text.tertiary} />
              <Text style={styles.preferenceLabel}>{t("profile.theme")}</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={darkMode ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("profile.settings")}</Text>

          {authMode === "supabase" && (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/profile/change-pwd")}
            >
              <View style={styles.settingLeft}>
                <Key size={20} color={colors.text.tertiary} />
                <Text style={styles.settingLabel}>
                  {t("profile.changePassword")}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <LogOut size={20} color={colors.text.tertiary} />
              <Text style={styles.settingLabel}>{t("profile.logout")}</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          {/* <TouchableOpacity 
            style={styles.dangerItem}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color={colors.error} />
              <Text style={styles.dangerLabel}>
                {t("profile.deleteAccount")}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.error} />
          </TouchableOpacity> */}
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
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  authBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  editButton: {
    minWidth: 150,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text.primary,
  },
  authModeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  authModeText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: "500",
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  dangerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  dangerLabel: {
    fontSize: 16,
    color: colors.error,
    marginLeft: 12,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  notLoggedInTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  notLoggedInText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    minWidth: 200,
  },
});