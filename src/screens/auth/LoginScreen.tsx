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

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const { email } = route.params;
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { handleLogin } = useAuthForm();

  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('กรุณาใส่รหัสผ่าน');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await handleLogin(email, password);
    } catch (error) {
      setError('เข้าสู่ระบบไม่สำเร็จ');
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
            children={`เข้าสู่ระบบด้วย Kube!`}
            style={{ color: theme.colors.text.primary, fontSize: 24 }}
          />
          <View style={{ marginTop: 8 }}>
            <AutoFontText
              typographyStyle='caption'
              customWeight={400}
              children={'กรอกรหัสผ่านสำหรับบัญชี kube ของคุณ'}
              style={{ color: theme.colors.text.primary, fontSize: 13 }}
            />
            <AutoFontText
              typographyStyle='caption'
              customWeight={600}
              children={`${email}`}
              style={{ color: theme.colors.text.primary, fontSize: 14 }}
            />
          </View>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Input
          placeholder="รหัสผ่าน"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={!!error}
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
          title={isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          onPress={handleSubmit}
          variant="filled"
          size="medium"
          color="primary"
          rounded={true}
          disabled={isLoading || !password.trim()}
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

export default LoginScreen;
