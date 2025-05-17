import React from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  ViewStyle,
  TextStyle
} from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface CheckBoxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  checked,
  onPress,
  style,
  labelStyle,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Check size={16} color="white" />}
      </View>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 16,
    color: colors.text.primary,
  },
});