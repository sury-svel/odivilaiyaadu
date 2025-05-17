import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Award, Clock, Ruler } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";
import { scoringTypes, ScoringType } from "@/constants/scoring";
import { useTranslation } from "@/i18n";
import { ScoreCardProps } from "@/types/event";


export const ScoreCard: React.FC<ScoreCardProps> = ({
  childName,
  gameName,
  score,
  position,
  scoringType = "points",
  result,
  game,
}) => {
  const { language } = useAuthStore();
  const { t } = useTranslation();
  const lang = language || "en";
  
  // If result and game are provided, extract data from them
  const actualScore = result?.score ?? score ?? 0;
  const actualPosition = result?.position ?? position;
  const actualMedal    = result?.medal;
  const actualGameName = gameName ?? (game ? (typeof game.name === "object" ? game.name[lang] || game.name.en : game.name) : "");
  const actualScoringType = scoringType ?? (game?.scoringType as ScoringType) ?? "points";
  
  const getScoringIcon = () => {
    switch (actualScoringType) {
      case "time":
        return <Clock size={20} color={colors.primary} />;
      case "points":
        return <Award size={20} color={colors.primary} />;
      case "distance":
        return <Ruler size={20} color={colors.primary} />;
      default:
        return <Award size={20} color={colors.primary} />;
    }
  };
  
  const getPositionColor = () => {
    if (!actualPosition) return colors.text.secondary;
    
    switch (actualPosition) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return colors.text.secondary;
    }
  };
  
  // Get the unit text safely
  const getUnitText = () => {
    const unitInfo = scoringTypes[actualScoringType]?.unit;
    if (!unitInfo) return "";
    
    // If unit is a string, return it directly
    if (typeof unitInfo === "string") return unitInfo;
    
    // If unit is an object with language keys, return the appropriate one
    if (typeof unitInfo === "object") {
      return unitInfo[lang] || unitInfo.en || "";
    }
    
    return "";
  };
  
  const getPositionText = () => {
    if (!actualPosition) return "";
    
    if (lang === "ta") {
      if (actualPosition === 1) return "முதல் இடம்";
      if (actualPosition === 2) return "இரண்டாம் இடம்";
      if (actualPosition === 3) return "மூன்றாம் இடம்";
      return `${actualPosition}வது இடம்`;
    } else {
      if (actualPosition === 1) return "1st Place";
      if (actualPosition === 2) return "2nd Place";
      if (actualPosition === 3) return "3rd Place";
      return `${actualPosition}th Place`;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.gameName}>{actualGameName}</Text>
        {actualPosition && (
          <View
            style={[
              styles.positionBadge,
              { backgroundColor: getPositionColor() },
            ]}
          >
            <Text style={styles.positionText}>{getPositionText()}</Text>
          </View>
        )}
        {/* medal emoji */}
        {actualMedal && actualMedal !== "none" && (
          <Text style={styles.medalEmoji}>
            {actualMedal === "gold"
              ? "🥇"
              : actualMedal === "silver"
              ? "🥈"
              : "🥉"}
          </Text>
        )}
      </View>

      {/* {childName && <Text style={styles.childName}>{childName}</Text>} */}

      <View style={styles.scoreContainer}>
        {getScoringIcon()}
        <Text style={styles.scoreValue}>
          {actualScore} {getUnitText()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  positionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positionText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: "600",
  },
  childName: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(106, 62, 161, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  scoreValue: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  medalEmoji: {
    marginLeft: 8,
    fontSize: 20,
  },
});