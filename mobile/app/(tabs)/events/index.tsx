import React, { useEffect, useMemo, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { colors } from "@/constants/colors";
import { EventCard } from "@/components/EventCard";
import { Calendar, Clock, CheckCheck } from "lucide-react-native";
import { useTranslation } from "@/i18n";          // UI labels
import { tr, getUiLanguage } from "@/utils/i18n"; // DB fields


export default function EventsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();          // i18n.language gives "en" | "ta" | …
  const lang = getUiLanguage(i18n);

  /* ---- Zustand selectors ---- */
  const eventsDict = useEventsStore((s) => s.events);
  const isLoading = useEventsStore((s) => s.isLoading);
  const fetchEvents = useEventsStore((s) => s.fetchEvents);


  /* ---- run once on mount ---- */
  useEffect(() => {
    // console.log("Mounting Events list ......");
    if (Object.keys(eventsDict).length === 0) fetchEvents();
  }, []);

  /* ---- convert dict → array ---- */
  const events = useMemo(
    () => Object.values(eventsDict),
    [eventsDict]
  );

  /* ---- filtering ---- */
  const [filter, setFilter] = useState<"all" | "active" | "upcoming" | "past">("all");

  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.status === filter);
  }, [events, filter]);

  /* ---- navigation ---- */
  const handleEventPress = (eventId: string) => {
    //  console.log("Pushing from event list .............. " + eventId);
     router.push(`/events/${eventId}`);
    // console.log("Pushing.............. " + eventId);
    // router.push({
    //   pathname: '/events/[eventId]',
    //   params:   { eventId },
    // });
    
  };

  /* ---- pull-to-refresh ---- */
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  /* ---- UI ---- */
  if (isLoading && events.length === 0) {           // first load
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <Text style={styles.title}>{t("events.title")}</Text>
        <Text style={styles.subtitle}>{t("events.subtitle")}</Text>
      </View>

      {/* ---------- Filter chips ---------- */}
      <View style={styles.filterContainer}>
        {(
          [
            { key: "all", icon: Calendar },
            { key: "active", icon: Clock },
            { key: "upcoming", icon: Calendar },
            { key: "past", icon: CheckCheck },
          ] as const
        ).map(({ key, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterButton, filter === key && styles.activeFilter]}
            onPress={() => setFilter(key)}
            activeOpacity={0.7}
          >
            <Icon
              size={16}
              color={filter === key ? "white" : colors.text.secondary}
            />
            <Text
              style={[
                styles.filterText,
                filter === key && styles.activeFilterText,
              ]}
            >
              {t(`events.filters.${key}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ---------- Events list ---------- */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="always"
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              onPress={() => handleEventPress(event.id)}
              activeOpacity={0.8}
            >
              {/* We pass a translated clone to EventCard */}
              <EventCard
                event={{
                  ...event,
                  name: tr(event.name, lang),
                  description: tr(event.description, lang),
                  venueName: tr(event.venueName, lang),
                }}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t("events.noEventsFound")}</Text>
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
  centered:  { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    gap: 4,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  activeFilterText: {
    color: "white",
    fontWeight: "500",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.tertiary,
  },
});