/* CONVERSO Mobile — Dashboard (Home). Ported from mobile/dashboard.jsx. */
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '@/components/Icon';
import { MobileTop } from '@/components/MobileTop';
import { Sparkline } from '@/components/Sparkline';
import { CVCard, Badge, SectionHead, StatPill } from '@/components/ui';
import { InactiveNotice } from '@/components/InactiveNotice';
import { DashboardSkeleton } from '@/components/Skeletons';
import { colors, radii, alpha, mix } from '@/theme/tokens';
import { etapas, catColor, fmtBRL, meses } from '@/lib/data';
import { useData } from '@/lib/store';

function MiniFunnel() {
  const { negocios } = useData();
  const counts = etapas.map((e) => ({
    ...e,
    n: negocios.filter((d) => d.etapa === e.id).length,
  }));
  const max = Math.max(...counts.map((c) => c.n), 1);
  const aberto = negocios.filter((d) => d.etapa !== 'ganho').reduce((s, d) => s + d.valor, 0);
  return (
    <CVCard pad={16} onPress={() => router.push('/(tabs)/funil')}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>Funil de vendas</Text>
        <Badge color={colors.primary}>{fmtBRL(aberto)} em aberto</Badge>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 78 }}>
        {counts.map((c) => (
          <View key={c.id} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text }}>{c.n}</Text>
            <View style={{ width: '100%', height: (c.n / max) * 46 + 6, borderRadius: 7, backgroundColor: c.cor }} />
            <Text style={{ fontSize: 10.5, color: colors.textSubtle, fontWeight: '600' }}>{c.nome}</Text>
          </View>
        ))}
      </View>
    </CVCard>
  );
}

