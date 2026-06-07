/* CONVERSO Mobile — Cadastro (2 passos). Ported from CadastroScreen in mobile/auth.jsx. */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MobileTop } from '@/components/MobileTop';
import { CVButton, Field } from '@/components/ui';
import { colors, radii } from '@/theme/tokens';
import { authService } from '@/lib/services';
import { useData } from '@/lib/store';

const ATIVIDADES = [
  'Beleza & Estética',
  'Reparos & Serviços',
  'Saúde & Bem-estar',
  'Criativo / Freelancer',
  'Consultoria',
  'Educação',
  'Outro',
];

export default function Register() {
  const insets = useSafeAreaInsets();
  const { reload } = useData();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ nome: '', email: '', fone: '', senha: '', atividade: '' });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onAuth = async () => {
    setErr(null);
    if (!f.nome || !f.email || !f.senha) {
      setErr('Preencha nome, e-mail e senha.');
      setStep(0);
      return;
    }
    if (f.senha.length < 8 || !/(?=.*[A-Z])(?=.*\d)/.test(f.senha)) {
      setErr('Senha: mínimo 8 caracteres, com 1 maiúscula e 1 número.');
      setStep(0);
      return;
    }
    setBusy(true);
    try {
      await authService.register({ name: f.nome.trim(), email: f.email.trim(), password: f.senha, phone: f.fone || undefined });
      await reload();
      router.replace('/(tabs)/dashboard');
    } catch {
      setErr('Não foi possível criar a conta. O e-mail pode já estar em uso.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: 30 }}
      keyboardShouldPersistTaps="handled"
    >
      <MobileTop back onBack={() => (step === 0 ? router.back() : setStep(0))} title="" />

      <View style={{ paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 26 }}>
          {[0, 1].map((i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 99,
                backgroundColor: i <= step ? colors.primary : colors.borderStrong,
              }}
            />
          ))}
        </View>
        <Text style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.5, color: colors.text }}>
          {step === 0 ? 'Crie sua conta' : 'Sobre seu trabalho'}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 15, marginTop: 8, lineHeight: 22 }}>
          {step === 0
            ? 'Leva menos de um minuto. Comece grátis.'
            : 'Isso personaliza seu funil e seus serviços.'}
        </Text>
      </View>

      {step === 0 ? (
        <View style={{ gap: 15, marginTop: 22, paddingHorizontal: 24 }}>
          <Field label="Nome completo" icon="user" value={f.nome} onChangeText={set('nome')} placeholder="Como te chamam?" />
          <Field label="E-mail" icon="mail" value={f.email} onChangeText={set('email')} placeholder="voce@email.com" keyboardType="email-address" />
          <Field label="WhatsApp" icon="phone" value={f.fone} onChangeText={set('fone')} placeholder="(11) 90000-0000" keyboardType="phone-pad" />
          <Field label="Senha" icon="lock" value={f.senha} onChangeText={set('senha')} secureTextEntry hint="Mínimo de 8 caracteres" />
        </View>
      ) : (
        <View style={{ gap: 11, marginTop: 22, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted }}>Qual sua área de atuação?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {ATIVIDADES.map((a) => {
              const on = f.atividade === a;
              return (
                <Pressable
                  key={a}
                  onPress={() => set('atividade')(a)}
                  style={{
                    width: '47%',
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    borderRadius: radii.md,
                    borderWidth: 1.5,
                    borderColor: on ? colors.primary : colors.borderStrong,
                    backgroundColor: on ? colors.primarySoft : colors.surface,
                  }}
                >
                  <Text style={{ color: on ? colors.primary : colors.text, fontWeight: '700', fontSize: 13.5, lineHeight: 17 }}>
                    {a}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <View style={{ marginTop: 'auto', paddingTop: 24, paddingHorizontal: 24 }}>
        {err && <Text style={{ color: colors.danger, fontSize: 13.5, fontWeight: '600', marginBottom: 12 }}>{err}</Text>}
        <CVButton
          size="lg"
          full
          icon={step === 0 ? 'arrowR' : 'check'}
          onPress={() => (step === 0 ? setStep(1) : onAuth())}
        >
          {step === 0 ? 'Continuar' : busy ? 'Criando…' : 'Criar conta e começar'}
        </CVButton>
        <Text style={{ textAlign: 'center', color: colors.textSubtle, fontSize: 12.5, marginTop: 14, lineHeight: 19 }}>
          Ao criar conta você aceita os{' '}
          <Text style={{ color: colors.textMuted, fontWeight: '700' }}>Termos</Text> e a{' '}
          <Text style={{ color: colors.textMuted, fontWeight: '700' }}>Política de Privacidade</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}
