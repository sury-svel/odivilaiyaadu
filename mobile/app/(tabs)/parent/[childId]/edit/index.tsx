import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useChildrenStore } from "@/store/children-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { CheckBox } from "@/components/CheckBox";
import { useTranslation } from "@/i18n";

export default function EditChildScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { children, updateChild } = useChildrenStore();
  const { t } = useTranslation();
  
  const child = children.find(c => c.id === id);
  
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    tamilSchool: "",
    tamilGrade: "",
    medicalInfo: "",
    notes: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (child) {
      setForm({
        name: child.name || "",
        dateOfBirth: child.dateOfBirth || "",
        gender: child.gender || "",
        tamilSchool: child.tamilSchool || "",
        tamilGrade: child.tamilGrade || "",
        medicalInfo: child.medicalInfo || "",
        notes: child.notes || "",
      });
    }
  }, [child]);
  
  if (!child) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            {t("children.notFound")}
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
  
  // Check if user is the parent of this child
  const isParent = user?.id === child.parentId;
  
  if (!isParent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            {t("common.unauthorized")}
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
  
  const handleChange = (name: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGenderChange = (gender: string) => {
    setForm(prev => ({
      ...prev,
      gender
    }));
  };
  
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }
    
    if (!form.dateOfBirth.trim()) {
      Alert.alert("Error", "Date of birth is required");
      return;
    }
    
    if (!form.gender) {
      Alert.alert("Error", "Gender is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await updateChild(id, {
        name: form.name,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        tamilSchool: form.tamilSchool,
        tamilGrade: form.tamilGrade,
        medicalInfo: form.medicalInfo,
        notes: form.notes,
      });
      
      if (success) {
        Alert.alert("Success", "Child information updated successfully");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update child information");
      }
    } catch (error) {
      console.error("Error updating child:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: t("children.editChild") }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("children.personalInfo")}</Text>
            
            <TextInput
              label={t("common.name")}
              value={form.name}
              onChangeText={(value) => handleChange("name", value)}
              placeholder={t("common.name")}
            />
            
            <TextInput
              label={t("children.fields.dateOfBirth")}
              value={form.dateOfBirth}
              onChangeText={(value) => handleChange("dateOfBirth", value)}
              placeholder="YYYY-MM-DD"
            />
            
            <Text style={styles.label}>{t("children.fields.gender")}</Text>
            <View style={styles.genderContainer}>
              <CheckBox
                label={t("children.genders.male")}
                checked={form.gender === "male"}
                onPress={() => handleGenderChange("male")}
              />
              <CheckBox
                label={t("children.genders.female")}
                checked={form.gender === "female"}
                onPress={() => handleGenderChange("female")}
              />
              <CheckBox
                label={t("children.genders.other")}
                checked={form.gender === "other"}
                onPress={() => handleGenderChange("other")}
              />
            </View>
            
            <TextInput
              label={t("children.fields.tamilSchool")}
              value={form.tamilSchool}
              onChangeText={(value) => handleChange("tamilSchool", value)}
              placeholder={t("children.fields.tamilSchool")}
            />
            
            <TextInput
              label={t("children.fields.tamilGrade")}
              value={form.tamilGrade}
              onChangeText={(value) => handleChange("tamilGrade", value)}
              placeholder={t("children.fields.tamilGrade")}
            />
            
            <TextInput
              label={t("children.fields.medicalInfo")}
              value={form.medicalInfo}
              onChangeText={(value) => handleChange("medicalInfo", value)}
              placeholder={t("children.fields.medicalInfo")}
              multiline
              numberOfLines={3}
            />
            
            <TextInput
              label={t("children.fields.notes")}
              value={form.notes}
              onChangeText={(value) => handleChange("notes", value)}
              placeholder={t("children.fields.notes")}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.actions}>
            <Button 
              title={t("common.cancel")}
              onPress={() => router.back()}
              variant="outline"
              style={styles.actionButton}
            />
            <Button 
              title={t("common.save")}
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.actionButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
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