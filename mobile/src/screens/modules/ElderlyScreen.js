import React,{useState} from 'react';
import {View,Text,TouchableOpacity,ScrollView,TextInput,Alert,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function ElderlyScreen({navigation}){
  const [reminders,setR]=useState([]);const [mn,setMN]=useState('');
  const [readings,setRd]=useState([]);const [loading,setLoading]=useState(false);

  // States for pickers
  const [showTime, setShowTime] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [timeStr, setTimeStr] = useState('08:00 AM');

  const [bpSys, setBpSys] = useState('120');
  const [bpDia, setBpDia] = useState('80');
  const [sugarVal, setSugarVal] = useState('100');

  const onTimeChange = (event, selectedDate) => {
    setShowTime(false);
    if (selectedDate) {
      setTempTime(selectedDate);
      setTimeStr(selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const deleteReminder = (id) => {
    setR(p => p.filter(r => r.id !== id));
  };

  const renderRightActions = (id) => (
    <TouchableOpacity onPress={() => deleteReminder(id)} style={s.deleteBtn}>
      <Ionicons name="trash" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return(<GestureHandlerRootView style={{flex:1}}><View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#0288D1','#01579B']} style={{paddingTop:56,paddingBottom:24,paddingHorizontal:20}}>
      <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginBottom:12}}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:24,fontWeight:'900',color:'#fff'}}>👴 Elderly Care</Text>
      <Text style={{fontSize:14,color:'rgba(255,255,255,0.8)',marginTop:4}}>Medicine reminders & health tracking</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:16}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>💊 Add Medicine Reminder</Text>
        <View style={{flexDirection:'row',gap:8,marginBottom:8}}>
          <View style={{flex:2,backgroundColor:'#f5f5f5',borderRadius:12,paddingHorizontal:12,borderWidth:1,borderColor:'#ebebeb'}}><TextInput style={{fontSize:14,paddingVertical:12}} placeholder="Medicine name" value={mn} onChangeText={setMN} placeholderTextColor="#bbb"/></View>
          <TouchableOpacity onPress={() => setShowTime(true)} style={{flex:1,backgroundColor:'#f5f5f5',borderRadius:12,paddingHorizontal:12,borderWidth:1,borderColor:'#ebebeb', justifyContent:'center'}}>
            <Text style={{fontSize:13, color: '#333'}}>{timeStr}</Text>
          </TouchableOpacity>
        </View>
        {showTime && <DateTimePicker value={tempTime} mode="time" is24Hour={false} display="default" onChange={onTimeChange} />}
        <TouchableOpacity onPress={()=>{if(!mn){Alert.alert('Enter name');return;}setR(p=>[...p,{id:Date.now(),name:mn,time:timeStr,taken:false}]);setMN('');}} style={{backgroundColor:'#0288D1',padding:12,borderRadius:12,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700'}}>+ Add Reminder</Text></TouchableOpacity>
      </View>
      {reminders.length>0&&<View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:16}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>Today's Medicines (Swipe to delete)</Text>
        {reminders.map(r=>(
          <Swipeable key={r.id} renderRightActions={() => renderRightActions(r.id)}>
            <View style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderColor:'#f0f0f0', backgroundColor:'#fff'}}>
              <Text style={{flex:1,fontSize:14,color:'#1a1a1a'}}>{r.name}</Text>
              <Text style={{fontSize:13,color:'#888',marginRight:12}}>{r.time}</Text>
              <TouchableOpacity onPress={()=>setR(p=>p.map(x=>x.id===r.id?{...x,taken:!x.taken}:x))} style={{paddingHorizontal:12,paddingVertical:6,borderRadius:10,backgroundColor:r.taken?'#e8f5e9':'#f5f5f5'}}>
                <Text style={{fontSize:12,fontWeight:'700',color:r.taken?'#4CAF50':'#888'}}>{r.taken?'✓ Taken':'Mark Taken'}</Text>
              </TouchableOpacity>
            </View>
          </Swipeable>
        ))}
      </View>}
      <View style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:16}}>
        <Text style={{fontSize:16,fontWeight:'700',color:'#333',marginBottom:12}}>📊 Log Health Reading</Text>
        <View style={{flexDirection:'row',gap:5,marginBottom:8, height: 120}}>
          <View style={{flex:1, backgroundColor:'#f5f5f5', borderRadius:12}}>
            <Text style={s.label}>SYS</Text>
            <Picker selectedValue={bpSys} onValueChange={(v)=>setBpSys(v)} style={{height: 50}}>{Array.from({length:100},(_,i)=>i+90).map(v=><Picker.Item key={v} label={String(v)} value={v.toString()} />)}</Picker>
          </View>
          <View style={{flex:1, backgroundColor:'#f5f5f5', borderRadius:12}}>
            <Text style={s.label}>DIA</Text>
            <Picker selectedValue={bpDia} onValueChange={(v)=>setBpDia(v)} style={{height: 50}}>{Array.from({length:60},(_,i)=>i+50).map(v=><Picker.Item key={v} label={String(v)} value={v.toString()} />)}</Picker>
          </View>
          <View style={{flex:1, backgroundColor:'#f5f5f5', borderRadius:12}}>
            <Text style={s.label}>SUGAR</Text>
            <Picker selectedValue={sugarVal} onValueChange={(v)=>setSugarVal(v)} style={{height: 50}}>{Array.from({length:300},(_,i)=>i+50).map(v=><Picker.Item key={v} label={String(v)} value={v.toString()} />)}</Picker>
          </View>
        </View>
        <TouchableOpacity onPress={async()=>{
          if(!bpSys || !bpDia && !sugarVal) return;
          setLoading(true);
          try {
            if (bpSys && bpDia) {
              await api.post('/users/vitals', { type: 'bp', value: `${bpSys}/${bpDia}`, numericValue: parseInt(bpSys) });
            }
            if (sugarVal) {
              await api.post('/users/vitals', { type: 'sugar', value: sugarVal, numericValue: parseInt(sugarVal) });
            }
            setRd(p=>[...p,{id:Date.now(),bp:`${bpSys}/${bpDia}`,sugar:sugarVal,date:new Date().toLocaleString()}]);
            Alert.alert('Logged', 'Your readings have been saved to your records.');
          } catch (e) {
            Alert.alert('Error', 'Failed to save readings');
          } finally {
            setLoading(false);
          }
        }} style={{backgroundColor:'#0288D1',padding:12,borderRadius:12,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700'}}>+ Log Reading</Text></TouchableOpacity>
      </View>
      {readings.slice(-3).reverse().map(r=><View key={r.id} style={{backgroundColor:'#E1F5FE',borderRadius:12,padding:12,marginBottom:8,flexDirection:'row',justifyContent:'space-between'}}>
        <View>{r.bp&&<Text style={{fontSize:13,fontWeight:'600'}}>BP: {r.bp}</Text>}{r.sugar&&<Text style={{fontSize:13,fontWeight:'600'}}>Sugar: {r.sugar} mg/dL</Text>}</View>
        <Text style={{fontSize:11,color:'#888'}}>{r.date}</Text>
      </View>)}
      <TouchableOpacity onPress={()=>navigation.navigate('Chat',{ module: 'ELDERLY' })} style={{backgroundColor:'#0288D1',padding:16,borderRadius:14,alignItems:'center',marginTop:8,marginBottom:24}}><Text style={{color:'#fff',fontWeight:'700',fontSize:15}}>🩺 Check Symptoms with AI</Text></TouchableOpacity>
    </ScrollView>
    <LoadingOverlay visible={loading} />
  </View></GestureHandlerRootView>);}

const s = StyleSheet.create({
  label: { fontSize: 10, fontWeight: '700', color: '#888', textAlign: 'center', marginTop: 5 },
  deleteBtn: { backgroundColor: '#F44336', justifyContent: 'center', alignItems: 'center', width: 70, height: '90%', borderRadius: 12, marginVertical: 5 }
});
