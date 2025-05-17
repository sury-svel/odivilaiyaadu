import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useChildrenStore } from "@/store/children-store";
import { colors } from "@/constants/colors";
import { ChildCard } from "@/components/ChildCard";
import { Button } from "@/components/Button";
import { UserPlus } from "lucide-react-native";
import { useTranslation } from "@/i18n";

export default function ParentScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { children, fetchChildren } = useChildrenStore();
  const { t } = useTranslation();
  
  // console.log("Parent Profile Page Is user authenticated? " + isAuthenticated);
  // console.log("Parent Profile Page User role ? " + user?.role )

  React.useEffect(() => {
    if (isAuthenticated && user?.role === "parent") {
      fetchChildren();
    }
  }, [isAuthenticated, user, fetchChildren]);
  
  const handleAddChild = () => {
    router.push({
      pathname: '/parent/add',   // matches add.tsx
    });
  };
  
  // const handleEditChild = (childId: string) => {
  //   router.push(`/parent/${childId}/edit`);
  // };

  const handleViewChild = (childId: string) => {
    router.push(`/parent/${childId}`);
  };
  
  if (!isAuthenticated || user?.role !== "parent") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedTitle}>
            {t("profile.notLoggedIn.title")}
          </Text>
          <Text style={styles.unauthorizedText}>
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
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("children.title")}</Text>
        <Button
          title={t("children.add")}
          onPress={handleAddChild}
          size="small"
          icon={<UserPlus size={16} color="white" />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {children.length > 0 ? (
          children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              // onEdit={() => handleEditChild(child.id)}
              onPress={() => handleViewChild(child.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>{t("children.noChildren")}</Text>
            <Text style={styles.emptyText}>{t("children.addPrompt")}</Text>
            <Button
              title={t("children.add")}
              onPress={handleAddChild}
              style={styles.addButton}
              icon={<UserPlus size={16} color="white" />}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
  addButton: {
    minWidth: 200,
  },
  unauthorizedContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  unauthorizedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  unauthorizedText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    minWidth: 200,
  },
});