import React,{useState,useCallback} from 'react';
import {View,Text,FlatList,TouchableOpacity,Alert,StyleSheet,ScrollView,Dimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import {LineChart} from 'react-native-chart-kit';
import api from '../../utils/api';

const {width} = Dimensions.get('window');

export default function HealthRecordsScreen({navigation}){
  const [data,setD]=useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [cons, vits] = await Promise.all([
        api.get('/consultations'),
        api.get('/users/vitals')
      ]);
      setD(cons.data.data || []);
      setVitals(vits.data.data || []);
    } catch (e) {} finally { setLoading(false); }
  };

  useFocusEffect(useCallback(()=>{ loadData(); },[]) );

  const del=(id)=>Alert.alert('Delete','Remove from your view?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:async()=>{await api.delete('/consultations/'+id).catch(()=>{});setD(d=>d.filter(c=>c._id!==id));}}]);

  const renderChart = (type, title, color) => {
    const filtered = vitals.filter(v => v.type === type).slice(-6);
    if (filtered.length < 2) return null;

    const chartData = {
      labels: filtered.map(v => new Date(v.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })),
      datasets: [{ data: filtered.map(v => v.numericValue || 0) }]
    };

    return (
      <View style={s.chartCard}>
        <Text style={s.chartTitle}>{title}</Text>
        <LineChart
          data={chartData}
          width={width - 64}
          height={180}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => color,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: color }
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
    );
  };

  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#00897B','#00695C']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}}>📊 Health Records</Text>
    </LinearGradient>

    <ScrollView style={{flex:1}}>
      <View style={{padding:16}}>
        <Text style={s.sectionTitle}>Vital Trends</Text>
        {renderChart('bp', 'Blood Pressure (Systolic)', '#E53935')}
        {renderChart('sugar', 'Blood Sugar (mg/dL)', '#0288D1')}
        {vitals.length === 0 && <View style={s.emptyVitals}><Text style={{color:'#aaa'}}>No vitals logged yet. Use Elderly Care to log BP/Sugar.</Text></View>}

        <Text style={[s.sectionTitle, {marginTop: 20}]}>Consultation History</Text>
        {data.map(c => (
          <TouchableOpacity key={c._id} onPress={()=>navigation.navigate('Chat',{consultationId:c._id})} style={s.recordCard}>
            <View style={s.iconCircle}><Text style={{fontSize:22}}>🤒</Text></View>
            <View style={{flex:1}}>
              <Text style={s.recordTitle} numberOfLines={1}>{c.title||'Consultation'}</Text>
              <Text style={s.recordDate}>{new Date(c.createdAt).toLocaleDateString()}</Text>
              {c.diagnosis?.condition&&<Text style={s.diagnosisText} numberOfLines={1}>{c.diagnosis.condition}</Text>}
            </View>
            <TouchableOpacity onPress={()=>del(c._id)} style={{padding:5}}><Ionicons name="trash-outline" size={18} color="#ccc"/></TouchableOpacity>
          </TouchableOpacity>
        ))}
        {data.length === 0 && <View style={s.emptyState}><Text style={{fontSize:48}}>📂</Text><Text style={s.emptyText}>No records yet</Text></View>}
      </View>
    </ScrollView>
  </View>);}

const s = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  chartCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#eee' },
  chartTitle: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 10 },
  recordCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#f0f0f0' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e8f5e9', alignItems: 'center', justifyCenter: 'center', paddingTop: 5 },
  recordTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  recordDate: { fontSize: 12, color: '#aaa' },
  diagnosisText: { fontSize: 12, color: '#00897B', marginTop: 2 },
  emptyVitals: { padding: 20, alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#888', marginTop: 12 }
});
