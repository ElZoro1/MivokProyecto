import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getCurrentUser, hasActiveSession, signInWithGoogle, signInWithMicrosoft, signInWithFacebook, supabase } from '../lib/supabase';
import WelcomeScreen from './welcomescreen';

const { width, height } = Dimensions.get('window');

// Funciones de escalado
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;
const fp = (percentage: number) => {
  const baseWidth = 375; // referencia iPhone X
  return (width / baseWidth) * percentage;
};

// Función para ajustes específicos de iOS
const iosAdjust = (iosValue: number, androidValue: number = iosValue) => {
  return Platform.OS === 'ios' ? iosValue : androidValue;
};

// Gradientes oscuros con transiciones suaves
const gradients: [string, string][] = [
  ['#1a1a2e', '#16213e'],
  ['#16213e', '#0f3460'],
  ['#0f3460', '#533a7b'],
  ['#533a7b', '#2c1810'],
  ['#2c1810', '#1f2937'],
  ['#1f2937', '#374151'],
  ['#374151', '#1a1a2e'],
];

// Degradados para botones
const buttonGradients = {
  microsoft: ['#4267B2', '#8b5cf6'] as [string, string],
  facebook: ['#1877F2', '#4267B2'] as [string, string], // Colores más característicos de Facebook
  google: ['#4285F4', '#34A853'] as [string, string], // Colores más característicos de Google
  login: ['#667eea', '#764ba2', '#f093fb'] as [string, string, string],
  skip: [
    'rgba(255, 255, 255, 0.15)',
    'rgba(255, 255, 255, 0.05)',
    'rgba(255, 255, 255, 0.1)',
  ] as [string, string, string],
};

// Partículas flotantes mejoradas
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

  // Verificar sesión al cargar la app
  const checkInitialSession = useCallback(async () => {
    try {
      setInitialLoading(true);
      
      // Verificar si hay sesión activa
      const sessionExists = await hasActiveSession();
      console.log('¿Existe sesión?', sessionExists);
      
      if (sessionExists) {
        const currentUser = await getCurrentUser();
        console.log('Usuario encontrado:', currentUser);
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error verificando sesión inicial:', error);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    checkInitialSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          Alert.alert('¡Éxito!', `Bienvenido ${session.user.email}`);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token actualizado');
          if (session?.user) {
            setUser(session.user);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkInitialSession]);

  const nextIndex = (currentIndex + 1) % gradients.length;

  // FUNCIÓN MICROSOFT LOGIN
  const handleMicrosoftLogin = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      console.log('Iniciando login con Microsoft...');
      const result = await signInWithMicrosoft();
      
      if (result.success) {
        console.log('Login Microsoft exitoso:', result.user?.email);
        // El estado se actualizará automáticamente por el listener
      } else {
        Alert.alert('Error Microsoft', result.error || 'No se pudo iniciar sesión con Microsoft');
      }
    } catch (error) {
      console.error('Error en Microsoft Login:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado con Microsoft');
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN FACEBOOK LOGIN - NUEVA IMPLEMENTACIÓN
  const handleFacebookLogin = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      console.log('Iniciando login con Facebook...');
      const result = await signInWithFacebook();
      
      if (result.success) {
        console.log('Login Facebook exitoso:', result.user?.email);
        // El estado se actualizará automáticamente por el listener
      } else {
        Alert.alert('Error Facebook', result.error || 'No se pudo iniciar sesión con Facebook');
      }
    } catch (error) {
      console.error('Error en Facebook Login:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado con Facebook');
    } finally {
      setLoading(false);
    }
  };
  
  // FUNCIÓN DE GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      console.log('Iniciando login con Google...');
      const result = await signInWithGoogle();
      
      if (result.success) {
        console.log('Login exitoso:', result.user?.email);
        // El estado se actualizará automáticamente por el listener
      } else {
        Alert.alert('Error', result.error || 'No se pudo iniciar sesión');
      }
    } catch (error) {
      console.error('Error en Google Login:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cuando el usuario cierra sesión desde WelcomeScreen
  const handleSignOut = () => {
    setUser(null);
  };

  const handleLogin = () => console.log('Iniciar Sesión');
  const handleSkip = () => console.log('Elegir quién eres');

  // Generar partículas con keys estables
  const particles = React.useMemo(() => 
    Array.from({ length: NUM_PARTICLES }, (_, i) => (
      <Particle key={`particle-${i}`} index={i} />
    )), []
  );

  // Mostrar loading inicial
  if (initialLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={StyleSheet.absoluteFillObject}>
          <LinearGradient
            colors={gradients[0]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.background}
          />
        </View>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  // Si el usuario está logueado, mostrar la pantalla de bienvenida
  if (user) {
    return <WelcomeScreen user={user} onSignOut={handleSignOut} />;
  }

  // Pantalla de login para usuarios no autenticados
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

      {/* Contenido principal - Pantalla de Login */}
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
          {/* BOTÓN MICROSOFT */}
          <TouchableOpacity
            style={[styles.buttonContainer, styles.socialButtonSpacing]}
            onPress={handleMicrosoftLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={buttonGradients.microsoft}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.socialButton, loading && { opacity: 0.7 }]}
            >
              <Ionicons name="logo-microsoft" size={fp(24)} color="#fff" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>
                {loading ? 'Conectando...' : 'Continuar con Microsoft'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* BOTÓN FACEBOOK - FUNCIONAL */}
          <TouchableOpacity
            style={[styles.buttonContainer, styles.socialButtonSpacing]}
            onPress={handleFacebookLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={buttonGradients.facebook}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.socialButton, loading && { opacity: 0.7 }]}
            >
              <Ionicons name="logo-facebook" size={fp(24)} color="#fff" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>
                {loading ? 'Conectando...' : 'Continuar con Facebook'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* BOTÓN DE GOOGLE */}
          <TouchableOpacity
            style={[styles.buttonContainer, styles.socialButtonSpacing]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={buttonGradients.google}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.socialButton, loading && { opacity: 0.7 }]}
            >
              <Ionicons name="logo-google" size={fp(24)} color="#fff" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>
                {loading ? 'Conectando...' : 'Continuar con Google'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* BOTÓN INICIAR SESIÓN */}
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
    paddingTop: iosAdjust(hp(4), hp(8)),
  },

  // Loading
  loadingText: {
    color: '#fff',
    fontSize: fp(18),
    fontWeight: '600',
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
    height: iosAdjust(hp(10), hp(15)),
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
    height: iosAdjust(hp(25), hp(15)),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: iosAdjust(hp(2), 0),
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
    marginBottom: iosAdjust(hp(1), hp(3)),
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

  // BUTTONS SECTION - Altura ajustada para 3 botones + login
  buttonsSection: {
    height: iosAdjust(hp(45), hp(50)), // Reducida para 3 botones sociales
    justifyContent: 'flex-start',
    paddingTop: iosAdjust(hp(1), hp(3)),
  },
  buttonContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 0,
    marginBottom: hp(2.5),
  },
  socialButtonSpacing: { 
    marginBottom: iosAdjust(hp(2), hp(3)) 
  },
  loginButtonSpacing: {
    marginTop: iosAdjust(hp(-1), hp(0)),
    alignSelf: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: iosAdjust(hp(1.5), hp(1.8)),
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
    paddingVertical: iosAdjust(hp(1.5), hp(1.8)),
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