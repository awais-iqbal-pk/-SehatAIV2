import React,{useState,useCallback} from 'react';
import {View,Text,FlatList,TouchableOpacity,Alert,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import api from '../../utils/api';

export default function MyAppointmentsScreen({navigation}){
  const [appts,setA]=useState([]);
  useFocusEffect(useCallback(()=>{api.get('/appointments').then(r=>setA(r.data.data||[])).catch(()=>{});},[]) );

  const StatusBadge = ({ status }) => {
    const config = {
      pending: { color: '#FF9800', bg: '#FFF3E0', icon: 'time' },
      confirmed: { color: '#4CAF50', bg: '#E8F5E9', icon: 'checkmark-circle' },
      cancelled: { color: '#F44336', bg: '#FFEBEE', icon: 'close-circle' },
      completed: { color: '#0288D1', bg: '#E1F5FE', icon: 'checkbox' }
    };
    const c = config[status] || config.pending;
    return (
      <View style={[s.badge, { backgroundColor: c.bg }]}>
        <Ionicons name={c.icon} size={12} color={c.color} />
        <Text style={[s.badgeText, { color: c.color }]}>{status?.toUpperCase()}</Text>
      </View>
    );
  };

  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>📅 My Appointments</Text>
    </LinearGradient>
    <FlatList data={appts} keyExtractor={i=>i._id} contentContainerStyle={{padding:16}}
      renderItem={({item:a})=>(
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.iconCircle}><Text style={{fontSize:22}}>👨‍⚕️</Text></View>
            <View style={{flex:1}}>
              <Text style={s.doctorName}>{a.doctorName}</Text>
              <Text style={s.specialty}>{a.specialty}</Text>
            </View>
            <StatusBadge status={a.status} />
          </View>
          <View style={s.divider} />
          <View style={s.cardFooter}>
            <View style={s.footerItem}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={s.footerText}>{new Date(a.dateTime).toLocaleDateString()}</Text>
            </View>
            <View style={s.footerItem}>
              <Ionicons name="time-outline" size={14} color="#888" />
              <Text style={s.footerText}>{new Date(a.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>
          {a.status === 'confirmed' && (
            <TouchableOpacity onPress={()=>Alert.alert('Booking Details', `Ref #: ${a.confirmationNumber || 'N/A'}`)} style={s.detailsBtn}>
              <Text style={s.detailsBtnText}>View Confirmation Details</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={<View style={{alignItems:'center',padding:40}}><Text style={{fontSize:48}}>📅</Text><Text style={{fontSize:16,fontWeight:'700',color:'#888',marginTop:12}}>No appointments yet</Text></View>}
    />
  </View>);}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e8f5e9', alignItems: 'center', justifyContent: 'center' },
  doctorName: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  specialty: { fontSize: 13, color: '#00897B' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  footerText: { fontSize: 12, color: '#666' },
  detailsBtn: { marginTop: 15, backgroundColor: '#f5f5f5', padding: 10, borderRadius: 10, alignItems: 'center' },
  detailsBtnText: { fontSize: 12, color: '#00897B', fontWeight: '700' }
});
