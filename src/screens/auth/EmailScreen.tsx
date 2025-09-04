import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { AutoFontText } from '../../components/common';
import { useAuthForm } from '../../hooks/useAuth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from './AuthNavigator';

type EmailScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Email'>;

interface EmailScreenProps {
  navigation: EmailScreenNavigationProp;
}

const EmailScreen: React.FC<EmailScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { handleCheckEmail } = useAuthForm();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);

    // Clear error if email becomes valid
    if (text.trim() && validateEmail(text)) {
      setError(null);
    } else if (text.trim() && !validateEmail(text)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
    } else {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('กรุณาใส่อีเมล');
      return;
    }

    if (!validateEmail(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const exists = await handleCheckEmail(email);
      if (exists) {
        navigation.navigate('Login', { email });
      } else {
        navigation.navigate('Register', { email });
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการตรวจสอบอีเมล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.primary, '#000000', '#000000']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 1.2 }}
        end={{ x: 0, y: 0 }}
      />

      <View style={[styles.header, { marginTop: top + 30 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="dog" size={28} color="white" />
          <AutoFontText
            typographyStyle='h1'
            customWeight={700}
            children='Kube'
            style={{ color: theme.colors.text.primary, fontSize: 20 }}
          />
        </View>

        <View style={{ marginTop: 8 }}>
          <AutoFontText
            typographyStyle='h1'
            customWeight={600}
            children='สมัครสมาชิกหรือเข้าสู่ระบบด้วยอีเมล'
            style={{ color: theme.colors.text.primary, fontSize: 20 }}
          />
        </View>
      </View>

      <View style={styles.formContainer}>
        <Input
          placeholder="อีเมล"
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
          error={!!error}
          disabled={isLoading}
          keyboardType="email-address"
          returnKeyType="done"
          variant='underline'
          onSubmitEditing={handleSubmit}
        />
        {error && (
          <AutoFontText
            typographyStyle='caption'
            customWeight={400}
            children={error}
            style={{ color: theme.colors.error, fontSize: 12, marginTop: 8 }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title={isLoading ? "กำลังตรวจสอบ..." : "ดำเนินการต่อ"}
          onPress={handleSubmit}
          variant="filled"
          size="medium"
          color="primary"
          rounded={true}
          disabled={isLoading || !email.trim()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {},
  formContainer: {
    width: '100%',
  },
  footer: {
    width: '100%',
    marginTop: 30,
  },
});

export default EmailScreen;
