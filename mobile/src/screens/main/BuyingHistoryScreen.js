import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../utils/api';

export default function BuyingHistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get('/subscriptions/buying-history');
      setHistory(res.data.data || []);
    } catch (e) {
      console.log('History load failed');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const StatusPill = ({ status }) => {
    const colors = { success: '#4CAF50', pending: '#FF9800', failed: '#F44336' };
    return (
      <View style={[s.pill, { backgroundColor: (colors[status] || '#888') + '22', borderColor: colors[status] || '#888' }]}>
        <Text style={[s.pillText, { color: colors[status] || '#888' }]}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <LinearGradient colors={['#00897B', '#00695C']} style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={s.title}>Buying History</Text>
      </LinearGradient>

      {loading ? <ActivityIndicator style={{ marginTop: 50 }} color="#00897B" /> : (
        <FlatList
          data={history}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="receipt-outline" size={64} color="#ccc" />
              <Text style={s.emptyText}>No transactions found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={s.card}>
              <View style={s.cardRow}>
                <View>
                  <Text style={s.planName}>{item.plan === 'yearly' ? '💎 Yearly Premium' : '⭐ Monthly Premium'}</Text>
                  <Text style={s.date}>{new Date(item.createdAt).toLocaleDateString()} • {item.method?.toUpperCase()}</Text>
                </View>
                <StatusPill status={item.status} />
              </View>
              <View style={s.divider} />
              <View style={s.cardRow}>
                <Text style={s.invoice}>Invoice: {item.invoiceNumber}</Text>
                <Text style={s.amount}>PKR {item.amount?.toLocaleString()}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 15 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  date: { fontSize: 12, color: '#888', marginTop: 2 },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  pillText: { fontSize: 10, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  invoice: { fontSize: 11, color: '#aaa', fontFamily: 'monospace' },
  amount: { fontSize: 16, fontWeight: '900', color: '#00897B' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, color: '#888', fontSize: 16, fontWeight: '600' }
});
