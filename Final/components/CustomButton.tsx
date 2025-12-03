// src/components/CustomButton.tsx

import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
// Adjust path to your ThemeContext

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary', 
  disabled = false 
}) => {
  const { theme } = useTheme();

  const getStyles = () => {
    let containerStyle: ViewStyle = {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      opacity: disabled ? 0.6 : 1,
    };
    
    let textStyleCombined: TextStyle = {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '700',
    };

    if (variant === 'secondary') {
      containerStyle = {
        ...containerStyle,
        backgroundColor: '#6FDB6F',
      };
    } else if (variant === 'outline') {
      containerStyle = {
        ...containerStyle,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      };
      textStyleCombined.color = theme.colors.primary;
    }

    return { containerStyle, textStyle: textStyleCombined };
  };

  const { containerStyle, textStyle: combinedTextStyle } = getStyles();

  return (
    <TouchableOpacity 
      style={[containerStyle, style]} 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[combinedTextStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;