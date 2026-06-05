/* CONVERSO Mobile — Splash screen. Navigates to /login after ~1.8s.
   Ported from SplashScreen in mobile/auth.jsx. */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { LogoMark } from '@/components/ui';
import { colors } from '@/theme/tokens';

export default function Splash() {
  const pop = useRef(new Animated.Value(0)).current;
  const dot0 = useRef(new Animated.Value(1)).current;
  const dot1 = useRef(new Animated.Value(1)).current;
  const dot2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 6, tension: 80 }).start();

    const pulse = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 0.45, duration: 500, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(v, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      );
    const anims = [pulse(dot0, 0), pulse(dot1, 180), pulse(dot2, 360)];
    anims.forEach((a) => a.start());

    const t = setTimeout(() => router.replace('/login'), 1800);
    return () => {
      clearTimeout(t);
      anims.forEach((a) => a.stop());
    };
  }, [pop, dot0, dot1, dot2]);

  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cv700, overflow: 'hidden' }}>
      <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} width="100%" height="100%">
        <Defs>
          <RadialGradient id="g1" cx="80%" cy="10%" r="60%">
            <Stop offset="0" stopColor={colors.cv600} />
            <Stop offset="1" stopColor={colors.cv900} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" />
      </Svg>

      <Animated.View style={{ alignItems: 'center', gap: 22, opacity: pop, transform: [{ scale }] }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LogoMark size={56} light />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: '800', fontSize: 38, color: '#fff', letterSpacing: -1 }}>Converso</Text>
          <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', fontWeight: '600', marginTop: 4 }}>
            CRM para quem trabalha por conta
          </Text>
        </View>
      </Animated.View>

      <View style={{ position: 'absolute', bottom: 70, flexDirection: 'row', gap: 7 }}>
        {[dot0, dot1, dot2].map((v, i) => (
          <Animated.View
            key={i}
            style={{ width: 8, height: 8, borderRadius: 99, backgroundColor: '#fff', opacity: v }}
          />
        ))}
      </View>
    </View>
  );
}
