import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function BookingWebViewScreen({ navigation, route }) {
  const { url, doctorName } = route.params || {};

  const injectedJS = `
    // Hide headers and footers of third-party sites for a native feel
    const selectors = ['header', 'footer', '.nav', '.footer-wrapper', '#header', '#footer'];
    selectors.forEach(s => {
      const el = document.querySelector(s);
      if (el) el.style.display = 'none';
    });
    true;
  `;

  return (
    <View style={s.container}>
      <LinearGradient colors={['#00897B', '#00695C']} style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Booking: {doctorName}</Text>
          <Text style={s.subtitle}>Secure Booking via Partner</Text>
        </View>
      </LinearGradient>

      <WebView
        source={{ uri: url }}
        injectedJavaScript={injectedJS}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={s.loading}>
            <ActivityIndicator size="large" color="#00897B" />
            <Text style={{ marginTop: 10, color: '#666' }}>Connecting to partner clinic...</Text>
          </View>
        )}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes('/booking-success') || navState.url.includes('thank-you')) {
            // Future: Fire success event to backend
            console.log('Booking detected successfully');
          }
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 15 },
  title: { fontSize: 16, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  loading: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }
});
