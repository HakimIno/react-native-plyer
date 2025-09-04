import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { getFontFamily } from '../../utils/fontUtils';

interface AutoFontTextProps extends TextProps {
  children: string;
  typographyStyle?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  customWeight?: number;
  textColor?: string;
}

/**
 * Text component that automatically selects the appropriate font family
 * based on the text content (Thai, Latin, or Latin Extended)
 */
export const AutoFontText: React.FC<AutoFontTextProps> = ({
  children,
  typographyStyle = 'body',
  customWeight,
  textColor,
  style,
  ...props
}) => {
  const text = typeof children === 'string' ? children : '';
  
  // Get the appropriate font family based on text content
  const weight = customWeight || getWeightFromTypographyStyle(typographyStyle);
  const fontFamily = getFontFamily(text, weight);

  const textStyle: TextStyle = {
    fontFamily,
    color: textColor,
    ...(style as TextStyle),
  };

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

// Helper function to get weight from typography style
const getWeightFromTypographyStyle = (style: 'h1' | 'h2' | 'h3' | 'body' | 'caption'): number => {
  const weightMap = {
    h1: 700,
    h2: 600,
    h3: 600,
    body: 400,
    caption: 500,
  };
  return weightMap[style];
};

export default AutoFontText;
