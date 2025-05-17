import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image 
} from "react-native";
import { Child } from "@/types/user";
import { colors } from "@/constants/colors";
import { Edit, User } from "lucide-react-native";
import { divisions } from "@/constants/divisions";
import { useTranslation } from "@/i18n";

interface ChildCardProps {
  child: Child;
  onEdit?: () => void;
  onPress?: () => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ 
  child, 
  onEdit, 
  onPress 
}) => {
  const { language } = useTranslation();
  
  // Get division name based on language
  const getDivisionName = () => {
    const division = divisions[child.division];
    if (!division) return child.division;
    
    if (division.name && typeof division.name === "object") {
      return division.name[language] || division.name.en || child.division;
    }
    
    return division.name || child.division;
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {child.photoUrl ? (
            <Image source={{ uri: child.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={24} color={colors.text.tertiary} />
            </View>
          )}
        </View>
        
        <View style={styles.info}>
          <Text style={styles.name}>{child.name}</Text>
          <Text style={styles.details}>
            {child.age} {language === "ta" ? "வயது" : "years"} • {getDivisionName()}
          </Text>
          
          {child.registeredGames && child.registeredGames.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {child.registeredGames.length} {language === "ta" ? "விளையாட்டுகள்" : "games"}
              </Text>
            </View>
          )}
        </View>
        
        {onEdit && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={onEdit}
          >
            <Edit size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  editButton: {
    padding: 8,
  },
});