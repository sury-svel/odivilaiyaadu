import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { useChildrenStore } from "@/store/children-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { User, School, Image as ImageIcon } from "lucide-react-native";
import { divisions, Division } from "@/constants/divisions";
import { t } from "@/i18n";

export default function AddChildScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { addChild, isLoading } = useChildrenStore();
  
  const [formData, setFormData] = React.useState({
    name: "",
    age: "",
    gender: "male" as "male" | "female" | "other",
    tamilSchool: "",
    tamilGrade: "",
    medicalInfo: "",
    photoUrl: "",
    division: "arumbu" as Division,
  });
  
  const [errors, setErrors] = React.useState({
    name: "",
    age: "",
    tamilSchool: "",
    tamilGrade: "",
    medicalInfo: "",
  });

  React.useEffect(() => {
    // Redirect if not authenticated or not a parent
    if (!isAuthenticated || user?.role !== "parent") {
      Alert.alert(
        t("profile.notLoggedIn.title"),
        t("profile.notLoggedIn.message"),
        [
          { 
            text: t("common.ok"), 
            onPress: () => router.replace("/auth/login") 
          }
        ]
      );
    }
  }, [isAuthenticated, user, router]);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      age: "",
      tamilSchool: "",
      tamilGrade: "",
      medicalInfo: "",
    };
    
    if (!formData.name) {
      newErrors.name = t("register.error.fullNameRequired");
      isValid = false;
    }
    
    if (!formData.age) {
      newErrors.age = t("children.fields.age") + " " + t("register.error.fullNameRequired").toLowerCase();
      isValid = false;
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 4 || age > 13) {
        newErrors.age = t("children.fields.age") + " must be between 4 and 13";
        isValid = false;
      }
    }
    
    if (!formData.tamilSchool) {
      newErrors.tamilSchool = t("children.fields.tamilSchool") + " " + t("register.error.fullNameRequired").toLowerCase();
      isValid = false;
    }
    
    // if (!formData.tamilGrade) {
    //   newErrors.tamilGrade = t("children.fields.tamilGrade") + " " + t("register.error.fullNameRequired").toLowerCase();
    //   isValid = false;
    // }

    if (!formData.medicalInfo) {
      newErrors.medicalInfo = t("children.fields.medicalInfo") + " " + t("register.error.medicalInfoRequired").toLowerCase();
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  
  const handleAddChild = async () => {
    if (!validateForm()) return;
    console.info("Adding child...");
    // Determine division based on age
    const age = parseInt(formData.age);
    let division: Division = "arumbu";
    
    if (age >= 1 && age <= 3) {
      division = "mazhalai";
    } else if (age >= 4 && age <= 6) {
      division = "arumbu";
    } else if (age >= 7 && age <= 9) {
      division = "mottu";
    } else if (age >= 10 && age <= 12) {
      division = "mugai";
    } else if (age >= 13 && age <= 15) {
      division = "malar";
    }
    
    const success = await addChild({
      ...formData,
      age: parseInt(formData.age),
      division,
      parentId: user?.id || "",
      results: []
    });
    
    if (success) {
      Alert.alert(
        t("common.success"),
        t("children.addSuccess"),
        [
          { 
            text: t("common.ok"), 
            onPress: () => router.replace("/(tabs)/parent") 
          }
        ]
      );
    } else {
      console.warn("Adding child error...");
      // Alert.alert(
      //   t("common.error"),
      //   t("register.error.message"),
      //   [{ text: t("common.ok") }]
      // );
    }
  };
  
  // Sample profile images for demo
  const sampleImages = [
    "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/avatars/tamilboy1.png",
    "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/avatars/tamilgirl1.png",
    "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/avatars/tamilboy2.png",
    "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/avatars/tamilgirl2.png",
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: t("children.add") }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("children.add")}</Text>
          <Text style={styles.subtitle}>{t("children.addPrompt")}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>{t("children.fields.photo")}</Text>

            <View style={styles.photoPreview}>
              {formData.photoUrl ? (
                <Image
                  source={{ uri: formData.photoUrl }}
                  style={styles.selectedPhoto}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <ImageIcon size={32} color={colors.text.tertiary} />
                </View>
              )}
            </View>

            <View style={styles.samplePhotos}>
              {sampleImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.samplePhoto,
                    formData.photoUrl === image && styles.selectedSamplePhoto,
                  ]}
                  onPress={() => setFormData({ ...formData, photoUrl: image })}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.samplePhotoImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            label={t("children.fields.name")}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder={t("register.placeholders.fullName")}
            leftIcon={<User size={20} color={colors.text.tertiary} />}
            error={errors.name}
          />

          <TextInput
            label={t("children.fields.age")}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            placeholder="4-13"
            keyboardType="number-pad"
            leftIcon={<User size={20} color={colors.text.tertiary} />}
            error={errors.age}
          />

          <View style={styles.genderSelector}>
            <Text style={styles.genderLabel}>
              {t("children.fields.gender")}
            </Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === "male" && styles.activeGenderButton,
                ]}
                onPress={() => setFormData({ ...formData, gender: "male" })}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    formData.gender === "male" && styles.activeGenderButtonText,
                  ]}
                >
                  {t("children.genders.male")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === "female" && styles.activeGenderButton,
                ]}
                onPress={() => setFormData({ ...formData, gender: "female" })}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    formData.gender === "female" &&
                      styles.activeGenderButtonText,
                  ]}
                >
                  {t("children.genders.female")}
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === "other" && styles.activeGenderButton,
                ]}
                onPress={() => setFormData({ ...formData, gender: "other" })}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    formData.gender === "other" &&
                      styles.activeGenderButtonText,
                  ]}
                >
                  {t("children.genders.other")}
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>

          <TextInput
            label={t("children.fields.tamilSchool")}
            value={formData.tamilSchool}
            onChangeText={(text) =>
              setFormData({ ...formData, tamilSchool: text })
            }
            placeholder={t("children.fields.tamilSchool")}
            leftIcon={<School size={20} color={colors.text.tertiary} />}
            error={errors.tamilSchool}
          />

          {/* <TextInput
            label={t("children.fields.tamilGrade")}
            value={formData.tamilGrade}
            onChangeText={(text) =>
              setFormData({ ...formData, tamilGrade: text })
            }
            placeholder={t("children.fields.tamilGrade")}
            leftIcon={<School size={20} color={colors.text.tertiary} />}
            error={errors.tamilGrade}
          /> */}

          <TextInput
            label={t("children.fields.medicalInfo")}
            value={formData.medicalInfo}
            onChangeText={(text) =>
              setFormData({ ...formData, medicalInfo: text })
            }
            placeholder={t("children.fields.medicalInfo")}
            leftIcon={<School size={20} color={colors.text.tertiary} />}
            error={errors.medicalInfo}
          />

          <View style={styles.divisionInfo}>
            <Text style={styles.divisionTitle}>
              {t("children.divisionInfo")}
            </Text>
            <View style={styles.divisionsList}>
              {Object.values(divisions).map((division) => (
                <View key={division.id} style={styles.divisionItem}>
                  <Text style={styles.divisionName}>{division.name.en}</Text>
                  <Text style={styles.divisionAge}>{division.ageRange.en}</Text>
                </View>
              ))}
            </View>
          </View>

          <Button
            title={t("children.add")}
            onPress={handleAddChild}
            style={styles.addButton}
            isLoading={isLoading}
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  form: {
    marginBottom: 32,
  },
  photoSection: {
    marginBottom: 16,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: 8,
  },
  photoPreview: {
    alignItems: "center",
    marginBottom: 16,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  selectedPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  samplePhotos: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  samplePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedSamplePhoto: {
    borderColor: colors.primary,
  },
  samplePhotoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  genderSelector: {
    marginBottom: 16,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.secondary,
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  activeGenderButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  activeGenderButtonText: {
    color: "white",
  },
  divisionInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  divisionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 12,
  },
  divisionsList: {
    gap: 8,
  },
  divisionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  divisionName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  divisionAge: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  addButton: {
    marginTop: 8,
  },
});