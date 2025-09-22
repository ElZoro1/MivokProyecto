import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from 'expo-router';
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Bienvenida() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo gradiente radial */}
      <LinearGradient
        colors={["#9565F6", "#534CE0"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      {/* Encabezado */}
      <View style={{width: '100%', height: 260, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1}}>
        <View style={{flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 40}}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Haz match con tu próximo evento. <Text style={styles.auriculares}>🎧</Text></Text>
          <Text style={styles.emoji}>👋</Text>
        </View>
      </View>

      {/* Botones */}
      <View style={[styles.content, {marginTop: 260}]}> 
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
          <Text style={styles.buttonText}>Iniciar a buscar DJ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.replace('/home')}>
          <Text style={styles.buttonText}>Quiero trabajar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSmall} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Texto inferior */}
      <Text style={styles.footerText}>Dentro igual podrás cambiar el modo</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#d1d1d1",
    marginTop: 6,
    fontWeight: "bold",
  },
  auriculares: {
    fontSize: 16,
  },
  emoji: {
    fontSize: 40,
    marginTop: 18,
  },
  content: {
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
  },
  button: {
    width: 250,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonSmall: {
    width: 120,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  footerText: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 20,
  },
});