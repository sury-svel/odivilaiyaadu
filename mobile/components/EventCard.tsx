import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Image 
} from "react-native";
import { useRouter } from "expo-router";

import { Event } from "@/types/event";
import { colors } from "@/constants/colors";
import { Calendar, MapPin, Users } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import { tr, getUiLanguage } from "@/utils/i18n"; 
import { formatDateString } from "@/utils/event";

interface EventCardProps {
  event: Event;
  compact?: boolean;
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, compact, onPress }) => {
  // const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = getUiLanguage(i18n);
  
  // const handlePress = () => {
  //   router.push(`/events/${event.id}`);
  // };
  
  const getStatusColor = (status: Event["status"]) => {
    if (status === "active") {
      return colors.success;
    } else if (status === "upcoming" ) {
      return colors.warning;
    } else if (status === "past") {
      return colors.text.tertiary;
    } else {
      return colors.text.tertiary;
    }
  };


  // Use Pressable so we can handle taps when onPress is provided
  const Container = onPress ? Pressable : View;
  
  return (
    <Container 
      style={[styles.container, compact && styles.compactContainer]}
      onPress={onPress}
      android_ripple={onPress ? { color: colors.border } : undefined}
    >
      {!compact && (
        <Image 
          source={{ uri: event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500" }} 
          style={styles.image}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{tr(event.name, lang)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Calendar size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{formatDateString(event.date)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.text.secondary} />
          <Text style={styles.infoText}>{tr(event.venueName, lang)}</Text>
        </View>
        {/*
        {event.registeredParticipants && (
          <View style={styles.infoRow}>
            <Users size={16} color={colors.text.secondary} />
            <Text style={styles.infoText}>
              {t("events.registeredCount", { count: event.registeredParticipants.length })}
            </Text>
          </View>
        )}
        */}
      </View>
    </Container>
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