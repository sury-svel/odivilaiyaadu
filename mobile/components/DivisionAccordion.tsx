import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator, 
  Alert
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { getUiLanguage, tr } from "@/utils/i18n";
import { Division, Game, ScoreCard, ScoringType } from "@/types/event";
import ScoreCardTable from "./ScoreCardTable";
import { colors } from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/config/supabase';

interface Props {
  division: Division;
  game: Game,
  editable: boolean;
  scoringType: ScoringType; 
  onSave: (card: ScoreCard) => void;
  style?: ViewStyle;
  isVolunteerAssigned: boolean;    
}

export default function DivisionAccordion({
  division,
  game,
  editable,
  scoringType,
  onSave,
  isVolunteerAssigned,  
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = getUiLanguage(i18n);


  const title = `${tr(division.name, lang)} (${division.minAge}–${
    division.maxAge
  }) • ${division.registrationCount} ${
    division.registrationCount === 1 ? "kid" : "kids"
  }`;

  const hasPlayers = (division.registrationCount ?? 0) > 0;

  const toggleOpen = () => {
    if (hasPlayers) {
      setOpen(!open);
    }
  };

  //Helper function for notifications
  async function notify(templateId: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "publish_division_notifications",
        {
          body: {
            template_id: templateId,
            params: {
              lang,
              game:     tr(game.name,     lang),
              division: tr(division.name, lang),
              location: tr(game.mapLocation ?? "", lang),
            },
            division_id: division.id,
          },
        }
      );
      if (error) throw error;
      Alert.alert(
        t("common.success"),
        `${data.published} ${t("notifications.sent")}`
      );
    } catch (err: any) {
      Alert.alert(t("common.error"), err.message);
    } finally {
      setLoading(false);
    }
  }
  
  // Confirm and flip to “started”
  const handleStart = () => {
    Alert.alert(
      t("volunteer.startConfirmTitle"), // e.g. "Start Game?"
      t("volunteer.startConfirmMsg"), // e.g. "Are you sure you want to start now?"
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.start"),
          onPress: () => {
            setHasStarted(true);
            notify("division_start"); //Notifications sent
          },
        },
      ]
    );
  };

  // Confirm and flip to “ended”
  const handleEnd = () => {
    Alert.alert(
      t("volunteer.endConfirmTitle"), // e.g. "End Game?"
      t("volunteer.endConfirmMsg"), // e.g. "Have you finished entering all scores?"
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.end"),
          onPress: () => setHasEnded(true),
        },
      ]
    );
  };

  const handlePublish = () => {
    Alert.alert(
      t("volunteer.publishConfirmTitle"),   // e.g. "Publish Results?"
      t("volunteer.publishConfirmMsg"),     // e.g. "Are you sure you want to publish the results?"
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.publish"),
          onPress: () => notify("division_publish"),
        },
      ]
    );
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen((o) => !o)}
      >
        {/* <Text style={styles.headerText}>{title}</Text> */}
        <View style={styles.titleRow}>
          <Text style={styles.divisionName}>{tr(division.name, lang)}</Text>
          <Text style={styles.ageRange}>
            ({division.minAge}–{division.maxAge})
          </Text>
          <View style={styles.registrationBadge}>
            <Text style={styles.registrationText}>
              {division.registrationCount}{" "}
              {division.registrationCount === 1 ? "kid" : "kids"}
            </Text>
          </View>
        </View>
        <View style={styles.rightIcons}>
          {hasPlayers && isVolunteerAssigned && !hasStarted && (
            <TouchableOpacity onPress={handleStart} style={styles.actionBtn}>
              <Ionicons name="play-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {hasPlayers && isVolunteerAssigned && hasStarted && !hasEnded && (
            <TouchableOpacity onPress={handleEnd} style={styles.actionBtn}>
              <Ionicons name="stop-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {hasPlayers && isVolunteerAssigned && hasEnded && ( 
            <TouchableOpacity onPress={handlePublish} disabled={loading} style={styles.actionBtn} >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="send-outline" size={20}  color={colors.primary}  />
              )}
            </TouchableOpacity>
          )}
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </View>
      </TouchableOpacity>

      {open && (
        <ScoreCardTable
          cards={division.scoreCards ?? []}
          editable={editable && hasStarted && !hasEnded}
          scoringType={scoringType}
          onSave={onSave}
          style={{ display: open ? "flex" : "none" }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  divisionName: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.text.primary,
  },
  ageRange: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  registrationBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  registrationText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  publishButton: {
    marginRight: 12,
  },
  actionBtn: {
    marginRight: 12,
  },
});
