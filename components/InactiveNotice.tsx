/* CONVERSO Mobile — aviso de conta inativa.
   Importante: o app NÃO oferece pagamento (conformidade com a App Store).
   Apenas informa que o acesso expirou e orienta a ativar pelo site. */
import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from '@/components/Icon';
import { colors, radii, alpha } from '@/theme/tokens';
import { useData } from '@/lib/store';

export function InactiveNotice() {
  const { hasAccess } = useData();
  if (hasAccess) return null;

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 14 }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          padding: 16,
          borderRadius: radii.lg,
          backgroundColor: alpha(colors.warn, 0.12),
          borderWidth: 1,
          borderColor: alpha(colors.warn, 0.4),
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(colors.warn, 0.2),
          }}
        >
          <Icon name="lock" size={20} color={colors.warn} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '800', fontSize: 14.5, color: colors.text }}>
            Sua conta está inativa
          </Text>
          <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 19 }}>
            Seu período de teste terminou. Para continuar usando o Converso, acesse sua conta no site
            e ative sua assinatura no computador.
          </Text>
        </View>
      </View>
    </View>
  );
}
