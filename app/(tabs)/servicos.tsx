/* CONVERSO Mobile — Serviços: listagem + busca + filtro de categoria.
   Ported from mobile/servicos.jsx (ServicosScreen). */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { MobileTop } from '@/components/MobileTop';
import { CVCard, Badge, Field, EmptyState } from '@/components/ui';
import { ServicosSkeleton } from '@/components/Skeletons';
import { colors, alpha } from '@/theme/tokens';
import { catColor, catIcon, fmtBRL, STATUS_META } from '@/lib/data';
import { useData } from '@/lib/store';

export default function Servicos() {
  const insets = useSafeAreaInsets();
  const { servicos: seed, clienteById, loading } = useData();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Todos');
  if (loading) return <ServicosSkeleton top={insets.top} />;
  const list = seed.filter(
    (s) => (cat === 'Todos' || s.cat === cat) && s.nome.toLowerCase().includes(q.toLowerCase()),
  );
  const cats = ['Todos', ...Array.from(new Set(seed.map((s) => s.cat)))];
  const ativos = seed.filter((s) => s.status === 'ativo').length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <MobileTop
        title="Serviços"
        sub={`${seed.length} no catálogo · ${ativos} ativos`}
        right={
          <Pressable
            onPress={() => router.push('/servico-form')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 4,
            }}
          >
            <Icon name="plus" size={23} color="#fff" stroke={2.4} />
          </Pressable>
        }
      />

      <View style={{ paddingHorizontal: 20 }}>
        <Field icon="search" value={q} onChangeText={setQ} placeholder="Buscar serviço..." />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingVertical: 14 }}
      >
        {cats.map((c) => {
          const on = cat === c;
          return (
            <Pressable
              key={c}
              onPress={() => setCat(c)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 15,
                borderRadius: 99,
                backgroundColor: on ? colors.primary : colors.surface,
                borderWidth: on ? 0 : 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: 13.5, color: on ? '#fff' : colors.textMuted }}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        {list.map((s) => {
          const cl = clienteById(s.cliente);
          const cc = catColor[s.cat] || colors.primary;
          const st = STATUS_META[s.status];
          return (
            <CVCard key={s.id} pad={15} onPress={() => router.push({ pathname: '/servico-form', params: { id: s.id } })}>
              <View style={{ flexDirection: 'row', gap: 13, alignItems: 'flex-start' }}>
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 13,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(cc, 0.16),
                  }}
                >
                  <Icon name={catIcon(s.cat)} size={22} stroke={2.1} color={cc} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                    <Text style={{ fontWeight: '700', fontSize: 15.5, color: colors.text, flex: 1 }}>{s.nome}</Text>
                    <Badge color={st.cor} dot>
                      {st.label}
                    </Badge>
                  </View>
                  <Text style={{ fontSize: 12.5, color: colors.textMuted, marginTop: 4 }}>
                    {s.cat} · {cl.nome}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 11 }}>
                    <Text style={{ fontWeight: '800', fontSize: 16, color: colors.text }}>{fmtBRL(s.preco)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Icon name="clock" size={14} color={colors.textSubtle} />
                      <Text style={{ fontSize: 12.5, color: colors.textSubtle, fontWeight: '600' }}>{s.dur}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </CVCard>
          );
        })}
        {list.length === 0 && <EmptyState icon="briefcase" title="Nenhum serviço" sub="Tente outra busca ou categoria." />}
      </View>
    </ScrollView>
  );
}
