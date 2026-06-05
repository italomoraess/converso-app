/* CONVERSO Mobile — top bar with greeting/title + optional avatar / back / right slot.
   Mirrors MobileTop from mobile/ui.jsx. */
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Icon } from './Icon';
import { Avatar } from './ui';
import { colors, fonts } from '@/theme/tokens';

export function MobileTop({
  title,
  sub,
  avatar,
  onAvatar,
  right,
  back,
  onBack,
}: {
  title: string;
  sub?: string;
  avatar?: string;
  onAvatar?: () => void;
  right?: React.ReactNode;
  back?: boolean;
  onBack?: () => void;
}) {
  return (
    <View
      style={{
        paddingTop: 8,
        paddingBottom: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {back && (
        <Pressable
          onPress={onBack}
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="chevL" size={22} color={colors.text} />
        </Pressable>
      )}
      <View style={{ flex: 1, minWidth: 0 }}>
        {sub ? (
          <Text style={{ fontSize: 13.5, color: colors.textMuted, fontWeight: '600', marginBottom: 2 }}>
            {sub}
          </Text>
        ) : null}
        {title ? (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 25,
              fontWeight: '800',
              color: colors.text,
              letterSpacing: -0.4,
              fontFamily: fonts.display,
            }}
          >
            {title}
          </Text>
        ) : null}
      </View>
      {right}
      {avatar && (
        <Pressable onPress={onAvatar}>
          <Avatar ini={avatar} size={44} />
        </Pressable>
      )}
    </View>
  );
}
