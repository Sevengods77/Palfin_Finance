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
  });

  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('home'); // 'home', 'dashboard', 'tools', 'history'
  const [loginVisible, setLoginVisible] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targetSection, setTargetSection] = useState(null); // For scrolling to sections

  const mainScrollViewRef = useRef(null);
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

  // Handle Public Page Scrolling
  useEffect(() => {
    if (!user && targetSection === 'tools' && toolsRef.current && mainScrollViewRef.current) {
      toolsRef.current.measure((x, y, width, height, pageX, pageY) => {
        // In a ScrollView, we need the relative position usually, but measure gives absolute page coordinates.
        // A simpler way for vertical ScrollView is to use the layout Y if direct child, or measureLayout.
        // For simplicity in this structure:
        // The ScrollView contains PublicHome then ToolsSection.
        // We can just scroll to the Y offset.

        // NOTE: measure() might be tricky inside ScrollView without native ref handling.
        // Let's rely on onLayout of the view container to get Y.
      });
    }
  }, [user, targetSection]);

  const handleLogout = async () => {
    await signOutUser();
    setRoute('home');
  };

  const handleNavigate = (dest) => {
    if (dest === 'tools') {
      if (user) {
        setRoute('dashboard');
        setTargetSection('tools');
      } else {
        setRoute('home');
        setTargetSection('tools');

        // Trigger scroll if we are already on home
        // We use a small timeout to let render happen or state update
        setTimeout(() => {
          scrollToTools();
        }, 100);
      }
    } else {
      setRoute(dest);
      setTargetSection(null);
    }
  };

  const scrollToTools = () => {
    if (toolsRef.current && mainScrollViewRef.current) {
      toolsRef.current.measureLayout(
        Platform.OS === 'web' ? mainScrollViewRef.current.getScrollableNode() : React.findNodeHandle(mainScrollViewRef.current),
        (x, y) => {
          mainScrollViewRef.current.scrollTo({ y: y, animated: true });
          setTargetSection(null); // Reset
        },
        () => {
          // Fallback for failure: just scroll to a guess or bottom
          mainScrollViewRef.current.scrollToEnd({ animated: true });
          setTargetSection(null);
        }
      );
    }
  };

  // Also simplified approach: OnLayout capture
  const [toolsY, setToolsY] = useState(0);

  const renderContent = () => {
    // Only block on auth loading; don't block the whole UI if the web font fails to load.
    if (loading) {
      return (
        <View style={[sharedStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (user) {
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
        <ScrollView
          ref={mainScrollViewRef}
          style={sharedStyles.container}
        >
          <PublicHome
            onLoginClick={() => setLoginVisible(true)}
            onSignupClick={() => setSignupVisible(true)}
            onScrollToTools={() => handleNavigate('tools')}
          />
          <View
            ref={toolsRef}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setToolsY(layout.y);
              // If we were waiting to scroll
              if (targetSection === 'tools' && layout.y > 0) {
                mainScrollViewRef.current?.scrollTo({ y: layout.y, animated: true });
                setTargetSection(null);
              }
            }}
          >
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

