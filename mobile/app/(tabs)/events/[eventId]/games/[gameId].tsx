import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput as RNTextInput,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { useTranslation } from "@/i18n";
import { tr, getUiLanguage } from "@/utils/i18n"; 
import DivisionAccordion from "@/components/DivisionAccordion";
import { Clock, MapPin } from "lucide-react-native";

export default function GameDetailsScreen() {
  const { eventId, gameId } = useLocalSearchParams<{ eventId: string; gameId: string }>();
  // console.log("⚡ GameDetailsScreen mount:", { eventId, gameId });
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, language, isAuthenticated } = useAuthStore();
  const { t, i18n } = useTranslation();
  const lang = getUiLanguage(i18n);

  const currentGame = useEventsStore((s) => s.currentGame);
  const fetchGameDetails = useEventsStore((s) => s.fetchGameDetails);
  const saveScore = useEventsStore((s) => s.saveScore);
  const assignVolunteerToGame  = useEventsStore(s => s.assignVolunteerToGame);
  const unassignVolunteerFromGame = useEventsStore(s => s.unassignVolunteerFromGame);

  const isVolunteer = user?.role === "volunteer";
  const isParent = user?.role === "parent";
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (gameId) fetchGameDetails(gameId);
  }, [gameId, fetchGameDetails]);

  //TODO need to check about this ActivityIndicator
  if (!currentGame) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  const isAssigned = isVolunteer
    && (currentGame.assignedVolunteers ?? []).includes(user!.id);

  const handleVolunteerToggle = async () => {
    if (!user) return;
    setProcessing(true);

    if (isAssigned) {
      await unassignVolunteerFromGame(user.id, currentGame.id);
    } else {
      await assignVolunteerToGame   (user.id, currentGame.id, currentGame.eventId);
    }
    // re-fetch to pick up the new assignedVolunteers[]
    await fetchGameDetails(currentGame.id);
    setProcessing(false);
  };
  
  

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ title: tr(currentGame.name, getUiLanguage(i18n)) }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: currentGame.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Clock size={20} color={colors.text.tertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t("games.scoringType")}</Text>
                <Text style={styles.infoText}>
                  {tr(currentGame.scoringType, getUiLanguage(i18n))}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.text.secondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{currentGame.mapLocation}</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>{t("games.description")}</Text>
            <Text style={styles.descriptionText}>
              {tr(currentGame.description, getUiLanguage(i18n))}
            </Text>
          </View>

          {(currentGame.divisions ?? []).map((div) => (
            <DivisionAccordion
              key={
                div.id ?? `${tr(div.name, lang)}-${div.minAge}-${div.maxAge}`
              }
              division={div}
              game={currentGame}
              editable={isAssigned}
              scoringType={currentGame.scoringType!}
              isVolunteerAssigned={isAssigned}
              onSave={async (card) => {
                await saveScore({
                  gameId: currentGame.id,
                  divisionId: card.divisionId,
                  childId: card.childId,
                  score: card.score!,
                  position: card.position!,
                  medal: card.medal!,
                });

                fetchGameDetails(currentGame.id);
              }}
            />
          ))}

          {isVolunteer && (
            <Button
              title={
                isAssigned
                  ? t("volunteer.unassignFromGame")
                  : t("volunteer.assignToGame")
              }
              onPress={handleVolunteerToggle}
              disabled={processing}
              variant={isAssigned ? "outline" : "primary"}
              style={styles.volunteerButton}
            />
          )}

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>{t("games.rules")}</Text>
            <Text style={styles.descriptionText}>
              {tr(currentGame.rules, getUiLanguage(i18n))}
            </Text>
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
    flexGrow: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
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
  infoText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  rulesSection: {
    marginBottom: 24,
  },
  rulesText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  registeredChildrenSection: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  registeredChildItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  childPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  childPhotoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  childName: {
    fontSize: 16,
    color: colors.text.primary,
  },
  childDivision: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  childActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  unregisterButton: {
    padding: 8,
  },
  scoreButton: {
    padding: 8,
    marginRight: 4,
  },
  parentActions: {
    marginBottom: 24,
    gap: 12,
  },
  registerButton: {
    marginBottom: 0,
  },
  unregisterAllButton: {
    marginBottom: 0,
  },
  volunteerButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  adminActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  adminButton: {
    flex: 1,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    width: "100%",
    maxHeight: "80%",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  childrenList: {
    maxHeight: 300,
  },
  childItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.card,
  },
  selectedChildItem: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  childItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalChildPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalChildPhotoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  childItemInfo: {
    flex: 1,
  },
  childItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  childItemDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  // Scoring modal styles
  scoringChildInfo: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  scoringChildName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  scoringChildDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scoreInputContainer: {
    marginBottom: 16,
  },
  scoreInputLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  scoreInput: {
    fontSize: 18,
    textAlign: "center",
  },
});
