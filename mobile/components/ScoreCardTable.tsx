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
import { assignMedalsAndPositions } from "@/utils/score";

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

      // useEffect(() => {
      //   const withMedals = assignMedalsAndPositions(cards, scoringType);
      //   setData(withMedals);
      // }, [cards, scoringType]);

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
        data={cards}
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
