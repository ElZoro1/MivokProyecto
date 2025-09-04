import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Función de escalado más robusta
const wp = (percentage) => {
  return (width * percentage) / 100;
};

const hp = (percentage) => {
  return (height * percentage) / 100;
};

// Escalado de fuentes basado en el ancho de pantalla
const fp = (percentage) => {
  const baseWidth = 375; // iPhone X como referencia
  return (width / baseWidth) * percentage;
};

const MivokLoginScreen = () => {
  const handleRegister = () => {
    console.log('Registrarse gratis');
    // Aquí implementarías la navegación al registro
  };

  const handleFacebookLogin = () => {
    console.log('Continuar con Facebook');
    // Implementar autenticación con Facebook
  };

  const handleGoogleLogin = () => {
    console.log('Continuar con Google');
    // Implementar autenticación con Google
  };

  const handleAppleLogin = () => {
    console.log('Continuar con Apple');
    // Implementar autenticación con Apple
  };

  const handleLogin = () => {
    console.log('Iniciar Sesión');
    // Navegar a pantalla de login
  };

  const handleSkip = () => {
    console.log('Elegir quién eres');
    // Navegar a selección de perfil
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6B46C1" />
      
      <LinearGradient
        colors={['#8D82D6', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* Header Section - 15% */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Comienza Tu Experiencia</Text>
          </TouchableOpacity>
        </View>

        {/* Logo Section - 35% */}
        <View style={styles.logoSection}>
          <View style={styles.logoContent}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/images/image10.png')}
                contentFit="cover"
                transition={1000}
                style={styles.image}
              />
            </View>
            <Text style={styles.brandName}>Mivok</Text>
          </View>
          
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Tu puerta a un evento</Text>
            <Text style={styles.subtitle}>inolvidable</Text>
          </View>
        </View>

        {/* Buttons Section - 50% */}
        <View style={styles.buttonsSection}>
          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Regístrate Gratis</Text>
          </TouchableOpacity>

          {/* Social Login Buttons */}
          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <Ionicons name="logo-facebook" size={fp(24)} color="#fff" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continuar con Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton]} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={fp(24)} color="#fff" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton]} onPress={handleAppleLogin}>
            <Ionicons name="logo-apple" size={fp(24)} color="#fff" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continuar con Apple</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: wp(8), // 8% del ancho
  },
  
  // HEADER SECTION - 15%
  headerSection: {
    height: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(0),
    paddingStart: hp(0),
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderRadius: wp(5),
  },
  skipText: {
    color: '#fff',
    fontSize: fp(14),
    fontWeight: '500',
  },

  // LOGO SECTION - 35%
  logoSection: {
    height: hp(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  imageContainer: {
    marginRight: wp(4),
  },
  image: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
  },
  brandName: {
    fontSize: fp(30),
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    marginLeft: -15,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: hp(5),
  },
  subtitle: {
    fontSize: fp(18),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // BUTTONS SECTION - 50%
  buttonsSection: {
    height: hp(50),
    justifyContent: 'space-evenly',
    paddingVertical: hp(0),
  },
  registerButton: {
    backgroundColor: '#EC4899',
    paddingVertical: hp(2),
    borderRadius: wp(6),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: fp(18),
    fontWeight: '600',
  },
  socialButton: {
    backgroundColor: '#6B5CE7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(5),
    borderRadius: wp(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  socialIcon: {
    marginRight: wp(4),
    width: wp(6),
  },
  socialButtonText: {
    color: '#fff',
    fontSize: fp(16),
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginRight: wp(10),
  },
  loginButton: {
    backgroundColor: '#6B5CE7',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: fp(16),
    fontWeight: '500',
  },
});

export default MivokLoginScreen;