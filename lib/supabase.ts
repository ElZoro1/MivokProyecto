// lib/supabase.ts - VERSIÓN CORREGIDA
import { createClient } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://bwaarivuswbaivrrcflv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3YWFyaXZ1c3diYWl2cnJjZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NDE4MjEsImV4cCI6MjA3MzExNzgyMX0.J3Rgg22KXCzuxXSYS3ONsdqgONdMhWUD9kwNU_Vgk14';

WebBrowser.maybeCompleteAuthSession();

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const signInWithGoogle = async () => {
  try {
    console.log('🔄 Iniciando autenticación con Google...');
    
    // URL de redirect mejorada para Expo
    const redirectUrl = Linking.createURL('/');
    console.log('🔗 Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.error('❌ Error generando URL OAuth:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ URL OAuth generada');

    const authResult = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl
    );

    console.log('📱 Resultado:', authResult);

    if (authResult.type === 'success' && authResult.url) {
      console.log('🔗 URL de callback recibida:', authResult.url);
      
      // Manejo mejorado de la URL de callback
      const { queryParams } = Linking.parse(authResult.url);
      
      // Extraer tokens de diferentes formas posibles
      let accessToken = null;
      let refreshToken = null;
      let errorParam = null;

      // Método 1: De queryParams directamente
      if (queryParams) {
        accessToken = queryParams.access_token as string;
        refreshToken = queryParams.refresh_token as string;
        errorParam = queryParams.error as string;
      }

      // Método 2: De fragment si no se encontraron en query
      if (!accessToken) {
        const urlString = authResult.url;
        let paramString = '';
        
        if (urlString.includes('#')) {
          paramString = urlString.split('#')[1];
        } else if (urlString.includes('?')) {
          paramString = urlString.split('?')[1];
        }
        
        if (paramString) {
          const params = new URLSearchParams(paramString);
          accessToken = params.get('access_token');
          refreshToken = params.get('refresh_token');
          errorParam = params.get('error');
        }
      }
      
      console.log('🔑 Access Token:', accessToken ? '✅' : '❌');
      console.log('🔄 Refresh Token:', refreshToken ? '✅' : '❌');
      
      if (errorParam) {
        console.error('❌ Error en callback:', errorParam);
        return { success: false, error: errorParam };
      }
      
      if (accessToken && refreshToken) {
        console.log('💾 Estableciendo sesión...');
        
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('❌ Error estableciendo sesión:', sessionError);
          return { success: false, error: sessionError.message };
        }

        console.log('✅ Login exitoso');
        return { success: true, user: sessionData.user };
      } else {
        console.error('❌ No se encontraron tokens en la respuesta');
        return { success: false, error: 'No se pudieron obtener los tokens de acceso' };
      }
    }

    if (authResult.type === 'cancel') {
      console.log('⏹️ Usuario canceló la autenticación');
      return { success: false, error: 'Autenticación cancelada' };
    }

    console.error('❌ Tipo de resultado no reconocido:', authResult.type);
    return { success: false, error: 'No se pudo completar la autenticación' };
    
  } catch (error: any) {
    console.error('❌ Error inesperado:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const hasActiveSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return false;
  }
};