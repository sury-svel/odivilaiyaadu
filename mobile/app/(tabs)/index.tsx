import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { colors } from "@/constants/colors";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { supabase } from "@/config/supabase";

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { events: eventsDict, fetchEvents } = useEventsStore();
  const [logoLoaded, setLogoLoaded] = useState(true);
  const { t } = useTranslation();
  
    /* convert Record → Event[] */
  const events = React.useMemo(    () => Object.values(eventsDict),    [eventsDict]  );

  useEffect(() => {    fetchEvents();  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const activeEvents = events.filter(event => event.status === "active");
  const upcomingEvents = events.filter(event => event.status === "upcoming");
  
  const handleLoginPress = () => {
    router.push("/(modal)/auth/login");
  };
  
  const handleRegisterPress = () => {
    router.push("/(modal)/auth/register");
  };
  
  const handleViewAllEvents = () => {
    router.push("/events");
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  // console.log("Is user authenticated? " + isAuthenticated);
  // console.log("User role ? " + user?.role )
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="always">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/logos/amchatslogo.png" }}
              style={styles.logo}
            />
            <Image
              source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/logos/apslogo.png" }}
              style={styles.logo}
            />
          </View>
          
          {logoLoaded ? (
            <Image
              source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/logos/odivilayaadu1.png" }}
              style={styles.titleLogo}
              onError={() => setLogoLoaded(false)}
              resizeMode="contain"
            />
          ) : (
            <>
              <Text style={styles.title}>
                {t("home.title")}
              </Text>
              <Text style={styles.subtitle}>
                {t("home.subtitle")}
              </Text>
            </>
          )}
        </View>
        
        {!isAuthenticated && (
          <View style={styles.authContainer}>
            <Text style={styles.authText}>
              {t("home.loginPrompt")}
            </Text>
            <View style={styles.authButtons}>
              <Button 
                title={t("common.login")} 
                onPress={handleLoginPress}
                style={styles.authButton}
              />
              <Button 
                title={t("common.register")} 
                onPress={handleRegisterPress}
                variant="outline"
                style={styles.authButton}
              />
            </View>
          </View>
        )}
        
        {isAuthenticated && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              {t("home.welcome", { name: user?.fullName || "" })}
            </Text>
            <Text style={styles.roleText}>
              {t(`roles.${user?.role || "user"}`)}
            </Text>
          </View>
        )}
        
        {activeEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("events.current")}
            </Text>
            {activeEvents.map(event => (
              <EventCard key={event.id} event={event} compact={false}  onPress={() => handleEventPress(event.id)}/>
            ))}
          </View>
        )}
        
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("events.upcoming")}
            </Text>
            {upcomingEvents.slice(0, 2).map(event => (
              <EventCard key={event.id} event={event} compact={false}  onPress={() => handleEventPress(event.id)}/>
            ))}
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.viewAllButton} 
          onPress={handleViewAllEvents}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>
            {t("events.viewAll")}
          </Text>
          <ArrowRight size={16} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            {t("home.aboutUs")}
          </Text>
          <Text style={styles.infoText}>
            {t("home.aboutDescription")}
          </Text>
          <View style={styles.infoButtons}>
            <Button 
              title="AmChaTS" 
              onPress={() => router.push("/info/amchats")}
              variant="outline"
              style={styles.infoButton}
            />
            <Button 
              title="APS" 
              onPress={() => router.push("/info/aps")}
              variant="outline"
              style={styles.infoButton}
            />
          </View>
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
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    width: 50,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    gap: 26,
    marginBottom: 5,
    borderRadius: 12,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  titleLogo: {
    width: 450,
    height: 150,
  },  
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  authContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  authText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
    textAlign: "center",
  },
  authButtons: {
    flexDirection: "row",
    gap: 12,
  },
  authButton: {
    flex: 1,
  },
  welcomeContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    gap: 8,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoButtons: {
    flexDirection: "row",
    gap: 12,
  },
  infoButton: {
    flex: 1,
  },
});