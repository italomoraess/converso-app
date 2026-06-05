/* CONVERSO Mobile — Sparkline area chart. Ported from dashboard.jsx. */
import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { colors } from '@/theme/tokens';

export function Sparkline({
  data,
  w = 120,
  h = 40,
  color = colors.primary,
  gradId = 'spk',
}: {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  gradId?: string;
}) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - (v / max) * (h - 6) - 3,
  ]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L${w} ${h} L0 ${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.28} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={area} fill={`url(#${gradId})`} />
      <Path d={d} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={last[0]} cy={last[1]} r={3.5} fill={color} stroke="#fff" strokeWidth={2} />
    </Svg>
  );
}
