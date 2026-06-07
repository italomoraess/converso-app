/* CONVERSO Mobile — RN UI primitives. Mirrors mobile/ui.jsx.
   CVButton, CVCard, Avatar, Badge, Field, SectionHead, Wordmark, LogoMark, StatPill. */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  Animated,
  Easing,
  DimensionValue,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { Icon, IconName } from './Icon';
import { colors, radii, fonts, mix, alpha } from '@/theme/tokens';

/* ----------------------------- CVButton ----------------------------- */

type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const BTN_SIZES: Record<ButtonSize, { h: number; px: number; fs: number }> = {
  sm: { h: 38, px: 14, fs: 14 },
  md: { h: 50, px: 18, fs: 15.5 },
  lg: { h: 56, px: 22, fs: 16.5 },
};

export function CVButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  full,
  onPress,
  style,
  textColor,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  full?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}) {
  const s = BTN_SIZES[size];
  const variants: Record<ButtonVariant, { bg: string; color: string; border?: string }> = {
    primary: { bg: colors.primary, color: colors.onPrimary },
    soft: { bg: colors.primarySoft, color: colors.primary },
    ghost: { bg: 'transparent', color: colors.textMuted },
    outline: { bg: colors.surface, color: colors.text, border: colors.borderStrong },
    danger: { bg: alpha(colors.danger, 0.12), color: colors.danger },
  };
  const v = variants[variant];
  const fg = textColor ?? v.color;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: s.h,
          paddingHorizontal: s.px,
          borderRadius: radii.md,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
          backgroundColor: v.bg,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border,
          width: full ? '100%' : undefined,
          flexShrink: full ? 1 : 0,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          ...(variant === 'primary' ? shadow.primary : {}),
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 17 : 19} stroke={2.2} color={fg} />}
      <Text style={{ color: fg, fontSize: s.fs, fontWeight: '700', fontFamily: fonts.ui }}>
        {children}
      </Text>
    </Pressable>
  );
}

/* ----------------------------- Skeleton ----------------------------- */

export function Skeleton({
  w = '100%',
  h = 14,
  r = 8,
  style,
}: {
  w?: DimensionValue;
  h?: DimensionValue;
  r?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const op = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(op, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(op, { toValue: 0.5, duration: 750, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [op]);
  return (
    <Animated.View
      style={[
        { width: w, height: h, borderRadius: r, backgroundColor: mix(colors.text, 9, colors.surface), opacity: op },
        style,
      ]}
    />
  );
}

/* ------------------------------ CVCard ------------------------------ */

export function CVCard({
  children,
  style,
  pad = 16,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pad?: number;
  onPress?: () => void;
}) {
  const content = (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: pad,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadow.sm,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
        {content}
      </Pressable>
    );
  }
  return content;
}

/* ------------------------------ Avatar ------------------------------ */

export function Avatar({
  ini,
  cor,
  size = 40,
  ring,
}: {
  ini: string;
  cor?: string;
  size?: number;
  ring?: boolean;
}) {
  const accent = cor || colors.primary;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: cor ? mix(cor, 22, colors.surface) : colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: ring ? 2 : 0,
        borderColor: ring ? accent : undefined,
      }}
    >
      <Text
        style={{
          color: accent,
          fontWeight: '800',
          fontSize: size * 0.36,
          fontFamily: fonts.display,
        }}
      >
        {ini}
      </Text>
    </View>
  );
}

/* ------------------------------ Badge ------------------------------- */

export function Badge({
  children,
  color = colors.textMuted,
  soft = true,
  dot,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  soft?: boolean;
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 5,
          paddingLeft: dot ? 9 : 11,
          paddingRight: 11,
          borderRadius: radii.pill,
          backgroundColor: soft ? alpha(color, 0.16) : color,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {dot && <View style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: color }} />}
      <Text style={{ color: soft ? color : '#fff', fontSize: 12.5, fontWeight: '700' }}>
        {children}
      </Text>
    </View>
  );
}

