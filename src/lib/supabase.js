import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Placeholder credentials - USER MUST REPLACE THESE
const SUPABASE_URL = 'https://pglimzxdckqlcvnfjvuf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbGltenhkY2txbGN2bmZqdnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDUzNTAsImV4cCI6MjA4MDMyMTM1MH0.Gwi8PxBFlsZIm0PBZsAhTcgvIikL0O44X2SS_pAXEuU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
    },
});
