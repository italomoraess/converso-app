/* CONVERSO Mobile — Perfil do usuário + logout. Ported from mobile/perfil.jsx. */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '@/components/Icon';
import { MobileTop } from '@/components/MobileTop';
import { CVCard, CVButton } from '@/components/ui';
import { colors, radii, alpha, mix } from '@/theme/tokens';
import { clearToken } from '@/lib/api';
import { user, servicos, clientes, negocios } from '@/lib/data';

type Item = { icon: IconName; label: string; meta?: string };
type Grupo = { titulo: string; itens: Item[] };

export default function Perfil() {
  const insets = useSafeAreaInsets();
  const [confirm, setConfirm] = useState(false);
  const u = user;

  const grupos: Grupo[] = [
    {
      titulo: 'Conta',
      itens: [
        { icon: 'user', label: 'Dados pessoais', meta: u.email },
        { icon: 'briefcase', label: 'Meus serviços', meta: `${servicos.length}` },
        { icon: 'receipt', label: 'Pagamentos & cobrança', meta: 'Pix, cartão' },
      ],
    },
    {
      titulo: 'Preferências',
      itens: [
        { icon: 'bell', label: 'Notificações', meta: 'Ativadas' },
        { icon: 'calendar', label: 'Horário de atendimento', meta: 'Seg–Sex' },
        { icon: 'settings', label: 'Aparência & tema', meta: 'Ajustar' },
      ],
    },
    {
      titulo: 'Suporte',
      itens: [
        { icon: 'whatsapp', label: 'Falar com o suporte' },
        { icon: 'star', label: 'Avaliar o Converso' },
      ],
    },
  ];

  const onLogout = async () => {
    await clearToken().catch(() => {});
    router.replace('/login');
  };

  const stats: [string, number][] = [
    ['Serviços', servicos.length],
    ['Clientes', clientes.length],
    ['Negócios', negocios.length],
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <MobileTop title="Perfil" sub="Sua conta" back onBack={() => router.back()} />

      <View style={{ paddingHorizontal: 20, gap: 18 }}>
        {/* profile card */}
        <View style={{ borderRadius: radii.xl, padding: 22, overflow: 'hidden', backgroundColor: mix(colors.primary, 76, '#160f3a') }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View
              style={{
                width: 66,
                height: 66,
                borderRadius: 33,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontWeight: '800', fontSize: 26, color: '#fff' }}>{u.ini}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', fontSize: 21, color: '#fff' }}>{u.nome}</Text>
              <Text style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{u.papel}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 8,
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 99,
                }}
              >
                <Icon name="sparkle" size={13} color="#fff" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Plano {u.plano}</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            {stats.map(([l, v], i) => (
              <View
                key={l}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  borderLeftWidth: i ? 1 : 0,
                  borderLeftColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <Text style={{ fontWeight: '800', fontSize: 20, color: '#fff' }}>{v}</Text>
                <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', fontWeight: '600' }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {grupos.map((g) => (
          <View key={g.titulo}>
            <Text
              style={{
                fontSize: 12.5,
                fontWeight: '800',
                color: colors.textSubtle,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                marginBottom: 9,
                paddingLeft: 4,
              }}
            >
              {g.titulo}
            </Text>
            <CVCard pad={0} style={{ overflow: 'hidden' }}>
              {g.itens.map((it, i) => (
                <Pressable
                  key={it.label}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 13,
                    paddingVertical: 14,
                    paddingHorizontal: 15,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: colors.border,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.primarySoft,
                    }}
                  >
                    <Icon name={it.icon} size={19} stroke={2.1} color={colors.primary} />
                  </View>
                  <Text style={{ flex: 1, fontWeight: '700', fontSize: 15, color: colors.text }}>{it.label}</Text>
                  {it.meta && (
                    <Text numberOfLines={1} style={{ fontSize: 13, color: colors.textSubtle, fontWeight: '600', maxWidth: 120 }}>
                      {it.meta}
                    </Text>
                  )}
                  <Icon name="chevR" size={18} color={colors.textSubtle} />
                </Pressable>
              ))}
            </CVCard>
          </View>
        ))}

        <Pressable
          onPress={() => setConfirm(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            paddingVertical: 15,
            marginTop: 2,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <Icon name="logout" size={19} color={colors.danger} />
          <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 15.5 }}>Sair da conta</Text>
        </Pressable>
        <Text style={{ textAlign: 'center', fontSize: 12, color: colors.textSubtle, fontWeight: '600' }}>
          Converso · versão 1.0.0
        </Text>
      </View>

      <Modal visible={confirm} transparent animationType="fade" onRequestClose={() => setConfirm(false)}>
        <Pressable
          onPress={() => setConfirm(false)}
          style={{ flex: 1, backgroundColor: 'rgba(10,12,24,0.5)', alignItems: 'center', justifyContent: 'center', padding: 28 }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radii.xl,
              padding: 26,
              width: '100%',
              maxWidth: 340,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                marginBottom: 16,
                backgroundColor: alpha(colors.danger, 0.14),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="logout" size={26} color={colors.danger} />
            </View>
            <Text style={{ fontWeight: '800', fontSize: 19, marginBottom: 6, color: colors.text }}>Sair da conta?</Text>
            <Text style={{ fontSize: 14.5, color: colors.textMuted, lineHeight: 22, marginBottom: 22, textAlign: 'center' }}>
              Você precisará entrar novamente para acessar sua agenda e funil.
            </Text>
            <View style={{ gap: 10, width: '100%' }}>
              <CVButton variant="danger" size="lg" full onPress={onLogout}>
                Sim, sair
              </CVButton>
              <CVButton variant="ghost" size="md" full onPress={() => setConfirm(false)}>
                Cancelar
              </CVButton>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
