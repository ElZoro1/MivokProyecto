// lib/supabase.ts - VERSIÓN CON MICROSOFT Y PERFILES DE USUARIO
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

// Tipo para el perfil de usuario
export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  provider: string | null;
  created_at: string;
  updated_at: string;
}

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

        // Crear o actualizar perfil de usuario
        if (sessionData.user) {
          await createOrUpdateUserProfile(sessionData.user, 'google');
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

// 🔥 NUEVA FUNCIÓN PARA MICROSOFT OAUTH
export const signInWithMicrosoft = async () => {
  try {
    console.log('🔄 Iniciando autenticación con Microsoft...');
    
    // URL de redirect mejorada para Expo
    const redirectUrl = Linking.createURL('/');
    console.log('🔗 Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: redirectUrl,
        scopes: 'email profile openid',
      },
    });

    if (error) {
      console.error('❌ Error generando URL OAuth Microsoft:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ URL OAuth Microsoft generada');

    const authResult = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl
    );

    console.log('📱 Resultado Microsoft:', authResult);

    if (authResult.type === 'success' && authResult.url) {
      console.log('🔗 URL de callback Microsoft recibida:', authResult.url);
      
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
      
      console.log('🔑 Microsoft Access Token:', accessToken ? '✅' : '❌');
      console.log('🔄 Microsoft Refresh Token:', refreshToken ? '✅' : '❌');
      
      if (errorParam) {
        console.error('❌ Error en callback Microsoft:', errorParam);
        return { success: false, error: errorParam };
      }
      
      if (accessToken && refreshToken) {
        console.log('💾 Estableciendo sesión Microsoft...');
        
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('❌ Error estableciendo sesión Microsoft:', sessionError);
          return { success: false, error: sessionError.message };
        }

        // Crear o actualizar perfil de usuario
        if (sessionData.user) {
          await createOrUpdateUserProfile(sessionData.user, 'microsoft');
        }

        console.log('✅ Login Microsoft exitoso');
        return { success: true, user: sessionData.user };
      } else {
        console.error('❌ No se encontraron tokens Microsoft en la respuesta');
        return { success: false, error: 'No se pudieron obtener los tokens de Microsoft' };
      }
    }

    if (authResult.type === 'cancel') {
      console.log('⏹️ Usuario canceló la autenticación Microsoft');
      return { success: false, error: 'Autenticación Microsoft cancelada' };
    }

    console.error('❌ Tipo de resultado Microsoft no reconocido:', authResult.type);
    return { success: false, error: 'No se pudo completar la autenticación Microsoft' };
    
  } catch (error: any) {
    console.error('❌ Error inesperado Microsoft:', error);
    return { success: false, error: error.message };
  }
};

// Función para crear o actualizar el perfil del usuario
const createOrUpdateUserProfile = async (user: any, provider: string) => {
  try {
    console.log('👤 Creando/actualizando perfil de usuario...');
    
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error buscando perfil existente:', fetchError);
      return;
    }

    const profileData = {
      user_id: user.id,
      email: user.email,
      provider: provider,
      updated_at: new Date().toISOString(),
    };

    if (existingProfile) {
      // Actualizar perfil existente
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error actualizando perfil:', updateError);
      } else {
        console.log('✅ Perfil actualizado');
      }
    } else {
      // Crear nuevo perfil
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          ...profileData,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error creando perfil:', insertError);
      } else {
        console.log('✅ Perfil creado');
      }
    }
  } catch (error) {
    console.error('Error en createOrUpdateUserProfile:', error);
  }
};

// Función para obtener el perfil del usuario
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    return null;
  }
};

// Función para actualizar nombre y apellido
export const updateUserNames = async (
  userId: string, 
  firstName: string, 
  lastName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error actualizando nombres:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Nombres actualizados correctamente');
    return { success: true };
  } catch (error: any) {
    console.error('Error en updateUserNames:', error);
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

// Agregar esta función a tu archivo lib/supabase.ts después de las funciones de Google y Microsoft

// 🔥 NUEVA FUNCIÓN PARA FACEBOOK OAUTH
export const signInWithFacebook = async () => {
  try {
    console.log('🔄 Iniciando autenticación con Facebook...');
    
    // URL de redirect mejorada para Expo
    const redirectUrl = Linking.createURL('/');
    console.log('🔗 Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: redirectUrl,
        scopes: 'email public_profile',
      },
    });

    if (error) {
      console.error('❌ Error generando URL OAuth Facebook:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ URL OAuth Facebook generada');

    const authResult = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl
    );

    console.log('📱 Resultado Facebook:', authResult);

    if (authResult.type === 'success' && authResult.url) {
      console.log('🔗 URL de callback Facebook recibida:', authResult.url);
      
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
      
      console.log('🔑 Facebook Access Token:', accessToken ? '✅' : '❌');
      console.log('🔄 Facebook Refresh Token:', refreshToken ? '✅' : '❌');
      
      if (errorParam) {
        console.error('❌ Error en callback Facebook:', errorParam);
        return { success: false, error: errorParam };
      }
      
      if (accessToken && refreshToken) {
        console.log('💾 Estableciendo sesión Facebook...');
        
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error('❌ Error estableciendo sesión Facebook:', sessionError);
          return { success: false, error: sessionError.message };
        }

        // Crear o actualizar perfil de usuario
        if (sessionData.user) {
          await createOrUpdateUserProfile(sessionData.user, 'facebook');
        }

        console.log('✅ Login Facebook exitoso');
        return { success: true, user: sessionData.user };
      } else {
        console.error('❌ No se encontraron tokens Facebook en la respuesta');
        return { success: false, error: 'No se pudieron obtener los tokens de Facebook' };
      }
    }

    if (authResult.type === 'cancel') {
      console.log('⏹️ Usuario canceló la autenticación Facebook');
      return { success: false, error: 'Autenticación Facebook cancelada' };
    }

    console.error('❌ Tipo de resultado Facebook no reconocido:', authResult.type);
    return { success: false, error: 'No se pudo completar la autenticación Facebook' };
    
  } catch (error: any) {
    console.error('❌ Error inesperado Facebook:', error);
    return { success: false, error: error.message };
  }
};