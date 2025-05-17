import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Game } from "@/types/event";
import { colors } from "@/constants/colors";
import { MapPin, Users, Award } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { tr, getUiLanguage } from "@/utils/i18n"; // DB fields

interface GameCardProps {
  game: Game;
  compact?: boolean;
  onPress?: () => void; // Added onPress prop
}

export const GameCard: React.FC<GameCardProps> = ({ game, compact, onPress }) => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = getUiLanguage(i18n);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/events/${eventId}/games/${game.id}`);
    }
  };

  const getStatusColor = (status: Game["status"]) => {
    if (status === "live") {
      return colors.success;
    } else if (status === "scheduled") {
      return colors.warning;
    } else if (status === "completed") {
      return colors.text.tertiary;
    } else {
      return colors.text.tertiary;
    }
  };

  // Safely get game name based on language
  const getGameName = () => {
        tr(game.name, lang);
  };

/** Return a comma-separated list of division names, localised. */
const getDivisionNames = (): string => {
  if (game.divisions && game.divisions.length > 0) {
    return game.divisions
      .map((d) => tr(d.name, lang))   // tr() handles string | LocalizedText
      .filter(Boolean)                // toss undefined / empty
      .join(", ");
  }

  /* Legacy single `division` field */
  if ((game as any).division) {
    const div = (game as any).division;
    return typeof div === "object" ? div[lang] || div.en || "" : div;
  }

  return "";
};


  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compactContainer]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {!compact && (
        <Image
          source={{ uri: game.imageUrl || "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=500",   }}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr(game.name, lang)}</Text>
          {game.status && (
            <View style={[ styles.statusBadge,  { backgroundColor: getStatusColor(game.status) },    ]}>
              <Text style={styles.statusText}>    {t( `events.status.${  game.status  }`   )}   </Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <Award size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>{getDivisionNames()}</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{game.mapLocation}</Text>
        </View>
        {/*
        {game.registeredParticipants && (
          <View style={styles.infoRow}>
            <Users size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>
              {t("events.registeredCount", {
                count: game.registeredParticipants.length,
              })}
            </Text>
          </View>
        )}
          */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  compactContainer: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 8,
  },
});