import { ScoreCard, ScoringType } from "@/types/event";

export function assignMedalsAndPositions(
  cards: ScoreCard[],
  scoringType: ScoringType
): ScoreCard[] {
  const sorted = [...cards].sort((a, b) => {
    const aScore = a.score ?? (scoringType === "time" ? Infinity : -Infinity);
    const bScore = b.score ?? (scoringType === "time" ? Infinity : -Infinity);
    return scoringType === "time" ? aScore - bScore : bScore - aScore;
  });

  let lastScore: number | null = null;
  let rank = 0;
  const withMedals: ScoreCard[] = [];

  for (const card of sorted) {
    const s = card.score ?? 0;
    if (s > 0) {
      if (s !== lastScore) {
        rank += 1;
        lastScore = s;
      }
    } else {
      rank = 999;
    }

    let medal: ScoreCard["medal"] = "none";
    if (rank === 1) medal = "gold";
    else if (rank === 2) medal = "silver";
    else if (rank === 3) medal = "bronze";

    withMedals.push({ ...card, medal, position: rank });
  }

  return withMedals;
}
