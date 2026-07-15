import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text } from 'react-native';

export default function LoadingOverlay({ visible, message = 'Loading...' }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={s.container}>
        <View style={s.box}>
          <ActivityIndicator size="large" color="#00897B" />
          <Text style={s.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    gap: 15,
    minWidth: 150,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
