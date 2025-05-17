import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View
} from "react-native";
import { colors } from "@/constants/colors";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text" | "danger";
export type ButtonSize    = "small" | "medium" | "large";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  leftIcon,
  rightIcon,
  iconPosition = "left",
  ...rest
}) => {
  const getContainerStyle = (): ViewStyle => {
    let containerStyle: ViewStyle = styles.container;
    
    // Add variant styles
    if (variant === "primary") {
      containerStyle = { ...containerStyle, ...styles.primaryContainer };
    } else if (variant === "secondary") {
      containerStyle = { ...containerStyle, ...styles.secondaryContainer };
    } else if (variant === "outline") {
      containerStyle = { ...containerStyle, ...styles.outlineContainer };
    } else if (variant === "text") {
      containerStyle = { ...containerStyle, ...styles.textContainer };
    } else if (variant === "danger") {
      containerStyle = { ...containerStyle, ...styles.dangerContainer };
    }
    
    // Add size styles
    if (size === "small") {
      containerStyle = { ...containerStyle, ...styles.smallContainer };
    } else if (size === "medium") {
      containerStyle = { ...containerStyle, ...styles.mediumContainer };
    } else if (size === "large") {
      containerStyle = { ...containerStyle, ...styles.largeContainer };
    }
    
    // Add disabled style
    if (disabled || isLoading) {
      containerStyle = { ...containerStyle, ...styles.disabledContainer };
    }
    
    // Add custom style
    if (style) {
      containerStyle = { ...containerStyle, ...style };
    }
    
    return containerStyle;
  };
  
  const getTextStyle = (): TextStyle => {
    let textStyleObj: TextStyle = styles.text;
    
    // Add variant styles
    if (variant === "primary") {
      textStyleObj = { ...textStyleObj, ...styles.primaryText };
    } else if (variant === "secondary") {
      textStyleObj = { ...textStyleObj, ...styles.secondaryText };
    } else if (variant === "outline") {
      textStyleObj = { ...textStyleObj, ...styles.outlineText };
    } else if (variant === "text") {
      textStyleObj = { ...textStyleObj, ...styles.textOnlyText };
    } else if (variant === "danger") {
      textStyleObj = { ...textStyleObj, ...styles.dangerText };
    }
    
    // Add size styles
    if (size === "small") {
      textStyleObj = { ...textStyleObj, ...styles.smallText };
    } else if (size === "medium") {
      textStyleObj = { ...textStyleObj, ...styles.mediumText };
    } else if (size === "large") {
      textStyleObj = { ...textStyleObj, ...styles.largeText };
    }
    
    // Add disabled style
    if (disabled) {
      textStyleObj = { ...textStyleObj, ...styles.disabledText };
    }
    
    // Add custom style
    if (textStyle) {
      textStyleObj = { ...textStyleObj, ...textStyle };
    }
    
    return textStyleObj;
  };
  
  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === "primary" || variant === "danger" ? "white" : colors.primary} 
        />
      ) : (
        <View style={styles.buttonContent}>
          {(leftIcon || (icon && iconPosition === "left")) && (
            <View style={styles.iconContainer}>
              {leftIcon || (icon && iconPosition === "left" ? icon : null)}
            </View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {(rightIcon || (icon && iconPosition === "right")) && (
            <View style={styles.iconContainer}>
              {rightIcon || (icon && iconPosition === "right" ? icon : null)}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary,
  },
  outlineContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textContainer: {
    backgroundColor: "transparent",
  },
  dangerContainer: {
    backgroundColor: colors.error,
  },
  smallContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mediumContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  largeContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  textOnlyText: {
    color: colors.primary,
  },
  dangerText: {
    color: "white",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.7,
  },
});