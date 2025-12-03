import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { theme } from './src/theme/theme';
import { sharedStyles } from './src/theme/sharedStyles';
import { getInitialSession, subscribeAuthChange, signOutUser } from './src/services/auth';

// Components
import TopBar from './src/components/Layout/TopBar';
import PublicHome from './src/components/Home/PublicHome';
import ToolsSection from './src/components/Home/ToolsSection';
import DashboardScreen from './src/components/Dashboard/DashboardScreen';
import LoginModal from './src/components/Auth/LoginModal';
import SignupModal from './src/components/Auth/SignupModal';
import FinizeChatWidget from './src/components/Finize/FinizeChatWidget';

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('home'); // 'home', 'dashboard', 'tools'
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const scrollToTools = () => {
    setRoute('tools');
    // In a real app with a router, we might scroll. 
    // Here we just switch view or if on home, we could scroll.
    // For simplicity in this state-based router, 'tools' is a view or a section.
    // If we are on public home, tools is a section below.
    // If authenticated, tools is a separate screen.
  };

  const renderContent = () => {
    if (loading) {
      return <View style={sharedStyles.container} />;
    }

    if (user) {
      // Authenticated Routes
      switch (route) {
        case 'dashboard':
          return <DashboardScreen user={user} />;
        case 'tools':
          return (
            <ScrollView style={sharedStyles.container}>
              <ToolsSection />
            </ScrollView>
          );
        default:
          return <DashboardScreen user={user} />;
      }
    } else {
      // Public Routes
      return (
        <ScrollView style={sharedStyles.container}>
          <PublicHome
            onLoginClick={() => setLoginVisible(true)}
            onSignupClick={() => setSignupVisible(true)}
            onScrollToTools={scrollToTools}
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
        onNavigate={setRoute}
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
