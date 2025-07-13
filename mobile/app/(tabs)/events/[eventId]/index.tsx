import React, { useMemo, useEffect, useState } from "react";
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
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { GameCard } from "@/components/GameCard";
import { Event, Game } from "@/types/event";
import { Calendar, MapPin, Users, Clock } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { tr, getUiLanguage } from "@/utils/i18n";
import { formatDateString } from "@/utils/event";

export default function EventDetailsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = getUiLanguage(i18n);
  const { user, language, isAuthenticated } = useAuthStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const {
    events: eventsDict,
    games: gamesDict,
    registerForEvent,
    // unregisterFromEvent,
    setCurrentEvent,
    currentEvent,
    refreshEvent,
  } = useEventsStore();

  const mapImageUrl =
    currentEvent?.fieldMapUrl ??
    `https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/events/CT/ovct2025_fm.png`;

  // 1. Ensure current event is set
  useEffect(() => {
    if (eventId) {
      setCurrentEvent(eventId);
    }
  }, [eventId, setCurrentEvent]);

  // 2. Check if user is registered for event
  useEffect(() => {
    let isMounted = true;
    if (eventId && user?.id) {
      useEventsStore
        .getState()
        .isUserRegisteredForEvent(eventId, user.id)
        .then((registered) => {
          if (isMounted) setIsRegistered(registered);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [eventId, user?.id]);

  // 3. Select event from store
  const [event, setEvent] = useState<Event | undefined>(undefined);
  useEffect(() => {
    if (eventId) {
      const updated = eventsDict[eventId] ?? currentEvent;
      if (updated) {
        setEvent(updated);
      }
    }
  }, [eventId, eventsDict, currentEvent]);

  // 4. Collect event games
  const eventGames: Game[] = useMemo(() => {
    if (!event) return [];
    const ids = event.gameIds ?? event.games ?? [];
    if (!gamesDict) return [];
    return ids.map((gid) => gamesDict[gid]).filter((g): g is Game => Boolean(g));
  }, [event, gamesDict]);

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            {language === "ta" ? "நிகழ்வு கிடைக்கவில்லை" : "Event not found"}
          </Text>
          <Button
            title={language === "ta" ? "பின் செல்" : "Go Back"}
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  const isPastEvent = event.status === "past";
  const name = tr(event.name, lang);
  const description = tr(event.description, lang);
  const location = tr(event.address, lang);
  const isParent = user?.role === "parent";

  const handleRegister = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert(
        language === "ta" ? "உள்நுழைவு தேவை" : "Login Required",
        language === "ta"
          ? "இந்த நிகழ்வில் பதிவு செய்ய நீங்கள் உள்நுழைய வேண்டும்."
          : "You need to login to register for this event.",
        [
          {
            text: language === "ta" ? "ரத்து செய்" : "Cancel",
            style: "cancel",
          },
          {
            text: language === "ta" ? "உள்நுழை" : "Login",
            onPress: () => router.push("/(modal)/auth/login"),
          },
        ]
      );
      return;
    }

    if (isPastEvent) {
      Alert.alert(
        language === "ta" ? "பதிவு முடிந்தது" : "Registration Closed",
        language === "ta"
          ? "இந்த நிகழ்வு ஏற்கனவே நடந்துவிட்டது."
          : "This event has already taken place."
      );
      return;
    }

    try {
      setIsRegistering(true);
      if (user) {
        const success = await registerForEvent(event.id, user.id);
        if (success) {
          await refreshEvent(event.id);
          setCurrentEvent(event.id);
          setIsRegistered(true);
          Alert.alert(
            language === "ta" ? "பதிவு வெற்றி" : "Registration Successful",
            language === "ta"
              ? "நீங்கள் இந்த நிகழ்வில் வெற்றிகரமாக பதிவு செய்துள்ளீர்கள்."
              : "You have successfully registered for this event."
          );
        }
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: name }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{
            uri:
              event.imageUrl ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500",
          }}
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{name}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Calendar size={20} color={colors.text.tertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {language === "ta" ? "தேதி" : "Date"}
                </Text>
                <Text style={styles.infoText}>{formatDateString(event.date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={20} color={colors.text.tertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {language === "ta" ? "இடம்" : "Location"}
                </Text>
                <TouchableOpacity
                  accessibilityRole="link"
                  onPress={() => {
                    const query = encodeURIComponent(location);
                    const url =
                      Platform.OS === "ios"
                        ? `maps:0,0?q=${query}`
                        : `geo:0,0?q=${query}`;
                    Linking.openURL(url).catch(() =>
                      Linking.openURL(
                        `https://www.google.com/maps/search/?api=1&query=${query}`
                      )
                    );
                  }}
                >
                  <Text style={[styles.infoText, styles.linkText]}>{location}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.text.secondary} />
              <View style={styles.infoContent}>
                <TouchableOpacity onPress={() => setMapModalVisible(true)}>
                  <Text style={[styles.infoLabel, { textDecorationLine: "underline" }]}>
                    {language === "ta" ? "இடத்தின் வரைபடம்" : "Location Map"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {event.registrationEndDate && (
              <View style={styles.infoRow}>
                <Clock size={20} color={colors.text.tertiary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>
                    {language === "ta" ? "பதிவு காலக்கெடு" : "Registration Deadline"}
                  </Text>
                  <Text style={styles.infoText}>
                    {formatDateString(event.registrationEndDate)}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <Users size={20} color={colors.text.tertiary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {language === "ta" ? "பதிவு செய்தவர்கள்" : "Registered"}
                </Text>
                <Text style={styles.infoText}>
                  {event.registeredCount || 0}{" "}
                  {language === "ta" ? "பங்கேற்பாளர்கள்" : "players"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>
              {language === "ta" ? "விவரங்கள்" : "Description"}
            </Text>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>

          <View style={styles.gamesSection}>
            <Text style={styles.sectionTitle}>
              {language === "ta" ? "விளையாட்டுகள்" : "Games"}
            </Text>
            {eventGames.length > 0 ? (
              eventGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  compact
                  onPress={() => router.push(`/events/${eventId}/games/${game.id}`)}
                />
              ))
            ) : (
              <Text style={styles.noGamesText}>
                {language === "ta" ? "விளையாட்டுகள் எதுவும் இல்லை" : "No games found"}
              </Text>
            )}
          </View>

          {!isPastEvent && isParent && (
            <View style={styles.registrationSection}>
              {isRegistered ? (
                <Text style={styles.alreadyRegisteredText}>
                  {language === "ta"
                    ? "நீங்கள் ஏற்கனவே பதிவு செய்துள்ளீர்கள்"
                    : "You are already registered for this event."}
                </Text>
              ) : (
                <Button
                  title={
                    isRegistering
                      ? language === "ta"
                        ? "பதிவு செய்கிறோம்..."
                        : "Registering..."
                      : language === "ta"
                      ? "பதிவு செய்"
                      : "Register"
                  }
                  onPress={handleRegister}
                  isLoading={isRegistering}
                  disabled={isRegistering}
                />
              )}
            </View>
          )}

          {((event.sponsors?.length ?? 0) > 0 ||
            (event.associates?.length ?? 0) > 0) && (
            <View style={styles.sponsorSection}>
              {(event.sponsors?.length ?? 0) > 0 && (
                <View style={styles.sponsorBlock}>
                  <Text style={styles.sectionTitle}>
                    {language === "ta" ? "ஆதரவாளர்கள்" : "Sponsors"}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {event.sponsors?.map((sponsor, index) => (
                      <TouchableOpacity
                        key={`sponsor-${index}`}
                        onPress={() => sponsor.websiteUrl && Linking.openURL(sponsor.websiteUrl)}
                        activeOpacity={0.8}
                        style={styles.logoCard}
                      >
                        <Image source={{ uri: sponsor.logoUrl }} style={styles.logoImage} />
                        <Text style={styles.logoText}>
                          {typeof sponsor.name === "string"
                            ? sponsor.name
                            : sponsor.name[lang] || sponsor.name.en}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {(event.associates?.length ?? 0) > 0 && (
                <View style={styles.sponsorBlock}>
                  <Text style={styles.sectionTitle}>
                    {language === "ta" ? "இணைபங்காளிகள்" : "Associates"}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {event.associates?.map((associate, index) => (
                      <TouchableOpacity
                        key={`associate-${index}`}
                        onPress={() =>
                          associate.websiteUrl && Linking.openURL(associate.websiteUrl)
                        }
                        activeOpacity={0.8}
                        style={styles.logoCard}
                      >
                        <Image source={{ uri: associate.logoUrl }} style={styles.logoImage} />
                        <Text style={styles.logoText}>
                          {typeof associate.name === "string"
                            ? associate.name
                            : associate.name[lang] || associate.name.en}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={mapModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMapModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMapModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Location Map</Text>
            <Image
              source={{ uri: mapImageUrl }}
              style={{ width: "100%", height: 300 }}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  gamesSection: {
    marginBottom: 24,
  },
  noGamesText: {
    fontSize: 16,
    color: colors.text.tertiary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
  },
  alreadyRegisteredText: {
    fontSize: 16,
    fontStyle: "italic",
    color: colors.text.secondary,
    textAlign: "center",
    marginVertical: 8,
  },
  registrationSection: {
    marginBottom: 24,
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
  linkText: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  sponsorSection: {
    marginTop: 32,
  },
  sponsorBlock: {
    marginBottom: 24,
  },
  logoCard: {
    width: 100,
    marginRight: 16,
    alignItems: "center",
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 12,
    textAlign: "center",
    color: colors.text.secondary,
  },
});
