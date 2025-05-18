import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { 
  Heart, 
  Calendar, 
  Users, 
  Globe, 
  Mail, 
  ExternalLink 
} from "lucide-react-native";

export default function AmChaTSScreen() {
  const { language } = useAuthStore();
  
  const handleDonate = () => {
    Linking.openURL("https://www.amchats.org/donate");
  };
  
  const handleEmail = () => {
    Linking.openURL("mailto:info@amchats.org");
  };
  
  const handleWebsite = () => {
    Linking.openURL("https://www.amchats.org/");
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/logos/amchatslogo.png" }}
            style={styles.logo}
          />
          <View style={styles.headerContent}>
            <Text style={styles.title}>AmChaTS</Text>
            <Text style={styles.subtitle}>
              {language === "ta" ? "அமெரிக்க ஈகைத் தமிழ்ச் சமூகம்" : "American Charitable Tamil Society"}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "ta" ? "எங்களைப் பற்றி" : "About Us"}
          </Text>
          <Text style={styles.sectionText}>
            {language === "ta" 
              ? "AmChaTS (அமெரிக்க ஈகைத் தமிழ்ச் சமூகம்) என்பது அமெரிக்காவில் வாழும் தமிழ் மக்களுக்கான ஒரு இலாப நோக்கற்ற அமைப்பாகும். இது தமிழ் மொழி, பண்பாடு மற்றும் பாரம்பரியத்தை பாதுகாப்பதற்கும் மேம்படுத்துவதற்கும் அர்ப்பணிக்கப்பட்டுள்ளது."
              : "AmChaTS (American Charitable Tamil Society) is a non-profit organization for Tamil people living in the United States. It is dedicated to preserving and promoting Tamil language, culture, and heritage."}
          </Text>
          <Text style={styles.sectionText}>
            {language === "ta" 
              ? "நாங்கள் பண்பாட்டு நிகழ்வுகள், மொழி வகுப்புகள், சமூக சேவை திட்டங்கள் மற்றும் பாரம்பரிய கொண்டாட்டங்களை ஏற்பாடு செய்கிறோம். எங்கள் குறிக்கோள் அமெரிக்காவில் வாழும் தமிழ் சமூகத்தை ஒன்றிணைப்பது மற்றும் எங்கள் அடுத்த தலைமுறையினருக்கு எங்கள் பாரம்பரியத்தை கடத்துவதாகும்."
              : "We organize cultural events, language classes, community service projects, and traditional celebrations. Our mission is to unite the Tamil community living in the United States and pass on our heritage to our next generation."}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "ta" ? "நிகழ்வுகள் & செயல்பாடுகள்" : "Events & Activities"}
          </Text>
          
          {/* <View style={styles.activityItem}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {language === "ta" ? "பொங்கல் விழா" : "Pongal Festival"}
              </Text>
              <Text style={styles.activityDescription}>
                {language === "ta" 
                  ? "வருடாந்திர அறுவடை திருவிழா கொண்டாட்டம்" 
                  : "Annual harvest festival celebration"}
              </Text>
            </View>
          </View> */}
          
          {/* <View style={styles.activityItem}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {language === "ta" ? "தமிழ் புத்தாண்டு" : "Tamil New Year"}
              </Text>
              <Text style={styles.activityDescription}>
                {language === "ta" 
                  ? "தமிழ் புத்தாண்டு கொண்டாட்டங்கள் மற்றும் பண்பாட்டு நிகழ்ச்சிகள்" 
                  : "Tamil New Year celebrations and cultural performances"}
              </Text>
            </View>
          </View> */}
          
          <View style={styles.activityItem}>
            <Users size={24} color={colors.primary} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {language === "ta" ? "தமிழ் மொழி வகுப்புகள்" : "Tamil Language Classes"}
              </Text>
              <Text style={styles.activityDescription}>
                {language === "ta" 
                  ? "குழந்தைகள் மற்றும் பெரியவர்களுக்கான வாராந்திர தமிழ் மொழி வகுப்புகள்" 
                  : "Weekly Tamil language classes for children and adults"}
              </Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {language === "ta" ? "ஓடி விளையாடு" : "Odi Vilaiyaadu"}
              </Text>
              <Text style={styles.activityDescription}>
                {language === "ta" 
                  ? "குழந்தைகளுக்கான பாரம்பரிய தமிழ் விளையாட்டுகள்" 
                  : "Traditional Tamil games for children"}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "ta" ? "நன்கொடை" : "Donate"}
          </Text>
          <Text style={styles.sectionText}>
            {language === "ta" 
              ? "உங்கள் நன்கொடை எங்கள் பண்பாட்டு நிகழ்வுகள், மொழி வகுப்புகள் மற்றும் சமூக முயற்சிகளை ஆதரிக்க உதவும். நாங்கள் ஒரு இலாப நோக்கற்ற அமைப்பு, மேலும் உங்கள் பங்களிப்புகள் வரி விலக்கு பெற்றவை."
              : "Your donations help support our cultural events, language classes, and community initiatives. We are a non-profit organization, and your contributions are tax-deductible."}
          </Text>
          <Button 
            title={language === "ta" ? "இப்போது நன்கொடை அளிக்கவும்" : "Donate Now"}
            onPress={handleDonate}
            icon={<Heart size={16} color="white" />}
            style={styles.donateButton}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "ta" ? "தொடர்பு கொள்ளவும்" : "Contact Us"}
          </Text>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleEmail}
            activeOpacity={0.7}
          >
            <Mail size={24} color={colors.primary} />
            <Text style={styles.contactText}>info@amchats.org</Text>
            <ExternalLink size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleWebsite}
            activeOpacity={0.7}
          >
            <Globe size={24} color={colors.primary} />
            <Text style={styles.contactText}>www.amchats.org</Text>
            <ExternalLink size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.joinSection}>
          <Text style={styles.joinTitle}>
            {language === "ta" ? "எங்களுடன் இணையுங்கள்!" : "Join Us!"}
          </Text>
          <Text style={styles.joinText}>
            {language === "ta" 
              ? "AmChaTS குடும்பத்தில் இணைந்து, தமிழ் பண்பாட்டைப் பாதுகாக்கவும் கொண்டாடவும் உதவுங்கள்." 
              : "Join the AmChaTS family and help preserve and celebrate Tamil culture."}
          </Text>
          <Button 
            title={language === "ta" ? "உறுப்பினராக‌" : "Become a Member"}
            onPress={handleWebsite}
            style={styles.joinButton}
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "contain",
  },
  headerContent: {
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  donateButton: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 12,
    flex: 1,
  },
  joinSection: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    alignItems: "center",
  },
  joinTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  joinText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  joinButton: {
    minWidth: 200,
  },
});