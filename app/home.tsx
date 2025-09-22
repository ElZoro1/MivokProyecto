import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function HomeIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="#fff">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <Path d="M12.707 2.293l9 9c.63 .63 .184 1.707 -.707 1.707h-1v6a3 3 0 0 1 -3 3h-1v-7a3 3 0 0 0 -2.824 -2.995l-.176 -.005h-2a3 3 0 0 0 -3 3v7h-1a3 3 0 0 1 -3 -3v-6h-1c-.89 0 -1.337 -1.077 -.707 -1.707l9 -9a1 1 0 0 1 1.414 0m.293 11.707a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883 -.993l.117 -.007z" fill="#fff" />
    </Svg>
  );
}

function CalendarIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <Path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
      <Path d="M16 3v4" />
      <Path d="M8 3v4" />
      <Path d="M4 11h16" />
      <Path d="M7 14h.013" />
      <Path d="M10.01 14h.005" />
      <Path d="M13.01 14h.005" />
      <Path d="M16.015 14h.005" />
      <Path d="M13.015 17h.005" />
      <Path d="M7.01 17h.005" />
      <Path d="M10.01 17h.005" />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <Path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <Path d="M21 21l-6 -6" />
    </Svg>
  );
}

function BellIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="#fff">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <Path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" fill="#fff" />
      <Path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" fill="#fff" />
    </Svg>
  );
}

function MenuIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <Path d="M4 6l16 0" />
      <Path d="M4 12l16 0" />
      <Path d="M4 18l16 0" />
    </Svg>
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hola}>Hola, Cristian</Text>
          <Text style={styles.wave}>👋</Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {/* Icono de usuario SVG */}
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="#fff">
              <Path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <Path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
              <Path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
            </Svg>
          </View>
        </View>
      </View>

      {/* Buscas Eventos */}
      <View style={styles.eventBox}>
        <Text style={styles.eventText}>Buscas Eventos? <Text style={{fontSize:24}}>🤔</Text></Text>
      </View>

      {/* No tienes trabajos */}
      <View style={styles.cardBox}>
        <Text style={styles.cardTitle}>No tienes trabajos aun <Text style={{fontSize:28}}>😕</Text></Text>
        <Text style={styles.cardDesc}>
          Potencia tu perfil, agrega eventos en los que ya has participado para aumentar tus probabilidades de captar interesados.
        </Text>
        <TouchableOpacity style={styles.goBtn}>
          <Text style={styles.goBtnText}>Ir</Text>
        </TouchableOpacity>
      </View>

      {/* Spacer */}
      <View style={{flex:1}} />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <HomeIcon />
          <Text style={styles.navTextActive}>Inicio</Text>
        </View>
        <View style={styles.navItem}>
          <CalendarIcon />
          <Text style={styles.navText}>Eventos</Text>
        </View>
        <View style={[styles.navItem, styles.navItemCenter]}>
          <View style={styles.navCircle}>
            <SearchIcon />
          </View>
        </View>
        <View style={styles.navItem}>
          <BellIcon />
          <Text style={styles.navText}>Alertas</Text>
        </View>
        <View style={styles.navItem}>
          <MenuIcon />
          <Text style={styles.navText}>Más</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
    paddingTop: 64, // Aumentado para evitar la Dynamic Island
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  hola: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  wave: {
    fontSize: 32,
    marginTop: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    backgroundColor: '#222',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  eventBox: {
    backgroundColor: '#191919',
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },
  eventText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardBox: {
    backgroundColor: '#191919',
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDesc: {
    color: '#ccc',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 18,
  },
  goBtn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  goBtnText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#181818',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 32,
    height: 32,
    marginBottom: 2,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  navText: {
    fontFamily: 'Lalezar',
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    opacity: 0.85,
    letterSpacing: 0.2,
  },
  navTextActive: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCircle: {
    backgroundColor: '#222',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    borderWidth: 2,
    borderColor: '#222',
  },
  navIconCenter: {
    width: 40,
    height: 40,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
});
