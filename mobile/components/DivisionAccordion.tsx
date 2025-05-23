import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { getUiLanguage, tr } from "@/utils/i18n";
import { Division, DivisionStatus, Game, ScoreCard, ScoringType } from "@/types/event";
import ScoreCardTable from "./ScoreCardTable";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/config/supabase";
import { assignMedalsAndPositions } from "@/utils/score";

interface Props {
  division: Division;
  game: Game;
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
  // const [hasStarted, setHasStarted] = useState(false);
  // const [hasEnded, setHasEnded] = useState(false);
  const [divisionStatus, setDivisionStatus] = useState<DivisionStatus>( division.status );
  const [scoreCards, setScoreCards] = useState<ScoreCard[]>(  division.scoreCards ?? [] );
  const { t, i18n } = useTranslation();
  const lang = getUiLanguage(i18n);

  const title = `${tr(division.name, lang)} (${division.minAge}–${division.maxAge})`;
  const hasPlayers = (division.registrationCount ?? 0) > 0;

  // console.log("Division ===>>>>>", division);

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
              game: tr(game.name, lang),
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
  const handleStart = async () => {
    Alert.alert(
      t("volunteer.startConfirmTitle"),
      t("volunteer.startConfirmMsg"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.start"),
          onPress: async () => {
            const { error } = await supabase
              .from("game_divisions")
              .update({ status: "started" })
              .eq("division_id", division.id)
              .eq("game_id", game.id);
            if (!error) {
              setDivisionStatus("started");
              notify("division_start");
            } else {
              Alert.alert(t("common.error"), error.message);
            }
          },
        },
      ]
    );
  };

  // Confirm and flip to “ended”
  const handleEnd = async () => {
   Alert.alert(t("volunteer.endConfirmTitle"), t("volunteer.endConfirmMsg"), [
     { text: t("common.cancel"), style: "cancel" },
     {
       text: t("common.end"),
       onPress: async () => {
         const { error } = await supabase
           .from("game_divisions")
           .update({ status: "stopped" })
           .eq("division_id", division.id)
           .eq("game_id", game.id);;
         if (!error) {
           setDivisionStatus("stopped");
         } else {
           Alert.alert(t("common.error"), error.message);
         }
       },
     },
   ]);
  };


const handlePublish = async () => {
  Alert.alert(
    t("volunteer.publishConfirmTitle"),
    t("volunteer.publishConfirmMsg"),
    [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.publish"),
        onPress: async () => {
          setLoading(true);
          try {
            const { error } = await supabase
              .from("game_divisions")
              .update({ status: "completed" })
              .eq("division_id", division.id)
              .eq("game_id", game.id);
            if (!error) {
              setDivisionStatus("completed");
              await notify("division_publish");
            } else {
              Alert.alert(t("common.error"), error.message);
            }
          } finally {
            setLoading(false);
          }
        },
      },
    ]
  );
};


  const handleSaveAllScores = async () => {
    try {
      const updated = assignMedalsAndPositions(scoreCards, scoringType);

      console.log("Saving all scoreCards:", scoreCards);
      const updates = updated.map((u) =>
        supabase
          .from("game_scores")
          .update({
            score: u.score,
            position: u.position,
            medal: u.medal,
          })
          .eq("child_id", u.childId)
          .eq("division_id", u.divisionId)
          .eq("game_id", u.gameId)
      );

      await Promise.all(updates);
      Alert.alert("Success", "Scores and results saved!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen((o) => !o)}
      >
      <View style={styles.titleWrapper}>
        <Text style={styles.divisionTitleText}>{title}</Text>

        <View style={styles.subInfoRow}>
          <View style={styles.iconLabel}>
            <Ionicons name="person-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.infoText}>{division.registrationCount}</Text>
          </View>

          <View style={[styles.statusBadge, styles[divisionStatus]]}>
            <Text style={styles.statusText}>{divisionStatus}</Text>
          </View>
        </View>
      </View>

        <View style={styles.rightIcons}>
          {hasPlayers && isVolunteerAssigned && divisionStatus === "scheduled" && (
            <TouchableOpacity onPress={handleStart} style={styles.actionBtn}>
              <Ionicons name="play-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {hasPlayers && isVolunteerAssigned && divisionStatus === "started" && (
            <>
              <TouchableOpacity onPress={handleEnd} style={styles.actionBtn}>
                <Ionicons name="stop-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveAllScores} style={styles.actionBtn}>
                <Ionicons name="save-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </>
          )}
          {hasPlayers && isVolunteerAssigned && divisionStatus === "stopped" && (
            <TouchableOpacity
              onPress={handlePublish}
              disabled={loading}
              style={styles.actionBtn}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Ionicons name="send-outline" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </View>
      </TouchableOpacity>

      {open && (
        <ScoreCardTable
          cards={scoreCards}
          editable={editable && divisionStatus === "started"}
          scoringType={scoringType}
          onSave={(card) => {
            const updated = scoreCards.map((c) =>
              c.childId === card.childId && c.gameId === card.gameId
                ? { ...c, score: card.score }
                : c
            );
            const updatedWithMedals = assignMedalsAndPositions(
              updated,
              scoringType
            );
            setScoreCards(updatedWithMedals);
          }}
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

  divisionTitleText: {
  fontSize: 16,
  fontWeight: "600",
  flex: 1,
  color: colors.text.primary,
  },

  rightInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
  },

  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  statusText: {
    fontSize: 12,
    color: "white",
    textTransform: "capitalize",
  },

  scheduled: {
    backgroundColor: colors.status.scheduled,
  },
  started: {
    backgroundColor: colors.status.live,
  },
  stopped: {
    backgroundColor: colors.status.stopped,
  },
  completed: {
    backgroundColor: colors.status.completed,
  },
  titleWrapper: {
    flex: 1,
  },

  subInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 10,
  },
});
