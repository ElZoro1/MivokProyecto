import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Funciones de escalado
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;
const fp = (percentage: number) => {
  const baseWidth = 375; // referencia iPhone X
  return (width / baseWidth) * percentage;
};

// 🎨 Gradientes oscuros con transiciones suaves
const gradients: [string, string][] = [
  ['#1a1a2e', '#16213e'], // Azul marino muy oscuro
  ['#16213e', '#0f3460'], // Azul petróleo a medianoche
  ['#0f3460', '#533a7b'], // Azul medianoche a morado oscuro
  ['#533a7b', '#2c1810'], // Morado oscuro a marrón
  ['#2c1810', '#1f2937'], // Marrón a gris azulado
  ['#1f2937', '#374151'], // Gris azulado a gris carbón
  ['#374151', '#1a1a2e'], // Gris carbón de vuelta al inicio
];

// 🌈 Degradados para botones
const buttonGradients = {
  register: ['#DD69B2', '#C037E2'] as [string, string], // Rosa vibrante a naranja dorado
  facebook: ['#4267B2', '#8b5cf6'] as [string, string], // Azul Facebook a púrpura y cyan
  google: ['#4267B2', '#8b5cf6'] as [string, string], // Colores oficiales de Google
  apple: ['#4267B2', '#8b5cf6'] as [string, string], // Negro elegante con matices
  login: ['#667eea', '#764ba2', '#f093fb'] as [string, string, string], // Azul a púrpura suave
  skip: [
    'rgba(255, 255, 255, 0.15)',
    'rgba(255, 255, 255, 0.05)',
    'rgba(255, 255, 255, 0.1)'
  ] as [string, string, string], // Transparente elegante
};

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  useEffect(() => {
    let animationTimeout: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const startAnimation = () => {
      if (isAnimating) return; // Prevenir animaciones superpuestas
      
      setIsAnimating(true);
      
      // Animar hacia opacidad completa
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000, // 8 segundos para la transición
        useNativeDriver: true,
      }).start(() => {
        // Cambiar el índice después de que la animación termine
        setCurrentIndex((prev) => (prev + 1) % gradients.length);
        
        // Esperar un frame antes de resetear para evitar el salto
        requestAnimationFrame(() => {
          // Animar de vuelta a 0 para preparar la siguiente transición
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 0, // Instantáneo pero sin salto visual
            useNativeDriver: true,
          }).start(() => {
            setIsAnimating(false);
          });
        });
      });
    };

    // Iniciar primera animación después de 2 segundos
    animationTimeout = setTimeout(() => {
      startAnimation();
    }, 2000);

    // Repetir cada 10 segundos
    intervalId = setInterval(() => {
      startAnimation();
    }, 10000);

    return () => {
      if (animationTimeout) clearTimeout(animationTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [fadeAnim, isAnimating]);

  const nextIndex = (currentIndex + 1) % gradients.length;

  // Handlers
  const handleRegister = () => console.log('Registrarse gratis');
  const handleFacebookLogin = () => console.log('Continuar con Facebook');
  const handleGoogleLogin = () => console.log('Continuar con Google');
  const handleAppleLogin = () => console.log('Continuar con Apple');
  const handleLogin = () => console.log('Iniciar Sesión');
  const handleSkip = () => console.log('Elegir quién eres');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background base - siempre visible */}
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={gradients[currentIndex]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
      </View>

      {/* Background superpuesto - aparece gradualmente */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: fadeAnim,
            zIndex: isAnimating ? 1 : -1, // Solo visible durante animación
          }
        ]}
      >
        <LinearGradient
          colors={gradients[nextIndex]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
      </Animated.View>

      {/* Contenido */}
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.skipButtonContainer} onPress={handleSkip}>
            <LinearGradient
              colors={buttonGradients.skip}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Comienza Tu Experiencia</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContent}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/images/image10.png')}
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

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
          {/* Botón Registrarse */}
          <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
            <LinearGradient
              colors={buttonGradients.register}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Regístrate Gratis</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Botón Facebook */}
          <TouchableOpacity style={[styles.buttonContainer, styles.socialButtonSpacing]} onPress={handleFacebookLogin}>
            <LinearGradient
              colors={buttonGradients.facebook}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.socialButton}
            >
              <Ionicons name="logo-facebook" size={fp(24)} color="#fff" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Continuar con Facebook</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Botón Google */}
          <TouchableOpacity style={[styles.buttonContainer, styles.socialButtonSpacing]} onPress={handleGoogleLogin}>
            <LinearGradient
              colors={buttonGradients.google}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.socialButton}
            >
              <Ionicons name="logo-google" size={fp(24)} color="#fff" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Continuar con Google</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Botón Apple */}
          <TouchableOpacity style={[styles.buttonContainer, styles.socialButtonSpacing]} onPress={handleAppleLogin}>
            <LinearGradient
              colors={buttonGradients.apple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.socialButton}
            >
              <Ionicons name="logo-apple" size={fp(24)} color="#fff" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Continuar con Apple</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Botón Login */}
          <TouchableOpacity style={[styles.buttonContainer, styles.loginButtonSpacing]} onPress={handleLogin}>
            <LinearGradient
              colors={buttonGradients.login}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(8),
    zIndex: 10, // Asegurar que el contenido esté sobre los backgrounds
    paddingTop: hp(8), // <-- Agregado para bajar todo el contenido
  },

  // HEADER SECTION
  headerSection: {
    height: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  skipButton: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: '#fff',
    fontSize: fp(14),
    fontWeight: '600',
  },

  // LOGO SECTION
  logoSection: {
    height: hp(15),
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  image: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
  },
  brandName: {
    fontSize: fp(32),
    fontWeight: 'bold',
    fontFamily: 'Salezar',
    color: '#fff',
    letterSpacing: -1,
    marginLeft: -wp(3),
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  subtitleContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  subtitle: {
    fontSize: fp(18),
    fontFamily: 'Salezar',
    color: '#fff',
    letterSpacing: -1,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // BUTTONS SECTION
  buttonsSection: {
    height: hp(55),
    justifyContent: 'flex-start',
    paddingTop: hp(3),
  },
  buttonContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 0,
    marginBottom: hp(2.5), // Espaciado base entre botones
  },
  socialButtonSpacing: {
    marginBottom: hp(3), // Espaciado extra para botones sociales
  },
  loginButtonSpacing: {
    marginTop: hp(0), // Espaciado extra para el botón de login
    alignSelf: 'center',
  },
  registerButton: {
    paddingVertical: hp(2),
    borderRadius: wp(6),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: fp(18),
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(5),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialIcon: {
    marginRight: wp(4),
    width: wp(6),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: fp(16),
    fontWeight: '900',
    flex: 1,
    textAlign: 'center',
    marginRight: wp(10),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loginButton: {
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: fp(16),
    fontFamily: 'Salezar',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});