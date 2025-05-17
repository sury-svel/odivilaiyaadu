import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Medal, ScoreCard, ScoringType } from "@/types/event";
import { colors } from "@/constants/colors";

interface Props {
  cards: ScoreCard[];
  editable: boolean;
  scoringType: ScoringType;
  onSave: (card: ScoreCard) => void;
  style?: ViewStyle;
}

const MEDAL_ORDER: Record<string, number> = {
  gold: 1,
  silver: 2,
  bronze: 3,
  none: 4,
};

// Shorten full name
const formatName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1].charAt(0)}.`;
  };
  
export default function ScoreCardTable({ cards, editable, scoringType, onSave, style }: Props) {
  const [data, setData] = useState<ScoreCard[]>([]);
  const [sortBy, setSortBy] = useState<"score">("score");

      useEffect(() => {
        // 1) sort (ascending for time, descending otherwise)
        const sorted = [...cards].sort((a, b) => {
          const aScore = a.score ?? (scoringType === "time" ? Infinity : -Infinity);
          const bScore = b.score ?? (scoringType === "time" ? Infinity : -Infinity);
          return scoringType === "time"
            ? aScore - bScore
            : bScore - aScore;
        });
      
        // 2) assign medals by *distinct* score, so ties share the same medal
        const withMedals: ScoreCard[] = [];
        let lastScore: number | null = null;
        let rank = 0;
      
        for (const card of sorted) {
          const s = card.score ?? 0;
          // only award medals for positive scores
          if (s > 0) {
            // if we hit a *new* score value, bump our rank
            if (s !== lastScore) {
              rank += 1;
              lastScore = s;
            }
          } else {
            // non‐positive scores never get a medal
            rank = 999;
          }
      
          let medal: ScoreCard["medal"] = "none";
          if (rank === 1) medal = "gold";
          else if (rank === 2) medal = "silver";
          else if (rank === 3) medal = "bronze";
      
          withMedals.push({ ...card, medal, position: rank,   });
        }

        setData(withMedals);
      }, [cards, scoringType]);

  const renderRow = ({ item }: { item: ScoreCard }) => (
    <View style={styles.row}>
      {/* <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text> */}
      <Text style={[styles.cell, styles.nameCell]}>
        {formatName(item.name)}{" "}
        {item.medal === "gold"
          ? "🥇"
          : item.medal === "silver"
          ? "🥈"
          : item.medal === "bronze"
          ? "🥉"
          : ""}
      </Text>
      <Text style={[styles.cell, styles.centerText]}>{item.age}</Text>

      <View style={[styles.cell, styles.centerCell]}>
        {editable ? (
          <TextInput
            style={[styles.input, styles.centerText]}
            defaultValue={item.score?.toString() ?? ""}
            keyboardType="numeric"
            onEndEditing={(e) =>
              onSave({ ...item, score: Number(e.nativeEvent.text) })
            }
          />
        ) : (
          <Text style={styles.cell}>{item.score ?? "-"}</Text>
        )}
      </View>

      <Text style={[styles.cell, styles.centerText]}>{item.position}</Text>

      <View style={[styles.cell, styles.centerCell]}>
        <Text style={styles.cell}>
          {item.medal === "none" ? "-" : item.medal.charAt(0).toUpperCase()}
        </Text>
      </View>

    </View>
  );

  const HeaderCell = ({
    label,
    keyName,
  }: {
    label: string;
    keyName: "score";
  }) => (
    <TouchableOpacity
      style={[styles.headerCell]}
      onPress={() => setSortBy(keyName)}
    >
      <Text
        style={[
          styles.headerText,
          sortBy === keyName && styles.sortedHeaderText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.table, style]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.nameCell]}>Name</Text>
        <Text style={[styles.headerCell, styles.centerCell]}>    Age</Text>
        <HeaderCell label="Score" keyName="score" />
        <Text style={[styles.headerCell, styles.centerCell]}>Position</Text>
        <Text style={[styles.headerCell, styles.centerCell]}>  Medal</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.childId}
        renderItem={renderRow}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 6,
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
  },
  sortedHeaderText: {
    textDecorationLine: "underline",
  },
  headerText: {
    fontWeight: "600",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#f2f2f2",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    justifyContent: "center",
  },
  nameCell: {
    flex: 2,
  },
  // container centering
  centerCell: {
    alignItems: "center",
  },
  // text centering
  centerText: {
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 14,
    minWidth: 40,
    textAlign: "center",
  },
  nameWithMedal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  medalIcon: {
    fontSize: 18,
  },
  pendingScore: {
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  
});
