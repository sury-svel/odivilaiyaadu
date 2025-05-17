import React from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { ExternalLink, Heart, School } from "lucide-react-native";

export default function InfoScreen() {
  const router = useRouter();
  const { language } = useAuthStore();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === "ta" ? "தகவல்" : "Information"}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/logos/amchatslogo.png" }}
              style={styles.logo}
            />
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>AmChaTS</Text>
              <Text style={styles.cardSubtitle}>
                {language === "ta" ? "அமெரிக்க ஈகைத் தமிழ்ச் சமூகம்" : "American Charitable Tamil Society"}
              </Text>
            </View>
          </View>
          
          <Text style={styles.cardDescription}>
            {language === "ta" 
              ? "AmChaTS என்பது அமெரிக்காவில் உள்ள தமிழ் சமூகத்தை ஒன்றிணைக்கும் ஒரு அமைப்பாகும். இது பண்பாடு நிகழ்வுகள், மொழி வகுப்புகள் மற்றும் சமூக சேவைகளை வழங்குகிறது."
              : "AmChaTS is an organization that brings together the Tamil community in the United States. It provides cultural events, language classes, and community services."}
          </Text>
          
          <View style={styles.cardActions}>
            <Button 
              title={language === "ta" ? "மேலும் அறிக" : "Learn More"}
              onPress={() => router.push("/info/amchats")}
              variant="outline"
              style={styles.cardButton}
            />
            <Button 
              title={language === "ta" ? "நன்கொடை" : "Donate"}
              onPress={() => {}}
              icon={<Heart size={16} color="white" />}
              style={styles.cardButton}
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/logos/apslogo.png" }}
              style={styles.logo}
            />
            <View style={styles.cardHeaderContent}>
              <Text style={styles.cardTitle}>Avvaiyar Padasalai (APS)</Text>
              <Text style={styles.cardSubtitle}>
                {language === "ta" ? "ஔவையார் பாடசாலை" : "Avvaiyar Tamil School"}
              </Text>
            </View>
          </View>
          
          <Text style={styles.cardDescription}>
            {language === "ta" 
              ? "ஔவையார் பாடசாலை (APS) என்பது அமெரிக்காவில் உள்ள குழந்தைகளுக்கு தமிழ் மொழி, பண்பாடு மற்றும் பாரம்பரியத்தை கற்பிக்கும் ஒரு தமிழ் பள்ளியாகும்."
              : "Avvaiyar Padasalai (APS) is a Tamil school that teaches Tamil language, culture, and heritage to children in the United States."}
          </Text>
          
          <View style={styles.cardActions}>
            <Button 
              title={language === "ta" ? "மேலும் அறிக" : "Learn More"}
              onPress={() => router.push("/info/aps")}
              variant="outline"
              style={styles.cardButton}
            />
            <Button 
              title={language === "ta" ? "பதிவு செய்க" : "Register"}
              onPress={() => {}}
              icon={<School size={16} color="white" />}
              style={styles.cardButton}
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {language === "ta" ? "ஓடி விளையாடு" : "Odi Vilayaadu"}
          </Text>
          
          <Text style={styles.cardDescription}>
            {language === "ta" 
              ? "ஓடி விளையாடு என்பது AmChaTS மற்றும் ஔவையார் பாடசாலை (APS) ஆல் ஏற்பாடு செய்யப்பட்ட ஒரு வருடாந்திர பாரம்பரிய குழந்தைகள் விளையாட்டு நிகழ்வாகும். இது பம்பரம், கோலி குண்டு, கிட்டி புல், நொண்டி ஓட்டம், சாக்கு ஓட்டம், எலுமிச்சை ஓட்டம், வில் அம்பு, உந்தி வில், உரியடி போன்ற பாரம்பரிய விளையாட்டுகளை உள்ளடக்கியது."
              : "Odi Vilayaadu is an annual traditional kids' games event organized by AmChaTS and Avvaiyar Padasalai (APS). It features traditional games like Pambaram, Kolli Gundu, Kitti Pull, Nondi Ottam, Saakku Ottam, Elumichai Ottam, Vilambu, Undi Vil, Uriyadi, and more."}
          </Text>
          
          <View style={styles.gameImages}>
            <Image
              source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/pamparam.jpg" }}
              style={styles.gameImage}
            />
            <Image
              source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/vilambu.jpg" }}
              style={styles.gameImage}
            />
            <Image
              source={{ uri: "https://odi-vilayaadu-public-assets.s3.us-east-2.amazonaws.com/games/gilli.jpg" }}
              style={styles.gameImage}
            />
          </View>
          
          <Button 
            title={language === "ta" ? "நிகழ்வுகளைக் காண்க" : "View Events"}
            onPress={() => router.push("/events")}
            style={styles.viewEventsButton}
          />
        </View>
        
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>
            {language === "ta" ? "தொடர்பு கொள்ளவும்" : "Contact Us"}
          </Text>
          
          <Text style={styles.contactText}>
            {language === "ta" 
              ? "கேள்விகள் அல்லது கருத்துகளுக்கு, எங்களை தொடர்பு கொள்ளவும்:" 
              : "For questions or feedback, contact us at:"}
          </Text>
          
          <TouchableOpacity style={styles.contactLink} activeOpacity={0.7}>
            <Text style={styles.contactLinkText}>info@odivilayaadu.org</Text>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
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
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardHeaderContent: {
    marginLeft: 12,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  cardButton: {
    flex: 1,
  },
  gameImages: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  gameImage: {
    flex: 1,
    height: 80,
    borderRadius: 8,
  },
  viewEventsButton: {
    marginTop: 8,
  },
  contactCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    textAlign: "center",
  },
  contactLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  contactLinkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
});