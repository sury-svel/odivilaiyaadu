import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "@/i18n";
import { 
  Home, 
  Calendar, 
  User, 
  Users, 
  Info, 
  Settings
} from "lucide-react-native";

export default function TabLayout() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  // Determine which tabs to show based on user role
  const isParent = user?.role === "parent";
  const isVolunteer = user?.role === "volunteer";
  // const isAdmin = user?.role === "admin";
  
    // Always list your screens here, then conditionally hide their buttons
    return (
      <Tabs
      screenOptions={({
        route,
      }: {
        route: { name: string }; }) => ({
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: "600",
          },
          headerRight: () => (
            <View style={styles.headerRight}>
              <LanguageToggle />
            </View>
          ),
          // hide tabs you don’t want
          tabBarButton:
          (route.name === "parent"    && !isParent)   ||
          (route.name === "volunteer" && !isVolunteer)
          ? () => null          
              : undefined,
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.home"),
            tabBarIcon: ({ color, size, }: { color: string; size: number }) => (
              <Home size={size} color={color} />
            ) ,
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: t("tabs.events"),
            tabBarIcon: ({ color, size, }: { color: string; size: number }) => (
              <Calendar size={size} color={color} />
            ) ,
          }}
        />
        <Tabs.Screen
          name="parent"
          options={{
            title: t("tabs.parent"),
            tabBarIcon: ({ color, size, }: { color: string; size: number }) => (
              <User size={size} color={color} />
            ) ,
          }}
        />
        <Tabs.Screen
          name="volunteer"
          options={{
            title: t("tabs.volunteer"),
            tabBarIcon: ({ color, size, }: { color: string; size: number }) => (
              <User size={size} color={color} />
            ) ,
          }}
        />
        {/* <Tabs.Screen
          name="admin"
          options={{
            title: t("tabs.admin"),
            tabBarIcon: ({ color, size, }: { color: string; size: number }) => (
              <Users size={size} color={color} />
            ) ,
          }}
        /> */}
        <Tabs.Screen
          name="info"
          options={{
            title: t("tabs.info"),
            tabBarIcon: ({ color, size, }: { color: string; size: number }) => (
              <Info size={size} color={color} />
            ) ,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("tabs.profile"),
            tabBarIcon: ({ color, size, }: { color: string; size: number }) => (
              <Settings size={size} color={color} />
            ) ,
          }}
        />
      </Tabs>
    );
  }
  
  const styles = StyleSheet.create({
    headerRight: {
      marginRight: 16,
    },
  });