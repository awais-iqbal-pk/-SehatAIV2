import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BodyDiagram from '../../components/BodyDiagram';

export default function BodySelectScreen({ navigation }) {
  const handleSelect = (part) => {
    navigation.navigate('Chat', { module: 'BODY_DIAGRAM', selectedBodyPart: part });
  };

  return (
    <View style={s.container}>
      <LinearGradient colors={['#00897B', '#00695C']} style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={s.title}>Select Body Part</Text>
      </LinearGradient>
      <View style={s.content}>
        <Text style={s.instruction}>Tap on the diagram to describe symptoms in that area</Text>
        <BodyDiagram onSelectPart={handleSelect} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 15 },
  title: { fontSize: 22, fontWeight: '900', color: '#fff' },
  content: { flex: 1, padding: 20, alignItems: 'center' },
  instruction: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 10 }
});
