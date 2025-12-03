import React, { useRef, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, Image, Animated, TouchableOpacity } from 'react-native';
import stylesShared, { THEME } from './sharedStyles';

const images = [
  'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=60'
];

export default function HomeHero() {
  const overlay = useRef(new Animated.Value(0.6)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(overlay, { toValue: 0.35, duration: 2500, useNativeDriver: false }),
        Animated.timing(overlay, { toValue: 0.6, duration: 2500, useNativeDriver: false })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // per-card subtle float animations to give motion to the carousel images
  const cardAnims = useRef(images.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const loops = cardAnims.map((anim, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 2000 + idx * 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 2000 + idx * 300, useNativeDriver: true })
        ])
      )
    );
    Animated.stagger(150, loops).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      <ImageBackground source={{ uri: images[0] }} style={styles.background} imageStyle={{ borderRadius: 12 }}>
        <Animated.View style={[styles.overlay, { opacity: overlay }]} />

        <View style={styles.centeredContainer}>
          <Animated.View style={[styles.heroCard, { opacity: 1 }]}> 
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: THEME.primary, textAlign: 'center' }]}>Take Control of Your Money</Text>
                <Text style={[styles.subtitle, { color: '#222', textAlign: 'center' }]}>Smart categorization, clear insights and behavioral guidance to help you save more.</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={{ alignItems: 'center' }}>
              {images.map((src, i) => {
                const translateY = cardAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
                return (
                  <Animated.View key={i} style={[styles.card, styles.cardGlow, { transform: [{ translateY }]}]}>
                    <Image source={{ uri: src }} style={styles.cardImage} />
                    <Text style={styles.cardTitle}>{['Budget Smarter','Track Spending','Build Habits'][i]}</Text>
                    <Text style={[styles.cardDesc, { color: '#333' }]}>Actionable insights and personalized tips to improve finances.</Text>
                  </Animated.View>
                );
              })}
            </ScrollView>

            <View style={styles.scrollHintRow}>
              <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulse.interpolate({ inputRange: [0,1], outputRange: [1,1.6] }) }] }]} />
              <Text style={[styles.scrollHintText, { color: '#fff' }]}>Scroll for more</Text>
            </View>
          </Animated.View>
        </View>
      </ImageBackground>

      <View style={styles.sectionList}>
        <Text style={[stylesShared.sectionTitle, { textAlign: 'center', color: THEME.primary }]}>Quick Tools</Text>
        <View style={styles.toolsColumn}>
          <View style={[stylesShared.card, styles.toolCard] }>
            <Text style={{ fontWeight: '600', color: '#111' }}>Extract transactions</Text>
            <Text style={[stylesShared.mutedText, { color: '#444' }]}>Paste SMS or email receipts to extract merchant and amount automatically.</Text>
          </View>
          <View style={[stylesShared.card, styles.toolCard] }>
            <Text style={{ fontWeight: '600', color: '#111' }}>Auto categorization (coming)</Text>
            <Text style={[stylesShared.mutedText, { color: '#444' }]}>Finize will learn from your behaviour and suggest categories.</Text>
          </View>
          <View style={[stylesShared.card, styles.toolCard] }>
            <Text style={{ fontWeight: '600', color: '#111' }}>Behavioral insights</Text>
            <Text style={[stylesShared.mutedText, { color: '#444' }]}>Personalized nudges and suggestions to alter spending habits.</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  background: { height: 300, padding: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  heroContent: { flex: 1, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#fff', opacity: 0.95, marginBottom: 12, fontSize: 14 },
  carousel: { marginTop: 8, flexDirection: 'row' },
  card: { width: 220, marginRight: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', paddingBottom: 8 },
  cardImage: { width: '100%', height: 100 },
  cardTitle: { paddingHorizontal: 8, paddingTop: 8, fontWeight: '700' },
  cardDesc: { paddingHorizontal: 8, paddingTop: 4, color: '#666', fontSize: 12 },
  scrollHintRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  pulseDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff', marginRight: 8, opacity: 0.95 },
  scrollHintText: { color: '#fff', opacity: 0.95 },
  titleRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  decorImage: { width: 110, height: 110, borderRadius: 12, marginLeft: 12 }
  ,centeredContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroCard: { width: '100%', maxWidth: 920, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: 18, alignItems: 'center', shadowColor: THEME.primary, shadowOpacity: 0.12, shadowRadius: 18, elevation: 12 },
  cardGlow: { shadowColor: THEME.primary, shadowOpacity: 0.18, shadowRadius: 12, elevation: 8 },
  sectionList: { marginTop: 16, alignItems: 'center' },
  toolsColumn: { width: '100%', maxWidth: 520, alignItems: 'center' },
  toolCard: { width: '100%', marginVertical: 8, borderRadius: 12, shadowColor: THEME.primary, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 }
});
