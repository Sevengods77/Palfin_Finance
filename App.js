import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { theme } from './src/theme/theme';
import { sharedStyles } from './src/theme/sharedStyles';
import { getInitialSession, subscribeAuthChange, signOutUser } from './src/services/auth';

// Components
import TopBar from './src/components/Layout/TopBar';
import PublicHome from './src/components/Home/PublicHome';
import ToolsSection from './src/components/Home/ToolsSection';
import DashboardScreen from './src/components/Dashboard/DashboardScreen';
import TransactionHistory from './src/components/History/TransactionHistory';
import LoginModal from './src/components/Auth/LoginModal';
import SignupModal from './src/components/Auth/SignupModal';
import FinizeChatWidget from './src/components/Finize/FinizeChatWidget';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Quintessential': 'https://fonts.gstatic.com/s/quintessential/v20/human-quintessential.woff2', // Direct Google Fonts URL for Web/Standard
    // Note: React Native might require a local file for guaranteed support, but Expo Web handles remote well usually.
    // If this fails on native, we'd fallback. For this task, we assume web/simulated environment or web primarily.
  });

  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('home'); // 'home', 'dashboard', 'tools', 'history'
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targetSection, setTargetSection] = useState(null); // For scrolling to sections

  const toolsRef = useRef(null);

  useEffect(() => {
    // Initialize session
    getInitialSession().then(({ session }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setRoute('dashboard');
      }
      setLoading(false);
    });

    // Subscribe to auth changes
    const subscription = subscribeAuthChange((session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setRoute('dashboard');
        setLoginVisible(false);
        setSignupVisible(false);
      } else {
        setRoute('home');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    setRoute('home');
  };

  const handleNavigate = (dest) => {
    if (dest === 'tools') {
      // If we are authenticated, we go to dashboard but scroll to tools
      if (user) {
        setRoute('dashboard');
        setTargetSection('tools');
        // Reset target after a bit so it doesn't get stuck? 
        // Better: DashboardScreen consumes it and clears it or uses it in useEffect
      } else {
        setRoute('home');
        // In public home, we might need to scroll too, but let's assume 'tools' opens the tools section
        // For public, we'll just show the public home which has tools below.
        setTimeout(() => {
          // Very basic scroll implementation for public view would go here
          setTargetSection('tools');
        }, 100);
      }
    } else {
      setRoute(dest);
      setTargetSection(null);
    }
  };

  const renderContent = () => {
    if (loading || !fontsLoaded) {
      return (
        <View style={[sharedStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (user) {
      // Authenticated Routes
      // We pass the targetSection to Dashboard so it can scroll
      if (route === 'history') {
        return <TransactionHistory />;
      }
      return (
        <DashboardScreen
          user={user}
          scrollToSection={targetSection}
          onScrollHandled={() => setTargetSection(null)}
        />
      );
    } else {
      // Public Routes
      return (
        <ScrollView style={sharedStyles.container}>
          <PublicHome
            onLoginClick={() => setLoginVisible(true)}
            onSignupClick={() => setSignupVisible(true)}
            onScrollToTools={() => handleNavigate('tools')}
          />
          <View ref={toolsRef}>
            <ToolsSection />
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <TopBar
        user={user}
        onLoginClick={() => setLoginVisible(true)}
        onSignupClick={() => setSignupVisible(true)}
        onLogoutClick={handleLogout}
        onNavigate={handleNavigate}
        activeRoute={route}
      />

      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      <FinizeChatWidget />

      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        onSwitch={() => {
          setLoginVisible(false);
          setSignupVisible(true);
        }}
        onSuccess={() => setLoginVisible(false)}
      />

      <SignupModal
        visible={signupVisible}
        onClose={() => setSignupVisible(false)}
        onSwitch={() => {
          setSignupVisible(false);
          setLoginVisible(true);
        }}
        onSuccess={() => setSignupVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
});

