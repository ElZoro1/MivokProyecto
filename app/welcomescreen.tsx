import * as React from 'react';
import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from '../lib/supabase';

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
  logout: ['#ef4444', '#dc2626'] as [string, string],
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

interface WelcomeScreenProps {
  user: any;
  onSignOut?: () => void;
}

export default function WelcomeScreen({ user, onSignOut }: WelcomeScreenProps) {
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

  // 🔥 FUNCIÓN PARA CERRAR SESIÓN
  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Error cerrando sesión');
      } else {
        onSignOut?.();
      }
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      Alert.alert('Error', 'Error cerrando sesión');
    }
  };

  const nextIndex = (currentIndex + 1) % gradients.length;

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

      {/* Información del usuario logueado */}
      <View style={styles.userInfo}>
        <Text style={styles.userText}>👋 {user?.email}</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <LinearGradient
            colors={buttonGradients.logout}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutButtonGradient}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Contenido principal - Pantalla de bienvenida */}
      <View style={styles.loggedInContent}>
        <Text style={styles.welcomeText}>¡Bienvenido a Mivok!</Text>
        <Text style={styles.userEmailText}>{user?.email}</Text>
        <Text style={styles.successText}>Has iniciado sesión correctamente 🎉</Text>
        
        {/* Botón adicional para explorar la app */}
        <TouchableOpacity style={styles.exploreButtonContainer}>
          <LinearGradient
            colors={buttonGradients.skip}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.exploreButton}
          >
            <Text style={styles.exploreButtonText}>Explorar la App</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },

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

  // USER INFO
  userInfo: {
    position: 'absolute',
    top: hp(5),
    right: wp(5),
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: wp(3),
    borderRadius: wp(2),
    zIndex: 20,
  },
  userText: {
    color: '#fff',
    fontSize: fp(12),
    fontWeight: '600',
  },

  // LOGOUT BUTTON
  logoutButton: {
    marginTop: hp(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  logoutButtonGradient: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(4),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: fp(12),
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // LOGGED IN CONTENT - PANTALLA DE BIENVENIDA
  loggedInContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
    zIndex: 10,
  },
  welcomeText: {
    fontSize: fp(32),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp(2),
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    fontFamily: 'Salezar',
  },
  userEmailText: {
    fontSize: fp(20),
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp(1),
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontWeight: '600',
  },
  successText: {
    fontSize: fp(18),
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: hp(4),
  },

  // BOTÓN EXPLORAR
  exploreButtonContainer: {
    marginTop: hp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  exploreButton: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
    borderRadius: wp(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: fp(16),
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});