function ShortcutBtn({
  icon,
  label,
  color = colors.primary,
  onPress,
}: {
  icon: IconName;
  label: string;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
        paddingVertical: 14,
        paddingHorizontal: 15,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radii.lg,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(color, 0.16),
        }}
      >
        <Icon name={icon} size={20} stroke={2.3} color={color} />
      </View>
      <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text }}>{label}</Text>
    </Pressable>
  );
}

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { kpis: k, agenda, user, sparkReceita, clienteById, loading } = useData();
  if (loading) return <DashboardSkeleton top={insets.top} />;
  const pct = k.receitaMeta ? Math.round((k.receitaMes / k.receitaMeta) * 100) : 0;
  const now = new Date();
  const hoje = agenda.filter((a) => a.dia === now.getDate());
  const mesAtual = meses[now.getMonth()];
  const subHoje = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <MobileTop
        sub={subHoje}
        title={`Olá, ${user.nome.split(' ')[0]}`}
        avatar={user.ini}
        onAvatar={() => router.push('/(tabs)/perfil')}
        right={
          <Pressable
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 4,
            }}
          >
            <Icon name="bell" size={21} color={colors.text} />
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 11,
                width: 8,
                height: 8,
                borderRadius: 99,
                backgroundColor: colors.danger,
                borderWidth: 2,
                borderColor: colors.surface,
              }}
            />
          </Pressable>
        }
      />

      <InactiveNotice />

      <View style={{ paddingHorizontal: 20, gap: 16 }}>
        {/* Hero receita */}
        <View
          style={{
            borderRadius: radii.xl,
            padding: 20,
            overflow: 'hidden',
            backgroundColor: mix(colors.primary, 76, '#160f3a'),
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Receita em {mesAtual.toLowerCase()}</Text>
              <Text style={{ fontSize: 36, fontWeight: '800', letterSpacing: -1, marginTop: 4, color: '#fff' }}>
                {fmtBRL(k.receitaMes)}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 8,
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(255,255,255,0.16)',
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 99,
                }}
              >
                <Icon name="trendUp" size={14} stroke={2.6} color="#fff" />
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#fff' }}>{k.receitaDelta >= 0 ? '+' : ''}{k.receitaDelta}% no mês</Text>
              </View>
            </View>
            <View style={{ opacity: 0.9 }}>
              <Sparkline data={sparkReceita} w={92} h={48} color="#fff" gradId="heroSpk" />
            </View>
          </View>
          <View style={{ marginTop: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>Meta do mês</Text>
              <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', fontWeight: '600' }}>
                {pct}% · {fmtBRL(k.receitaMeta)}
              </Text>
            </View>
            <View style={{ height: 8, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.22)', overflow: 'hidden' }}>
              <View style={{ width: `${pct}%`, height: '100%', borderRadius: 99, backgroundColor: '#fff' }} />
            </View>
          </View>
        </View>

        {/* quick stats */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <View style={{ width: '47.5%', flexGrow: 1 }}>
            <CVCard pad={15}>
              <StatPill icon="dollar" color={colors.money} label="A receber" value={fmtBRL(k.aReceber)} />
            </CVCard>
          </View>
          <View style={{ width: '47.5%', flexGrow: 1 }}>
            <CVCard pad={15}>
              <StatPill icon="target" color={colors.stageNego} label="Conversão" value={`${k.taxaConversao}%`} />
            </CVCard>
          </View>
          <View style={{ width: '47.5%', flexGrow: 1 }}>
            <CVCard pad={15}>
              <StatPill icon="briefcase" color={colors.primary} label="Serviços ativos" value={k.servicosAtivos} />
            </CVCard>
          </View>
          <View style={{ width: '47.5%', flexGrow: 1 }}>
            <CVCard pad={15}>
              <StatPill icon="users" color={colors.stageContato} label="Novos clientes" value={`+${k.novosClientes}`} />
            </CVCard>
          </View>
        </View>

        {/* agenda hoje */}
        <View>
          <SectionHead title="Agenda de hoje" action="Ver tudo" onAction={() => router.push('/(tabs)/agenda')} />
          <View style={{ gap: 10 }}>
            {hoje.map((a) => {
              const cl = clienteById(a.cliente);
              return (
                <CVCard key={a.id} pad={13} onPress={() => router.push('/(tabs)/agenda')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                    <View style={{ alignItems: 'center', minWidth: 50 }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{a.hora}</Text>
                      <Text style={{ fontSize: 11, color: colors.textSubtle, fontWeight: '600' }}>{a.dur}min</Text>
                    </View>
                    <View style={{ width: 3, alignSelf: 'stretch', borderRadius: 99, backgroundColor: catColor[a.tipo] || colors.primary }} />
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: 14.5, color: colors.text }}>
                        {a.titulo}
                      </Text>
                      <Text style={{ fontSize: 12.5, color: colors.textMuted, marginTop: 2 }}>{cl.nome}</Text>
                    </View>
                    <Badge color={a.status === 'confirmado' ? colors.money : colors.warn} dot>
                      {a.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                  </View>
                </CVCard>
              );
            })}
          </View>
        </View>

        {/* funil resumo */}
        <MiniFunnel />

        {/* atalhos */}
        <View>
          <SectionHead title="Atalhos" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <View style={{ width: '47.5%', flexGrow: 1, flexDirection: 'row' }}>
              <ShortcutBtn icon="plus" label="Novo serviço" onPress={() => router.push('/servico-form')} />
            </View>
            <View style={{ width: '47.5%', flexGrow: 1, flexDirection: 'row' }}>
              <ShortcutBtn icon="calendar" label="Agendar" color={colors.stageContato} onPress={() => router.push('/(tabs)/agenda')} />
            </View>
            <View style={{ width: '47.5%', flexGrow: 1, flexDirection: 'row' }}>
              <ShortcutBtn icon="funnel" label="Novo negócio" color={colors.stageNego} onPress={() => router.push('/(tabs)/funil')} />
            </View>
            <View style={{ width: '47.5%', flexGrow: 1, flexDirection: 'row' }}>
              <ShortcutBtn icon="receipt" label="Cobrança" color={colors.money} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