/* ------------------------------ Field ------------------------------- */

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  icon,
  right,
  hint,
  area,
}: {
  label?: string;
  value?: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  icon?: IconName;
  right?: React.ReactNode;
  hint?: string;
  area?: boolean;
}) {
  const [foc, setFoc] = useState(false);
  return (
    <View>
      {label && (
        <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: area ? 'flex-start' : 'center',
          gap: 10,
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: foc ? colors.primary : colors.borderStrong,
          borderRadius: radii.md,
          paddingHorizontal: 14,
          paddingVertical: area ? 13 : 0,
          height: area ? undefined : 52,
        }}
      >
        {icon && <Icon name={icon} size={19} color={colors.textSubtle} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={area}
          numberOfLines={area ? 3 : 1}
          onFocus={() => setFoc(true)}
          onBlur={() => setFoc(false)}
          style={{
            flex: 1,
            fontSize: 15.5,
            color: colors.text,
            fontFamily: fonts.ui,
            paddingVertical: area ? 0 : 0,
            minHeight: area ? 66 : undefined,
            textAlignVertical: area ? 'top' : 'center',
          }}
        />
        {right}
      </View>
      {hint && (
        <Text style={{ fontSize: 12.5, color: colors.textSubtle, marginTop: 7 }}>{hint}</Text>
      )}
    </View>
  );
}

/* ---------------------------- SectionHead --------------------------- */

export function SectionHead({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 13,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, fontFamily: fonts.display }}>
        {title}
      </Text>
      {action && (
        <Pressable onPress={onAction}>
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

/* ----------------------------- LogoMark ----------------------------- */

export function LogoMark({ size = 30, light }: { size?: number; light?: boolean }) {
  const gid = 'lg' + (light ? 'L' : '');
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={light ? '#fff' : colors.cv500} />
          <Stop offset="1" stopColor={light ? '#E0E3FF' : colors.cv700} />
        </LinearGradient>
      </Defs>
      <Path
        d="M16 3C9 3 3.5 7.6 3.5 13.4c0 3.2 1.7 6 4.4 7.9L7 27l6-3.2c1 .2 2 .3 3 .3 7 0 12.5-4.6 12.5-10.7S23 3 16 3z"
        fill={`url(#${gid})`}
      />
      <Path
        d="M11 11.5h10M11 15.5h6"
        stroke={light ? colors.primary : '#fff'}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* ----------------------------- Wordmark ----------------------------- */

export function Wordmark({ size = 26, light }: { size?: number; light?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <LogoMark size={size * 1.05} light={light} />
      <Text
        style={{
          fontFamily: fonts.display,
          fontWeight: '800',
          fontSize: size,
          letterSpacing: -0.6,
          color: light ? '#fff' : colors.text,
        }}
      >
        Converso
      </Text>
    </View>
  );
}

/* ----------------------------- StatPill ----------------------------- */

export function StatPill({
  icon,
  label,
  value,
  color = colors.primary,
}: {
  icon: IconName;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(color, 0.16),
        }}
      >
        <Icon name={icon} size={17} stroke={2.2} color={color} />
      </View>
      <View>
        <Text style={{ fontSize: 15, fontWeight: '800', color: colors.text }}>{value}</Text>
        <Text style={{ fontSize: 11.5, color: colors.textSubtle, fontWeight: '600' }}>{label}</Text>
      </View>
    </View>
  );
}

/* ---------------------------- EmptyState ---------------------------- */

export function EmptyState({
  icon,
  title,
  sub,
}: {
  icon: IconName;
  title: string;
  sub?: string;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 20 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          backgroundColor: colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}
      >
        <Icon name={icon} size={30} color={colors.primary} />
      </View>
      <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>{title}</Text>
      {sub && (
        <Text style={{ fontSize: 14, marginTop: 4, color: colors.textSubtle, textAlign: 'center' }}>
          {sub}
        </Text>
      )}
    </View>
  );
}

/* ------------------------------ shadows ----------------------------- */

export const shadow = StyleSheet.create({
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 14,
  },
  primary: {
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});

export const textStyles: { [k: string]: TextStyle } = {};
