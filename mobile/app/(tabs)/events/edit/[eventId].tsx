import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useEventsStore } from "@/store/events-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { Calendar, MapPin, Info, Image as ImageIcon, X } from "lucide-react-native";
import { useTranslation } from "@/i18n";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDateString } from "@/utils/event";

export default function EditEventScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, updateEventDetails } = useEventsStore();
  const { t, language } = useTranslation();
  
  const event = events.find(e => e.id === eventId);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    nameTa: "",
    description: "",
    descriptionEn: "",
    descriptionTa: "",
    date: new Date(),
    locationName: "",
    locationAddress: "",
    imageUrl: "",
  });
  
  useEffect(() => {
    if (event) {
      // Initialize form data from event
      const nameObj = typeof event.name === "object" ? event.name : { en: event.name, ta: event.name };
      const descObj = typeof event.description === "object" 
        ? event.description 
        : { en: event.description, ta: event.description };
      
      setFormData({
        name: typeof event.name === "string" ? event.name : "",
        nameEn: nameObj.en || "",
        nameTa: nameObj.ta || "",
        description: typeof event.description === "string" ? event.description : "",
        descriptionEn: descObj.en || "",
        descriptionTa: descObj.ta || "",
        date: new Date(event.date),
        locationName: typeof event.location === "object" ? event.location.en : event.location,
        locationAddress: typeof event.location === "object" ? event.location.ta : event.location,
        imageUrl: event.imageUrl || "",
      });
    }
  }, [event]);
  
  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedTitle}>
            {t("common.unauthorized")}
          </Text>
          <Text style={styles.unauthorizedText}>
            {t("common.adminOnly")}
          </Text>
          <Button 
            title={t("common.goBack")} 
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }
  
  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            {t("events.notFound")}
          </Text>
          <Button 
            title={t("common.goBack")} 
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Prepare data for update
      const updatedEvent = {
        name: {
          en: formData.nameEn || formData.name,
          ta: formData.nameTa || formData.name
        },
        description: {
          en: formData.descriptionEn || formData.description,
          ta: formData.descriptionTa || formData.description
        },
        date: formData.date.toISOString(),
        location: {
          en: formData.locationName,
          ta: formData.locationAddress
        },
        imageUrl: formData.imageUrl
      };
      
      const success = await updateEventDetails(event.id, updatedEvent);
      
      if (success) {
        Alert.alert(
          t("events.edit.success.title"),
          t("events.edit.success.message"),
          [
            { 
              text: t("common.ok"), 
              onPress: () => router.back() 
            }
          ]
        );
      } else {
        Alert.alert(
          t("events.edit.error.title"),
          t("events.edit.error.message")
        );
      }
    } catch (error) {
      Alert.alert(
        t("events.edit.error.title"),
        t("events.edit.error.message")
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    }
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: t("events.edit.title") }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {formData.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: formData.imageUrl }} 
              style={styles.image}
            />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
            >
              <X size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <ImageIcon size={40} color={colors.text.tertiary} />
            <Text style={styles.imagePlaceholderText}>
              {t("events.edit.addImage")}
            </Text>
          </View>
        )}
        
        <View style={styles.form}>
          <TextInput
            label={t("events.edit.imageUrl")}
            value={formData.imageUrl}
            onChangeText={(text) => setFormData(prev => ({ ...prev, imageUrl: text }))}
            placeholder="https://example.com/image.jpg"
          />
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("events.edit.basicInfo")}</Text>
          </View>
          
          <TextInput
            label={`${t("events.fields.name")} (${t("language.english")})`}
            value={formData.nameEn}
            onChangeText={(text) => setFormData(prev => ({ ...prev, nameEn: text }))}
            placeholder={t("events.placeholders.name")}
          />
          
          <TextInput
            label={`${t("events.fields.name")} (${t("language.tamil")})`}
            value={formData.nameTa}
            onChangeText={(text) => setFormData(prev => ({ ...prev, nameTa: text }))}
            placeholder={t("events.placeholders.name")}
          />
          
          <View style={styles.datePickerContainer}>
            <Text style={styles.inputLabel}>{t("events.fields.date")}</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={colors.text.tertiary} />
              <Text style={styles.dateText}>{formatDateString(formData.date)}</Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={formData.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("events.edit.location")}</Text>
          </View>
          
          <TextInput
            label={t("events.fields.locationName")}
            value={formData.locationName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, locationName: text }))}
            placeholder={t("events.placeholders.locationName")}
            leftIcon={<MapPin size={20} color={colors.text.tertiary} />}
          />
          
          <TextInput
            label={t("events.fields.locationAddress")}
            value={formData.locationAddress}
            onChangeText={(text) => setFormData(prev => ({ ...prev, locationAddress: text }))}
            placeholder={t("events.placeholders.locationAddress")}
            multiline
            numberOfLines={3}
            style={{ height: 80 }}
          />
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("events.edit.description")}</Text>
          </View>
          
          <TextInput
            label={`${t("events.fields.description")} (${t("language.english")})`}
            value={formData.descriptionEn}
            onChangeText={(text) => setFormData(prev => ({ ...prev, descriptionEn: text }))}
            placeholder={t("events.placeholders.description")}
            multiline
            numberOfLines={5}
            style={{ height: 120 }}
          />
          
          <TextInput
            label={`${t("events.fields.description")} (${t("language.tamil")})`}
            value={formData.descriptionTa}
            onChangeText={(text) => setFormData(prev => ({ ...prev, descriptionTa: text }))}
            placeholder={t("events.placeholders.description")}
            multiline
            numberOfLines={5}
            style={{ height: 120 }}
          />
          
          <View style={styles.infoBox}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              {t("events.edit.infoText")}
            </Text>
          </View>
          
          <Button 
            title={t("common.save")}
            onPress={handleSave}
            style={styles.saveButton}
            isLoading={isLoading}
          />
          
          <Button 
            title={t("common.cancel")}
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
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
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.text.tertiary,
  },
  form: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 12,
    flex: 1,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 0,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
});