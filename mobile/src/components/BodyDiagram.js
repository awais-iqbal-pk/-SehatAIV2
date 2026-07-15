import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';

export default function BodyDiagram({ onSelectPart }) {
  const parts = [
    { id: 'Head', path: 'M50,10 Q60,10 65,20 Q70,30 65,40 Q60,50 50,50 Q40,50 35,40 Q30,30 35,20 Q40,10 50,10', color: '#FFCDD2' },
    { id: 'Chest', path: 'M30,55 L70,55 L75,85 L25,85 Z', color: '#E1BEE7' },
    { id: 'Abdomen', path: 'M25,90 L75,90 L70,130 L30,130 Z', color: '#C8E6C9' },
    { id: 'Left Arm', path: 'M20,60 L5,110 L15,115 L25,65 Z', color: '#BBDEFB' },
    { id: 'Right Arm', path: 'M80,60 L95,110 L85,115 L75,65 Z', color: '#BBDEFB' },
    { id: 'Left Leg', path: 'M35,135 L30,200 L45,200 L50,140 Z', color: '#FFF9C4' },
    { id: 'Right Leg', path: 'M65,135 L70,200 L55,200 L50,140 Z', color: '#FFF9C4' },
  ];

  return (
    <View style={s.container}>
      <Svg height="300" width="200" viewBox="0 0 100 210">
        <G>
          {parts.map((p) => (
            <Path
              key={p.id}
              d={p.path}
              fill={p.color}
              stroke="#666"
              strokeWidth="0.5"
              onPress={() => onSelectPart(p.id)}
            />
          ))}
        </G>
      </Svg>
      <View style={s.legend}>
        {parts.map(p => (
          <TouchableOpacity key={p.id} onPress={() => onSelectPart(p.id)} style={[s.chip, { backgroundColor: p.color }]}>
            <Text style={s.chipText}>{p.id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 20 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: '#ddd' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#333' }
});
