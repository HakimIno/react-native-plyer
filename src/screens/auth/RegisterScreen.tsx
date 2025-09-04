import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
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
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from './AuthNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;
type RegisterScreenRouteProp = RouteProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
  route: RegisterScreenRouteProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation, route }) => {
  const { email } = route.params;
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { handleRegister } = useAuthForm();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('กรุณาใส่ชื่อ');
      return;
    }
    if (!password.trim()) {
      setError('กรุณาใส่รหัสผ่าน');
      return;
    }
    if (!confirmPassword.trim()) {
      setError('กรุณายืนยันรหัสผ่าน');
      return;
    }
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await handleRegister(name, email, password);
    } catch (error) {
      setError('สมัครสมาชิกไม่สำเร็จ');
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

      <View style={[styles.header, { marginTop: top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <View style={[styles.logoContainer, { marginTop: top + 20 }]}>
          <AutoFontText
            typographyStyle='h1'
            customWeight={700}
            children={`สร้างบัญชีใหม่ด้วย`}
            style={{ color: theme.colors.text.primary, fontSize: 24 }}
          />
          <View style={{ marginTop: 8 }}>
            <AutoFontText
              typographyStyle='caption'
              customWeight={400}
              children={'สร้างรหัสผ่านสำหรับบัญชี kube ของคุณ'}
              style={{ color: theme.colors.text.primary, fontSize: 13 }}
            />
            <AutoFontText
              typographyStyle='caption'
              customWeight={600}
              children={`${email}`}
              style={{ color: theme.colors.text.primary, fontSize: 14 }}
            />

            <AutoFontText
              typographyStyle='caption'
              customWeight={400}
              children={`ABC | abc | 123 | 8-20 ตัวอักษร`}
              style={{ color: theme.colors.text.secondary, fontSize: 11, marginTop: 16 }}
            />
          </View>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Input
          placeholder="ชื่อ"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          error={!!error && !name.trim()}
          disabled={isLoading}
          returnKeyType="next"
          variant='underline'
        />

        <Input
          placeholder="รหัสผ่าน"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={!!error && !password.trim()}
          disabled={isLoading}
          returnKeyType="next"
          variant='underline'
        />

        <Input
          placeholder="ยืนยันรหัสผ่าน"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={!!error && (password !== confirmPassword || !confirmPassword.trim())}
          disabled={isLoading}
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
          title={isLoading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
          onPress={handleSubmit}
          variant="filled"
          size="medium"
          color="primary"
          rounded={true}
          disabled={isLoading || !name.trim() || !password.trim() || !confirmPassword.trim()}
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
  logoContainer: {
    flexDirection: 'column',
  },
  footer: {
    width: '100%',
    marginTop: 30,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: -14,
    padding: 8,
    zIndex: 1,
  },
});

export default RegisterScreen;
