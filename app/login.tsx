/* CONVERSO Mobile — Login (e-mail / WhatsApp). Ported from LoginScreen in mobile/auth.jsx. */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { CVButton, Field, LogoMark } from '@/components/ui';
import { colors } from '@/theme/tokens';
import { authService } from '@/lib/services';
import { useData, USE_MOCK } from '@/lib/store';

export default function Login() {
  const insets = useSafeAreaInsets();
  const { reload } = useData();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onAuth = async () => {
    setErr(null);
    if (USE_MOCK) {
      router.replace('/(tabs)/dashboard');
      return;
    }
    if (!email || !senha) {
      setErr('Informe e-mail e senha.');
      return;
    }
    setBusy(true);
    try {
      await authService.login(email.trim(), senha);
      await reload();
      router.replace('/(tabs)/dashboard');
    } catch {
      setErr('E-mail ou senha inválidos.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 24, paddingHorizontal: 24, paddingBottom: 30 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <LogoMark size={48} />
        <Text style={{ fontSize: 30, fontWeight: '800', letterSpacing: -0.6, marginTop: 24, color: colors.text }}>
          Bem-vinda de volta 👋
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 15.5, marginTop: 8, lineHeight: 23 }}>
          Acesse sua conta para ver agenda, clientes e o funil de hoje.
        </Text>
      </View>

      <View style={{ gap: 16, marginTop: 34 }}>
        <Field label="E-mail" icon="mail" value={email} onChangeText={setEmail} placeholder="voce@email.com" keyboardType="email-address" />
        <Field
          label="Senha"
          icon="lock"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!show}
          right={
            <Pressable onPress={() => setShow((s) => !s)} style={{ padding: 4 }}>
              <Icon name={show ? 'eyeOff' : 'eye'} size={19} color={colors.textSubtle} />
            </Pressable>
          }
        />
        <View style={{ alignItems: 'flex-end', marginTop: -4 }}>
          <Pressable>
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13.5 }}>Esqueci minha senha</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ marginTop: 'auto', paddingTop: 28, gap: 16 }}>
        {err && <Text style={{ color: colors.danger, fontSize: 13.5, fontWeight: '600' }}>{err}</Text>}
        <CVButton size="lg" full icon="arrowR" onPress={onAuth}>
          {busy ? 'Entrando…' : 'Entrar'}
        </CVButton>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text style={{ color: colors.textSubtle, fontSize: 13 }}>ou</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>
        <CVButton size="lg" full variant="outline" icon="whatsapp" textColor="#1FA855" onPress={onAuth}>
          Continuar com WhatsApp
        </CVButton>
        <Text style={{ textAlign: 'center', color: colors.textMuted, fontSize: 14.5, marginTop: 2 }}>
          Novo por aqui?{' '}
          <Text onPress={() => router.push('/register')} style={{ color: colors.primary, fontWeight: '800' }}>
            Criar conta
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
