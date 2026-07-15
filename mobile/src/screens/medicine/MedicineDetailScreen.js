import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,Linking} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
export default function MedicineDetailScreen({navigation,route}){
  const {medicine:m={}}=route.params||{};
  return(<View style={{flex:1,backgroundColor:'#f8f8f8'}}>
    <LinearGradient colors={['#1976D2','#0D47A1']} style={{paddingTop:56,paddingBottom:20,paddingHorizontal:20,flexDirection:'row',alignItems:'center',gap:14}}>
      <TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#fff"/></TouchableOpacity>
      <Text style={{fontSize:18,fontWeight:'800',color:'#fff',flex:1}} numberOfLines={1}>{m.name||'Medicine Detail'}</Text>
    </LinearGradient>
    <ScrollView style={{flex:1,padding:16}}>
      <View style={{backgroundColor:'#fff',borderRadius:20,padding:20,marginBottom:16,alignItems:'center'}}>
        <Text style={{fontSize:56,marginBottom:12}}>💊</Text>
        <Text style={{fontSize:22,fontWeight:'900',color:'#1a1a1a',textAlign:'center'}}>{m.name}</Text>
        {m.genericName&&<Text style={{fontSize:14,color:'#888',marginTop:4}}>{m.genericName}</Text>}
      </View>

      {m.aiAnalysis && (
        <View style={{backgroundColor:'#fff',borderRadius:16,padding:20,marginBottom:16,borderWidth:1,borderColor:'#e8e8e8'}}>
          <Text style={{fontSize:15,fontWeight:'700',color:'#333',marginBottom:10}}>🔬 AI Analysis & Web Grounding</Text>
          <Text style={{fontSize:14,color:'#444',lineHeight:22}}>{m.aiAnalysis}</Text>
        </View>
      )}

      {m.searchResults?.map((s,i)=>(
        <TouchableOpacity key={i} onPress={()=>Linking.openURL(s.link)} style={{backgroundColor:'#e8f5e9',borderRadius:12,padding:14,marginBottom:10,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:'#c8e6c9'}}>
          <Ionicons name="link-outline" size={20} color="#00897B"/>
          <View style={{flex:1}}><Text style={{fontSize:13,fontWeight:'700',color:'#1a1a1a'}} numberOfLines={1}>{s.title}</Text><Text style={{fontSize:11,color:'#666'}} numberOfLines={1}>{s.link}</Text></View>
        </TouchableOpacity>
      ))}

      {[{title:'Uses',data:[m.uses].flat().filter(Boolean),emoji:'✅'},{title:'Dosage',data:[m.dosage].filter(Boolean),emoji:'💊'},{title:'Side Effects',data:[m.sideEffects].flat().filter(Boolean),emoji:'⚠️'},{title:'Warnings',data:[m.warnings].flat().filter(Boolean),emoji:'🚫'}].map(sec=>sec.data&&sec.data.length>0&&(
        <View key={sec.title} style={{backgroundColor:'#fff',borderRadius:16,padding:16,marginBottom:12}}>
          <Text style={{fontSize:15,fontWeight:'700',color:'#1a1a1a',marginBottom:10}}>{sec.emoji} {sec.title}</Text>
          {sec.data.slice(0,3).map((d,i)=><Text key={i} style={{fontSize:13,color:'#555',lineHeight:20,marginBottom:6}}>• {typeof d==='string'?d.substring(0,250)+(d.length>250?'...':''):JSON.stringify(d)}</Text>)}
        </View>
      ))}
      <View style={{backgroundColor:'#E3F2FD',borderRadius:14,padding:14,marginBottom:20}}>
        <Text style={{fontSize:13,color:'#1565C0',textAlign:'center',lineHeight:20}}>⚠️ For reference only. Always consult a doctor or pharmacist before taking any medicine.</Text>
      </View>
    </ScrollView>
  </View>);}