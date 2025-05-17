import React, { useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { colors } from "@/constants/colors";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/Button";
import { Award, Clock, MapPin, QrCode, Info } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { settings } from "@/constants/settings";
import { Game } from "@/types/event";

export default function VolunteerScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  // const { games, updateEventStatuses } = useEventsStore();
  const { games } = useEventsStore();
  const { t, language } = useTranslation();
  
  // useEffect(() => {
  //   // Update event statuses based on current date
  //   updateEventStatuses();
  // }, []);

  // pull out the values from the dict into a real array
  const gameList: Game[] = Object.values(games ?? {}); 

  // Filter games assigned to this volunteer
  const assignedGames = React.useMemo(() => {
    if (!isAuthenticated || user?.role !== "volunteer") return [];
    // const volunteerUser = user as any; // Type assertion for TS
    const volunteerAssigned = gameList.filter(g => 
      g.assignedVolunteers?.includes(user.id)
    );
    return volunteerAssigned;
    // return games.filter(game => volunteerUser.assignedGames?.includes(game.id));
  }, [isAuthenticated, user, games]);
  
  // Filter available games (not assigned to this volunteer)
  const availableGames = React.useMemo(() => {
    if (!isAuthenticated || user?.role !== "volunteer") return [];
    // const volunteerUser = user as any; // Type assertion for TS
    const volunteerUnassigned = gameList.filter(g => 
      !g.assignedVolunteers?.includes(user.id)
    );
    return volunteerUnassigned;
    // return games.filter(game => !volunteerUser.assignedGames?.includes(game.id));
  }, [isAuthenticated, user, games]);
  
  const handleGamePress = (gameId: string) => {
    router.push(`/(stack)/games/${gameId}`);
  };
  
  if (!isAuthenticated || user?.role !== "volunteer") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedTitle}>
            {t("common.unauthorized")}
          </Text>
          <Text style={styles.unauthorizedText}>
            {language === "ta" 
              ? "இந்தப் பக்கத்தை அணுக நீங்கள் தன்னார்வலராக உள்நுழைய வேண்டும்." 
              : "You need to be logged in as a volunteer to access this page."}
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
  
  const volunteerUser = user as any; // Type assertion for TS
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t("volunteer.title")}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            {language === "ta" 
              ? `வணக்கம், ${user.fullName}!` 
              : `Welcome, ${user.fullName}!`}
          </Text>
          
          {volunteerUser.couponCode && (
            <View style={styles.couponContainer}>
              <Text style={styles.couponLabel}>
                {language === "ta" ? "உங்கள் கூப்பன் குறியீடு:" : "Your Coupon Code:"}
              </Text>
              <View style={styles.couponCode}>
                <Text style={styles.couponText}>{volunteerUser.couponCode}</Text>
                <QrCode size={24} color={colors.primary} />
              </View>
              <Text style={styles.couponInfo}>
                {language === "ta" 
                  ? "இந்த குறியீட்டைப் பயன்படுத்தி நிகழ்வின் போது உணவைப் பெறலாம்." 
                  : "Use this code to redeem food during the event."}
              </Text>
            </View>
          )}
          
          <View style={styles.assignmentInfo}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.assignmentInfoText}>
              {language === "ta" 
                ? `நீங்கள் அதிகபட்சம் ${settings.maxVolunteerGames} விளையாட்டுகளுக்கு பணியமர்த்தப்படலாம்.` 
                : `You can be assigned to a maximum of ${settings.maxVolunteerGames} games.`}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("volunteer.assignedGames")}
          </Text>
          
          {assignedGames.length > 0 ? (
            assignedGames.map(game => (
              <TouchableOpacity 
                key={game.id} 
                onPress={() => handleGamePress(game.id)}
                activeOpacity={0.7}
              >
                <GameCard game={game} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t("volunteer.noAssignedGames")}
              </Text>
            </View>
          )}
        </View>
        
        {/* Available Games Section */}
        {volunteerUser.assignedGames?.length < settings.maxVolunteerGames && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("volunteer.availableGames")}
            </Text>
            
            {availableGames.length > 0 ? (
              availableGames.map(game => (
                <TouchableOpacity 
                  key={game.id} 
                  onPress={() => handleGamePress(game.id)}
                  activeOpacity={0.7}
                >
                  <GameCard game={game} compact />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {t("volunteer.noAvailableGames")}
                </Text>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("volunteer.information")}
          </Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Clock size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>
                  {t("volunteer.reportingTime")}
                </Text>
                <Text style={styles.infoText}>
                  {t("volunteer.reportingTimeValue")}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <MapPin size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>
                  {t("volunteer.reportingLocation")}
                </Text>
                <Text style={styles.infoText}>
                  {t("volunteer.reportingLocationValue")}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Award size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>
                  {t("volunteer.responsibilities")}
                </Text>
                <Text style={styles.infoText}>
                  {t("volunteer.responsibilitiesValue")}
                </Text>
              </View>
            </View>
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
  header: {
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
  welcomeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 16,
  },
  couponContainer: {
    backgroundColor: "rgba(106, 62, 161, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  couponLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  couponCode: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  couponText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 1,
  },
  couponInfo: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontStyle: "italic",
  },
  assignmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    padding: 12,
  },
  assignmentInfoText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
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