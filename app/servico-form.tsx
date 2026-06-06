/* CONVERSO Mobile — Serviço form (create/edit). Modal route.
   Ported from ServicoFormScreen in mobile/servicos.jsx. */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { MobileTop } from '@/components/MobileTop';
import { CVButton, Field, Avatar } from '@/components/ui';
import { colors, radii, alpha } from '@/theme/tokens';
import { catColor, catIcon, STATUS_META } from '@/lib/data';
import type { Servico, ServiceStatus } from '@/lib/data';
import { useData } from '@/lib/store';

const blank: Servico = {
  id: '',
  nome: '',
  cat: 'Consultoria',
  preco: 0,
  dur: '1h',
  status: 'ativo',
  cliente: 'c1',
  desc: '',
};

export default function ServicoForm() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { servicos, clientes, saveService, deleteService } = useData();
  const editing = id ? servicos.find((s) => s.id === id) : undefined;

  const [f, setF] = useState<Servico>(editing ?? { ...blank, cliente: clientes[0]?.id ?? '' });
  const [precoTxt, setPrecoTxt] = useState(editing ? String(editing.preco) : '');
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Servico>(k: K) => (v: Servico[K]) => setF((s) => ({ ...s, [k]: v }));

  const cats = Object.keys(catColor);
  const durs = ['30min', '1h', '1h30', '2h', '3h', '4h', 'Dia'];

  const onSave = async () => {
    setBusy(true);
    try {
      await saveService(f);
      router.back();
    } catch {
      setBusy(false);
    }
  };
  const onDelete = async () => {
    if (editing) await deleteService(editing.id).catch(() => {});
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <MobileTop back onBack={() => router.back()} title={editing ? 'Editar serviço' : 'Novo serviço'} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 17 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Field label="Nome do serviço" value={f.nome} onChangeText={set('nome')} placeholder="Ex: Consultoria de Marca" />

        <View>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginBottom: 8 }}>Categoria</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {cats.map((c) => {
              const on = f.cat === c;
              const cc = catColor[c];
              return (
                <Pressable
                  key={c}
                  onPress={() => set('cat')(c)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,
                    paddingVertical: 9,
                    paddingHorizontal: 14,
                    borderRadius: 99,
                    backgroundColor: on ? alpha(cc, 0.18) : colors.surface,
                    borderWidth: on ? 1.5 : 1,
                    borderColor: on ? cc : colors.border,
                  }}
                >
                  <Icon name={catIcon(c)} size={15} color={on ? cc : colors.textMuted} />
                  <Text style={{ fontWeight: '700', fontSize: 13, color: on ? cc : colors.textMuted }}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field
              label="Preço (R$)"
              value={precoTxt}
              onChangeText={(v) => {
                setPrecoTxt(v);
                set('preco')(Number(v.replace(/[^0-9]/g, '')) || 0);
              }}
              placeholder="0,00"
              icon="dollar"
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginBottom: 8 }}>Duração</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {durs.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => set('dur')(d)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 11,
                    borderRadius: 10,
                    backgroundColor: f.dur === d ? colors.primary : colors.surface,
                    borderWidth: f.dur === d ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ fontWeight: '700', fontSize: 12.5, color: f.dur === d ? '#fff' : colors.textMuted }}>{d}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginBottom: 8 }}>Cliente vinculado</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
            {clientes.map((c) => {
              const on = f.cliente === c.id;
              return (
                <Pressable key={c.id} onPress={() => set('cliente')(c.id)} style={{ alignItems: 'center', gap: 6, padding: 2 }}>
                  <Avatar ini={c.ini} cor={c.cor} size={48} ring={on} />
                  <Text numberOfLines={1} style={{ fontSize: 11.5, fontWeight: on ? '800' : '600', color: on ? colors.text : colors.textSubtle, maxWidth: 60 }}>
                    {c.nome.split(' ')[0]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Field label="Descrição" area value={f.desc} onChangeText={set('desc')} placeholder="O que está incluso neste serviço?" />

        <View>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginBottom: 8 }}>Status</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(Object.entries(STATUS_META) as [ServiceStatus, { label: string; cor: string }][]).map(([k, m]) => {
              const on = f.status === k;
              return (
                <Pressable
                  key={k}
                  onPress={() => set('status')(k)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: radii.md,
                    alignItems: 'center',
                    backgroundColor: on ? alpha(m.cor, 0.16) : colors.surface,
                    borderWidth: on ? 1.5 : 1,
                    borderColor: on ? m.cor : colors.border,
                  }}
                >
                  <Text style={{ fontWeight: '700', fontSize: 13.5, color: on ? m.cor : colors.textMuted }}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {editing && (
          <Pressable
            onPress={onDelete}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 14,
              marginTop: 4,
              borderRadius: radii.md,
              backgroundColor: alpha(colors.danger, 0.12),
            }}
          >
            <Icon name="trash" size={18} color={colors.danger} />
            <Text style={{ color: colors.danger, fontWeight: '700', fontSize: 14.5 }}>Excluir serviço</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* sticky save */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 12 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <CVButton variant="outline" size="lg" onPress={() => router.back()}>
          Cancelar
        </CVButton>
        <CVButton size="lg" full icon="check" onPress={onSave}>
          {busy ? 'Salvando…' : editing ? 'Salvar alterações' : 'Criar serviço'}
        </CVButton>
      </View>
    </View>
  );
}
