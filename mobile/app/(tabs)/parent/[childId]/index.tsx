import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useChildrenStore } from "@/store/children-store";
import { useEventsStore } from "@/store/events-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { GameCard } from "@/components/GameCard";
import { ScoreCard } from "@/components/ScoreCard";
import { Edit, Trash2, Award, Calendar } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { Game } from "@/types/event";

export default function ChildDetailScreen() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { children, isLoading} = useChildrenStore();
  const { games } = useEventsStore();
  const { t, language } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<"games" | "results">("games");
  
  const child = children.find(c => c.id === childId);
  //console.log('🔍 child object:', child);

  if (isLoading) return <ActivityIndicator />;

  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            {t("children.notFound")}
          </Text>
          <Button 
            title={t("common.goBack")} 
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

    
  const results = child.results ?? [];
  const tally = results.reduce(
    (acc, r) => {
      if (r.medal !== "none") {
        acc[r.medal] = (acc[r.medal] || 0) + 1;
      }
      return acc;
    },
    { gold: 0, silver: 0, bronze: 0 } as Record<
      "gold" | "silver" | "bronze",
      number
    >
  );

    // 1) Grab an array of all games from your dict
  const allGames: Game[] = Object.values(games);

  // 2) Now filter that array
  const registeredGames = Object.values(games).filter((g) =>
    child.registeredGames.includes(g.id)
  );
  
  // const handleEditChild = () => {
  //   router.push(`/parent/${childId}/edit`);
  // };
  
  const handleRegisterForGames = () => {
    router.push({
      pathname: '/events',
    });
  };
  
  const handleGamePress = (game: Game) => {
    router.push({
      pathname: '/events/[eventId]/games/[gameId]',
      params:   { eventId: game.eventId, gameId: game.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: t("children.childDetails") }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.childName}>{child.name}</Text>
            <View style={styles.medalTally}>
              {Array.from({ length: tally.gold }, (_, i) => (
                <Text key={`gold-${i}`} style={styles.medalIcon}>
                  🥇
                </Text>
              ))}
              {Array.from({ length: tally.silver }, (_, i) => (
                <Text key={`silver-${i}`} style={styles.medalIcon}>
                  🥈
                </Text>
              ))}
              {Array.from({ length: tally.bronze }, (_, i) => (
                <Text key={`bronze-${i}`} style={styles.medalIcon}>
                  🥉
                </Text>
              ))}
            </View>

            <Text style={styles.childGender}>
              {t(`children.gender.${child.gender}`)} : {child.age}
            </Text>
          </View>

          <View style={styles.headerActions}>
            {/* <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleEditChild}
            >
              <Edit size={20} color={colors.primary} />
            </TouchableOpacity> */}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t("children.otherInfo")}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t("children.fields.tamilSchool")}:
            </Text>
            <Text style={styles.infoValue}>
              {child.tamilSchool || "N/A"}
            </Text>
          </View>

          {/* <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t("children.fields.tamilGrade")}:
            </Text>
            <Text style={styles.infoValue}>{child.tamilGrade || "N/A"}</Text>
          </View> */}

          {child.medicalInfo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t("children.fields.medicalInfo")}:
              </Text>
              <Text style={styles.infoValue}>{child.medicalInfo}</Text>
            </View>
          )}

          {child.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {t("children.fields.notes")}:
              </Text>
              <Text style={styles.infoValue}>{child.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "games" && styles.activeTab]}
            onPress={() => setActiveTab("games")}
          >
            <Calendar
              size={20}
              color={
                activeTab === "games" ? colors.primary : colors.text.tertiary
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "games" && styles.activeTabText,
              ]}
            >
              {t("children.registeredGames")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "results" && styles.activeTab]}
            onPress={() => setActiveTab("results")}
          >
            <Award
              size={20}
              color={
                activeTab === "results" ? colors.primary : colors.text.tertiary
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "results" && styles.activeTabText,
              ]}
            >
              {t("children.results")}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "games" && (
          <View style={styles.gamesContainer}>
            {registeredGames.length > 0 ? (
              registeredGames.map((game: Game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  compact
                  onPress={() => handleGamePress(game)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {t("children.noRegisteredGames")}
                </Text>
                <Button
                  title={t("children.registerForGames")}
                  onPress={handleRegisterForGames}
                  style={styles.registerButton}
                />
              </View>
            )}
          </View>
        )}

        {activeTab === "results" && (
          <View style={styles.resultsContainer}>
            {child.results && child.results.length > 0 ? (
              child.results.map((r) => (
                <ScoreCard
                  key={r.gameId}
                  result={r}
                  game={games[r.gameId]}
                  childName={child.name}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {t("children.noResults")}
                </Text>
              </View>
            )}
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
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  childName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  childAge: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  childGender: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text.primary,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "600",
  },
  gamesContainer: {
    gap: 12,
  },
  resultsContainer: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
  registerButton: {
    minWidth: 200,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: 16,
    textAlign: "center",
  },
  medalTally: {
    flexDirection: "row",
    marginTop: 4,
  },
  medalIcon: {
    marginRight: 4, // space between each medal
    fontSize: 18,   // if you want to tweak the size
  },
});