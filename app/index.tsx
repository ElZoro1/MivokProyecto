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
  ['#1a1a2e', '#16213e'],
  ['#16213e', '#0f3460'],
  ['#0f3460', '#533a7b'],
  ['#533a7b', '#2c1810'],
  ['#2c1810', '#1f2937'],
  ['#1f2937', '#374151'],
  ['#374151', '#1a1a2e'],
];

// 🌈 Degradados para botones
const buttonGradients = {
  register: ['#DD69B2', '#C037E2'] as [string, string],
  facebook: ['#4267B2', '#8b5cf6'] as [string, string],
  google: ['#4267B2', '#8b5cf6'] as [string, string],
  apple: ['#4267B2', '#8b5cf6'] as [string, string],
  login: ['#667eea', '#764ba2', '#f093fb'] as [string, string, string],
  skip: [
    'rgba(255, 255, 255, 0.15)',
    'rgba(255, 255, 255, 0.05)',
    'rgba(255, 255, 255, 0.1)',
  ] as [string, string, string],
};

// 🌌 Partículas flotantes mejoradas
const NUM_PARTICLES = 25;

interface ParticleProps {
  index: number;
}

const Particle = React.memo(({ index }: ParticleProps) => {
  const animatedValues = useRef({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(height + Math.random() * 100),
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.5 + Math.random() * 0.5),
  }).current;

  const particleConfig = useRef({
    size: 1.5 + Math.random() * 3,
    speed: 8000 + Math.random() * 4000,
    delay: index * 300 + Math.random() * 2000,
    horizontalDrift: (Math.random() - 0.5) * width * 0.3,
  }).current;

  const isAnimating = useRef(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const createParticleAnimation = React.useCallback(() => {
    if (isAnimating.current) return;
    
    isAnimating.current = true;
    
    // Reset inicial con posición X aleatoria
    const startX = Math.random() * width;
    animatedValues.x.setValue(startX);
    animatedValues.y.setValue(height + 50 + Math.random() * 100);
    animatedValues.opacity.setValue(0);
    
    const endX = startX + particleConfig.horizontalDrift;
    
    animationRef.current = Animated.parallel([
      // Movimiento vertical
      Animated.timing(animatedValues.y, {
        toValue: -100,
        duration: particleConfig.speed,
        useNativeDriver: true,
      }),
      
      // Movimiento horizontal sutil
      Animated.timing(animatedValues.x, {
        toValue: Math.max(0, Math.min(width, endX)),
        duration: particleConfig.speed,
        useNativeDriver: true,
      }),
      
      // Animación de opacidad más suave
      Animated.sequence([
        Animated.timing(animatedValues.opacity, {
          toValue: 0.6 + Math.random() * 0.4,
          duration: particleConfig.speed * 0.2,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.opacity, {
          toValue: 0.3 + Math.random() * 0.3,
          duration: particleConfig.speed * 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.opacity, {
          toValue: 0,
          duration: particleConfig.speed * 0.2,
          useNativeDriver: true,
        }),
      ]),
      
      // Escala sutil
      Animated.sequence([
        Animated.timing(animatedValues.scale, {
          toValue: 0.8 + Math.random() * 0.4,
          duration: particleConfig.speed * 0.3,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.scale, {
          toValue: 0.3 + Math.random() * 0.3,
          duration: particleConfig.speed * 0.7,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animationRef.current.start((finished) => {
      isAnimating.current = false;
      if (finished) {
        // Pequeña pausa antes de reiniciar
        setTimeout(() => {
          if (!isAnimating.current) {
            createParticleAnimation();
          }
        }, Math.random() * 1000);
      }
    });
  }, [animatedValues, particleConfig]);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      createParticleAnimation();
    }, particleConfig.delay);

    return () => {
      clearTimeout(initialDelay);
      if (animationRef.current) {
        animationRef.current.stop();
      }
      isAnimating.current = false;
    };
  }, [createParticleAnimation, particleConfig.delay]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particleConfig.size,
          height: particleConfig.size,
          borderRadius: particleConfig.size / 2,
          transform: [
            { translateX: animatedValues.x },
            { translateY: animatedValues.y },
            { scale: animatedValues.scale },
          ],
          opacity: animatedValues.opacity,
        },
      ]}
    />
  );
});

Particle.displayName = 'Particle';

export default function Index() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  useEffect(() => {
    let animationTimeout: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const startAnimation = () => {
      if (isAnimating) return;
      setIsAnimating(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => (prev + 1) % gradients.length);

        requestAnimationFrame(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }).start(() => {
            setIsAnimating(false);
          });
        });
      });
    };

    animationTimeout = setTimeout(() => {
      startAnimation();
    }, 2000);

    intervalId = setInterval(() => {
      startAnimation();
    }, 10000);

    return () => {
      if (animationTimeout) clearTimeout(animationTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [fadeAnim, isAnimating]);

  const nextIndex = (currentIndex + 1) % gradients.length;

  const handleRegister = () => console.log('Registrarse gratis');
  const handleFacebookLogin = () => console.log('Continuar con Facebook');
  const handleGoogleLogin = () => console.log('Continuar con Google');
  const handleAppleLogin = () => console.log('Continuar con Apple');
  const handleLogin = () => console.log('Iniciar Sesión');
  const handleSkip = () => console.log('Elegir quién eres');

  // Generar partículas con keys estables
  const particles = React.useMemo(() => 
    Array.from({ length: NUM_PARTICLES }, (_, i) => (
      <Particle key={`particle-${i}`} index={i} />
    )), []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background base */}
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={gradients[currentIndex]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
      </View>

      {/* Background transición */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: fadeAnim, zIndex: isAnimating ? 1 : -1 },
        ]}
      >
        <LinearGradient
          colors={gradients[nextIndex]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}
        />
      </Animated.View>

      {/* Partículas */}
      <View style={styles.particlesContainer} pointerEvents="none">
        {particles}
      </View>

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

          <TouchableOpacity
            style={[styles.buttonContainer, styles.socialButtonSpacing]}
            onPress={handleFacebookLogin}
          >
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

          <TouchableOpacity
            style={[styles.buttonContainer, styles.socialButtonSpacing]}
            onPress={handleGoogleLogin}
          >
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

          <TouchableOpacity
            style={[styles.buttonContainer, styles.socialButtonSpacing]}
            onPress={handleAppleLogin}
          >
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

          <TouchableOpacity
            style={[styles.buttonContainer, styles.loginButtonSpacing]}
            onPress={handleLogin}
          >
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
  container: { flex: 1 },
  background: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: wp(8),
    zIndex: 10,
    paddingTop: hp(8),
  },

  // PARTÍCULAS
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
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
    marginBottom: hp(2.5),
  },
  socialButtonSpacing: { marginBottom: hp(3) },
  loginButtonSpacing: {
    marginTop: hp(0),
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