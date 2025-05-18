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
  School, 
  BookOpen, 
  Users, 
  Calendar, 
  Mail, 
  Globe,
  ExternalLink 
} from "lucide-react-native";

export default function APSScreen() {
  const { language } = useAuthStore();
  
  const handleRegister = () => {
    Linking.openURL("https://www.apsamerica.org/");
  };
  
  const handleEmail = () => {
    Linking.openURL("mailto:info@avvaiyarpadasalai.org");
  };
  
  const handleWebsite = () => {
    Linking.openURL("https://www.apsamerica.org/");
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/logos/apslogo.png" }}
            style={styles.logo}
          />
          <View style={styles.headerContent}>
            <Text style={styles.title}>Avvaiyar Padasalai (APS)</Text>
            <Text style={styles.subtitle}>
              {language === "ta" ? "ஔவையார் பாடசாலை" : "Avvaiyar Padasalai"}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "ta" ? "எங்களைப் பற்றி" : "About Us"}
          </Text>
          <Text style={styles.sectionText}>
            {language === "ta" 
              ? "ஔவையார் பாடசாலை (APS) உலகின் முதல் மெய் நிகர்த் தமிழ்ப்பள்ளி, தற்போது வட அமெரிக்காவில் உள்ள குழந்தைகளுக்கு தமிழ் மொழி, பண்பாடு மற்றும் பாரம்பரியத்தை கற்பிக்கும் ஒரு தமிழ் பள்ளியாகும். எங்கள் பள்ளி தமிழ் இலக்கியம், இலக்கணம், பாரம்பரிய கலைகள் மற்றும் பண்பாட்டு விழுமியங்களை கற்பிக்கிறது."
              : "Avvaiyar Padasalai (APS) is a Tamil school that teaches Tamil language, culture, and heritage to children in the United States. Our school teaches Tamil literature, grammar, traditional arts, and cultural values."}
          </Text>
          <Text style={styles.sectionText}>
            {language === "ta" 
              ? "எங்கள் பெயர் புகழ்பெற்ற தமிழ் கவிஞர் மற்றும் அறிஞர் ஔவையாரின் பெயரால் வைக்கப்பட்டது, அவர் கல்வியின் முக்கியத்துவத்தை வலியுறுத்தினார். எங்கள் குறிக்கோள் அடுத்த தலைமுறைக்கு தமிழ் மொழி மற்றும் பண்பாட்டை பாதுகாப்பது மற்றும் கடத்துவதாகும்."
              : "Our name is inspired by the famous Tamil poet and scholar Avvaiyar, who emphasized the importance of education. Our mission is to preserve and pass on the Tamil language and culture to the next generation."}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "ta" ? "எங்கள் வகுப்புகள்" : "Our Classes"}
          </Text>
          
          <View style={styles.classItem}>
            <BookOpen size={24} color={colors.primary} />
            <View style={styles.classContent}>
              <Text style={styles.classTitle}>
                {language === "ta" ? "தமிழ் மொழி" : "Tamil Language"}
              </Text>
              <Text style={styles.classDescription}>
                {language === "ta" 
                  ? "தமிழ் எழுத்துக்கள், சொற்கள், வாக்கியங்கள் மற்றும் உரையாடல்களைக் கற்றல்" 
                  : "Learning Tamil letters, words, sentences, and conversations"}
              </Text>
            </View>
          </View>
          
          <View style={styles.classItem}>
            <BookOpen size={24} color={colors.primary} />
            <View style={styles.classContent}>
              <Text style={styles.classTitle}>
                {language === "ta" ? "தமிழ் இலக்கியம்" : "Tamil Literature"}
              </Text>
              <Text style={styles.classDescription}>
                {language === "ta" 
                  ? "திருக்குறள், சிலப்பதிகாரம், தொல்காப்பியம் போன்ற பாரம்பரிய தமிழ் இலக்கியங்களைப் படித்தல்" 
                  : "Reading traditional Tamil literature like Thirukkural, Silapathikaram, Tholkappiyam"}
              </Text>
            </View>
          </View>
          
          <View style={styles.classItem}>
            <Users size={24} color={colors.primary} />
            <View style={styles.classContent}>
              <Text style={styles.classTitle}>
                {language === "ta" ? "மெய்நிகர் விளையாட்டுப் போட்டிகள்" : "Tamil Virtual Games"}
              </Text>
              <Text style={styles.classDescription}>
                {language === "ta" 
                  ? " தமிழ்த் தேனி, மாத்தியோசி, ககூட், மற்றும் திருக்குறள் போட்டிகள்" 
                  : "Tamil Theni, Maathi Yosi, Kahoot, and Kural Games"}
              </Text>
            </View>
          </View>
          
          <View style={styles.classItem}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.classContent}>
              <Text style={styles.classTitle}>
                {language === "ta" ? "பொங்கல் கொண்டாட்டங்கள்" : "Pongal Celebrations"}
              </Text>
              <Text style={styles.classDescription}>
                {language === "ta" 
                  ? "தமிழர் திருநாள் பொங்கல் பண்டிகை மற்றும் ஆண்டு விழாக்கள் கொண்டாடுதல்" 
                  : "Celebrating traditional Tamil festivals like Pongal, and Annual Day Celebrations"}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "ta" ? "பள்ளி பதிவு" : "School Registration"}
          </Text>
          <Text style={styles.sectionText}>
            {language === "ta" 
              ? "எங்கள் தமிழ் பள்ளியில் உங்கள் குழந்தையைப் பதிவு செய்ய, கீழே உள்ள பதிவு பொத்தானைத் தொடுக்கவும். "
              : "To register your child in our Tamil school, click the registration button below. "}
          </Text>
          <Button 
            title={language === "ta" ? "இப்போது பதிவு செய்யவும்" : "Register Now"}
            onPress={handleRegister}
            icon={<School size={16} color="white" />}
            style={styles.registerButton}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === "ta" ? "நிகழ்வுகள்" : "Events"}
          </Text>
          
          <View style={styles.eventItem}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>
                {language === "ta" ? "ஆண்டு விழா நிகழ்ச்சி" : "Annual Day Performance"}
              </Text>
              <Text style={styles.eventDescription}>
                {language === "ta" 
                  ? "மாணவர்கள் தங்கள் தமிழ் மொழித் திறன்களையும் கலாச்சாரக் கலைகளையும் காட்டும் ஆண்டு இறுதி நிகழ்ச்சி" 
                  : "Annual day performance where students showcase their Tamil language skills and cultural arts"}
              </Text>
            </View>
          </View>
          
          {/* <View style={styles.eventItem}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>
                {language === "ta" ? "ஓடி விளையாடு" : "Odi Vilaiyaadu"}
              </Text>
              <Text style={styles.eventDescription}>
                {language === "ta" 
                  ? "AmChaTS உடன் இணைந்து நடத்தப்படும் பாரம்பரிய தமிழ் விளையாட்டு நிகழ்வு" 
                  : "Traditional Tamil games event conducted in collaboration with AmChaTS"}
              </Text>
            </View>
          </View>
           */}
          <View style={styles.eventItem}>
            <Calendar size={24} color={colors.primary} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>
                {language === "ta" ? "பொங்கல் விழா" : "Pongal Festival"}
              </Text>
              <Text style={styles.eventDescription}>
                {language === "ta" 
                  ? "வருடாந்திர அறுவடை திருவிழா கொண்டாட்டம்" 
                  : "Annual harvest festival celebration"}
              </Text>
            </View>
          </View>
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
            <Text style={styles.contactText}>info@avvaiyarpadasalai.org</Text>
            <ExternalLink size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleWebsite}
            activeOpacity={0.7}
          >
            <Globe size={24} color={colors.primary} />
            <Text style={styles.contactText}>www.apsamerica.org</Text>
            <ExternalLink size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.joinSection}>
          <Text style={styles.joinTitle}>
            {language === "ta" ? "இன்றே சேருங்கள்!" : "Join Our Team!"}
          </Text>
          <Text style={styles.joinText}>
            {language === "ta" 
              ? "நம் குழந்தைகளுக்குத் தமிழ் மொழி மற்றும் பண்பாட்டைக் கற்பிக்க எங்களுடன் இணையுங்கள்." 
              : "Join with us as a volunteer to teach our children Tamil language and culture."}
          </Text>
          <Button 
            title={language === "ta" ? "இணையவும்" : "Join Us"}
            onPress={handleRegister}
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
  },
  headerContent: {
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
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
  classItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  classContent: {
    marginLeft: 12,
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  registerButton: {
    marginTop: 8,
  },
  eventItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  eventContent: {
    marginLeft: 12,
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.text.secondary,
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
    fontSize: 13,
    color: colors.text.tertiary,
    minWidth: 200,
  },
});