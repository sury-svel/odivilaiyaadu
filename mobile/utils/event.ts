import { supabase } from "@/config/supabase"; // singleton client
import {
  Event,
  Game,
  Division,
  Sponsor,
  EventStatus,
  LocalizedText,
  GameStatus,
} from "@/types/event"; // path to the object model

// ---------- Utility helpers ----------
const deriveEventStatus = (eventDate: string): EventStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const evt = new Date(eventDate);
  evt.setHours(0, 0, 0, 0);

  if (evt < today) return "past";
  const MS_IN_DAY = 86_400_000;           // 24*60*60*1000
  const diffDays =
    (evt.getTime() - today.getTime()) / MS_IN_DAY;

  return diffDays <= 60 ? "active" : "upcoming";
};

/* build LocalizedText out of base EN + translation blob */
const buildLT = (
  base: string,
  translations: any | null | undefined,
  key: "name" | "description" | "venue_name" | "rules"
): LocalizedText => {
    const lt: LocalizedText = { en: base, ta: base };
  if (translations) {
    Object.entries(translations).forEach(([lang, obj]: any) => {
      if (obj?.[key]) lt[lang] = obj[key];
    });
  }
  return lt;
};

/* assemble Sponsor / Associate arrays */
const mapSponsorLike = (arr: any[] = []): Sponsor[] =>
  arr.map((s) => ({
    name: buildLT(s.translations?.en ?? s.name ?? "", s.translations, "name"),
    logoUrl: s.logo_url,
    websiteUrl: s.website_url,
  }));

// Convert raw DB rows -> front-end model
export const mapGame = (row: any): Game => {
  const t = row.translations ?? {};       

  /* ----- map divisions array, if present ----- */
  const divisions: Division[] = (row.divisions ?? []).map((d: any) => ({
    /* your Division interface has only name / minAge / maxAge */
    name:   buildLT(d.name, d.translations, "name"),
    minAge: String(d.min_age ?? ""),          // cast to string to match type
    maxAge: String(d.max_age ?? ""),
  }));

  return {
    id: row.id,
    eventId: row.event_id,
    /* multilingual */
    name:        buildLT(row.name,        t, "name"),
    description: buildLT(row.description, t, "description"),
    rules:       buildLT(row.rules,       t, "rules"),

    /* remaining fields unchanged */
    imageUrl:    row.image_url ?? undefined,
    status:      row.status as GameStatus,
    mapLocation: row.map_location ?? undefined,
    scoringType: row.scoring_type ?? undefined,
    divisions,
  };
};

export function formatDateString(
  dateString: string,
): string {
  // parse “YYYY-MM-DD” as a local date (avoids the midnight-UTC shift)
  const [year, month, day] = dateString.split("-").map(Number);
  const dt = new Date(year, month - 1, day);
  return dt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const mapEvent = (row: any): Event => {
  const t = row.translations ?? {};

  return {
    id: row.id,
    code: row.event_code!,
    name: buildLT(row.name, t, "name"),
    description: buildLT(row.description, t, "description"),
    venueName: buildLT(row.venue_name, t, "venue_name"),

    date: row.date,
    address: row.address,
    fieldMapUrl: row.field_map_url ?? "",
    registeredCount: row.registered_count ?? 0,

    status: deriveEventStatus(row.date),
    imageUrl: row.image_url ?? undefined,
    registrationEndDate: row.registration_end_date ?? undefined,
    createdAt: row.created_at,

    /* existing */
    games: (row.games ?? []).map((g: any) => g.name),
    gameIds: (row.games ?? []).map((g: any) => g.id),

    /* new */
    sponsors: mapSponsorLike(row.sponsors),
    associates: mapSponsorLike(row.associates),
  };
};

export const mapGameDetail = (row: any): Game => {
  const t = row.translations ?? {};

  return {
    id: row.game_id,
    eventId: row.event_id,

    /* multilingual */
    name:        buildLT(row.name,        t, "name"),
    description: buildLT(row.description, t, "description"),
    rules:       buildLT(row.rules,       t, "rules"),

    /* simple fields */
    imageUrl:    row.image_url ?? undefined,
    status:      row.status as GameStatus,
    mapLocation: row.map_location ?? undefined,
    scoringType: row.scoring_type ?? undefined,

    /* map divisions */
    divisions: (row.divisions ?? []).map((d: any) => ({
      id: d.id,
      name: buildLT(d.name, d.translations, "name"),
      minAge: d.min_age,
      maxAge: d.max_age,
      registrationCount: d.registration_count,
      scoreCards: (d.score_cards ?? []).map((s: any) => ({
        childId: s.child_id,
        divisionId:  s.division_id, 
        name: s.name,
        age: s.age,
        score: s.score,
        position: s.position,
        medal: s.medal,
      })),
    })),

    // map assigned volunteers
    assignedVolunteers: (row.assigned_volunteers ?? []) as string[],
  };
};
