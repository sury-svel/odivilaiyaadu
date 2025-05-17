import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { divisions } from "@/constants/divisions";
import { scoringTypes } from "@/constants/scoring";
import { CheckBox } from "@/components/CheckBox";
import { Save } from "lucide-react-native";

export default function EditGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { language, isAuthenticated, user } = useAuthStore();
  const { games } = useEventsStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [nameEn, setNameEn] = useState("");
  const [nameTa, setNameTa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionTa, setDescriptionTa] = useState("");
  const [location, setLocation] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scoringType, setScoringType] = useState<string>("");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  
  // Load game data
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const game = games.find(g => g.id === id);
      
      if (game) {
        // Handle name which could be string or object
        if (typeof game.name === "object") {
          setNameEn(game.name.en || "");
          setNameTa(game.name.ta || "");
        } else {
          setNameEn(game.name || "");
          setNameTa(game.name || "");
        }
        
        // Handle description which could be string or object
        if (typeof game.description === "object") {
          setDescriptionEn(game.description.en || "");
          setDescriptionTa(game.description.ta || "");
        } else {
          setDescriptionEn(game.description || "");
          setDescriptionTa(game.description || "");
        }
        
        setLocation(game.location || "");
        setMaxPlayers(game.maxPlayers ? game.maxPlayers.toString() : "20");
        setImageUrl(game.imageUrl || "");
        setScoringType(game.scoringType || "points");
        setSelectedDivisions(game.divisions || []);
      }
      
      setIsLoading(false);
    }
  }, [id, games]);
  
  // Check authorization
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedTitle}>
            {language === "ta" ? "அணுகல் மறுக்கப்பட்டது" : "Access Denied"}
          </Text>
          <Text style={styles.unauthorizedText}>
            {language === "ta" 
              ? "இந்தப் பக்கத்தை அணுக நீங்கள் நிர்வாகியாக உள்நுழைய வேண்டும்." 
              : "You need to be logged in as an admin to access this page."}
          </Text>
          <Button 
            title={language === "ta" ? "உள்நுழைவு" : "Login"} 
            onPress={() => router.push("/(modal)/auth/login")}
            style={styles.loginButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const toggleDivision = (divisionId: string) => {
    if (selectedDivisions.includes(divisionId)) {
      setSelectedDivisions(selectedDivisions.filter(id => id !== divisionId));
    } else {
      setSelectedDivisions([...selectedDivisions, divisionId]);
    }
  };
  
  /*
  const handleSave = async () => {
    // Validate form
    if (!nameEn || !nameTa || !descriptionEn || !descriptionTa || !location || !maxPlayers || !scoringType) {
      Alert.alert(
        language === "ta" ? "தவறான உள்ளீடு" : "Invalid Input",
        language === "ta" 
          ? "அனைத்து புலங்களையும் நிரப்பவும்." 
          : "Please fill in all fields."
      );
      return;
    }
    
    if (selectedDivisions.length === 0) {
      Alert.alert(
        language === "ta" ? "தவறான உள்ளீடு" : "Invalid Input",
        language === "ta" 
          ? "குறைந்தது ஒரு பிரிவையாவது தேர்ந்தெடுக்கவும்." 
          : "Please select at least one division."
      );
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await updateGameDetails(id as string, {
        name: {
          en: nameEn,
          ta: nameTa
        },
        description: {
          en: descriptionEn,
          ta: descriptionTa
        },
        location,
        maxPlayers: parseInt(maxPlayers),
        imageUrl,
        scoringType,
        divisions: selectedDivisions
      });
      
      if (success) {
        Alert.alert(
          language === "ta" ? "வெற்றி" : "Success",
          language === "ta" 
            ? "விளையாட்டு விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன." 
            : "Game details updated successfully.",
          [
            {
              text: "OK",
              onPress: () => router.back()
            }
          ]
        );
      } else {
        throw new Error("Failed to update game details");
      }
    } catch (error) {
      Alert.alert(
        language === "ta" ? "பிழை" : "Error",
        language === "ta" 
          ? "விளையாட்டு விவரங்களைப் புதுப்பிப்பதில் பிழை ஏற்பட்டது." 
          : "An error occurred while updating game details."
      );
    } finally {
      setIsSaving(false);
    }
  };
  
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: language === "ta" ? "விளையாட்டைத் திருத்து" : "Edit Game" 
        }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {language === "ta" ? "ஏற்றுகிறது..." : "Loading..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  */
  return (
  
    <SafeAreaView style={styles.container}>
      {/*
      <Stack.Screen options={{ 
        title: language === "ta" ? "விளையாட்டைத் திருத்து" : "Edit Game",
        headerRight: () => (
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleSave} disabled={isSaving} style={styles.headerButton}>
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Save size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        ),
      }} />
      */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>
          {language === "ta" ? "விளையாட்டு விவரங்கள்" : "Game Details"}
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "பெயர் (ஆங்கிலம்)" : "Name (English)"}
          </Text>
          <TextInput
            value={nameEn}
            onChangeText={setNameEn}
            placeholder={language === "ta" ? "ஆங்கிலத்தில் பெயர்" : "Name in English"}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "பெயர் (தமிழ்)" : "Name (Tamil)"}
          </Text>
          <TextInput
            value={nameTa}
            onChangeText={setNameTa}
            placeholder={language === "ta" ? "தமிழில் பெயர்" : "Name in Tamil"}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "விளக்கம் (ஆங்கிலம்)" : "Description (English)"}
          </Text>
          <TextInput
            value={descriptionEn}
            onChangeText={setDescriptionEn}
            placeholder={language === "ta" ? "ஆங்கிலத்தில் விளக்கம்" : "Description in English"}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "விளக்கம் (தமிழ்)" : "Description (Tamil)"}
          </Text>
          <TextInput
            value={descriptionTa}
            onChangeText={setDescriptionTa}
            placeholder={language === "ta" ? "தமிழில் விளக்கம்" : "Description in Tamil"}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "இடம்" : "Location"}
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder={language === "ta" ? "விளையாட்டு இடம்" : "Game Location"}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "அதிகபட்ச வீரர்கள்" : "Maximum Players"}
          </Text>
          <TextInput
            value={maxPlayers}
            onChangeText={setMaxPlayers}
            placeholder={language === "ta" ? "அதிகபட்ச வீரர்கள்" : "Maximum Players"}
            keyboardType="number-pad"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "படம் URL" : "Image URL"}
          </Text>
          <TextInput
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder={language === "ta" ? "படம் URL" : "Image URL"}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "மதிப்பெண் வகை" : "Scoring Type"}
          </Text>
          <View style={styles.radioGroup}>
            {Object.entries(scoringTypes).map(([key, value]) => (
              <TouchableOpacity 
                key={key}
                style={styles.radioOption}
                onPress={() => setScoringType(key)}
              >
                <View style={[styles.radioButton, scoringType === key && styles.radioButtonSelected]}>
                  {scoringType === key && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioLabel}>{value.name[language] || value.name.en}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            {language === "ta" ? "பிரிவுகள்" : "Divisions"}
          </Text>
          <View style={styles.checkboxGroup}>
            {Object.entries(divisions).map(([key, value]) => (
              <CheckBox
                key={key}
                label={`${value.name[language] || value.name.en} (${value.ageRange[language] || value.ageRange.en})`}
                checked={selectedDivisions.includes(key)}
                onPress={() => toggleDivision(key)}
              />
            ))}
          </View>
        </View>
        
        <View style={styles.buttonGroup}>
          <Button
            title={language === "ta" ? "ரத்து செய்" : "Cancel"}
            onPress={() => router.back()}
            variant="outline"
            style={styles.button}
          />
          {/**
          <Button
            title={language === "ta" ? "சேமி" : "Save"}
            onPress={handleSave}
            style={styles.button}
            isLoading={isSaving}
          />
           */}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  radioGroup: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  checkboxGroup: {
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
  unauthorizedContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  unauthorizedTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  unauthorizedText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    minWidth: 200,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
  },
  dangerZone: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.danger,
    marginBottom: 8,
  },
  dangerZoneDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },

});