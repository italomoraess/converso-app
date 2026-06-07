/* CONVERSO Mobile — Funil de vendas (Kanban horizontal + move sheet).
   Ported from mobile/funil.jsx. */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { MobileTop } from '@/components/MobileTop';
import { CVCard, Badge, Avatar } from '@/components/ui';
import { FunilSkeleton } from '@/components/Skeletons';
import { colors, radii, alpha } from '@/theme/tokens';
import { etapas, fmtBRL } from '@/lib/data';
import type { EtapaId, Negocio } from '@/lib/data';
import { useData } from '@/lib/store';

function DealCard({ deal, stageColor, onMove }: { deal: Negocio; stageColor: string; onMove: () => void }) {
  const { clienteById } = useData();
  const cl = clienteById(deal.cliente);
  return (
    <CVCard pad={14} style={{ borderLeftWidth: 3, borderLeftColor: stageColor }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <Text style={{ fontWeight: '700', fontSize: 14.5, color: colors.text, flex: 1, lineHeight: 18 }}>{deal.titulo}</Text>
        <Pressable onPress={onMove} style={{ padding: 2 }}>
          <Icon name="moreH" size={18} color={colors.textSubtle} />
        </Pressable>
      </View>
      <Text style={{ fontSize: 12, color: colors.textSubtle, fontWeight: '600', marginTop: 3 }}>{deal.servico}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Avatar ini={cl.ini} cor={cl.cor} size={28} />
          <Text style={{ fontSize: 12.5, fontWeight: '600', color: colors.textMuted }}>{cl.nome.split(' ')[0]}</Text>
        </View>
        <Text style={{ fontWeight: '800', fontSize: 15, color: colors.text }}>{fmtBRL(deal.valor)}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <Icon name="clock" size={13} color={colors.textSubtle} />
        <Text style={{ fontSize: 11.5, color: colors.textSubtle, fontWeight: '600' }}>
          {deal.dias === 0 ? 'Hoje' : `há ${deal.dias} ${deal.dias === 1 ? 'dia' : 'dias'}`}
        </Text>
      </View>
    </CVCard>
  );
}

export default function Funil() {
  const insets = useSafeAreaInsets();
  const { negocios: deals, kpis, moveDeal, loading } = useData();
  const [sheet, setSheet] = useState<Negocio | null>(null);
  if (loading) return <FunilSkeleton top={insets.top} />;

  const totalAberto = deals.filter((d) => d.etapa !== 'ganho').reduce((s, d) => s + d.valor, 0);
  const ganhoMes = deals.filter((d) => d.etapa === 'ganho').reduce((s, d) => s + d.valor, 0);

  const move = (id: string, etapa: EtapaId) => {
    moveDeal(id, etapa);
    setSheet(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <MobileTop title="Funil" sub={`${deals.length} negócios · ${fmtBRL(totalAberto)} em aberto`} />

      {/* summary chips */}
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 14 }}>
        <CVCard pad={13} style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: alpha(colors.money, 0.18), alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="checkCircle" size={19} color={colors.money} />
            </View>
            <View>
              <Text style={{ fontWeight: '800', fontSize: 15, color: colors.text }}>{fmtBRL(ganhoMes)}</Text>
              <Text style={{ fontSize: 11.5, color: colors.textSubtle, fontWeight: '600' }}>Fechado no mês</Text>
            </View>
          </View>
        </CVCard>
        <CVCard pad={13} style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: alpha(colors.stageNego, 0.16), alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="target" size={19} color={colors.stageNego} />
            </View>
            <View>
              <Text style={{ fontWeight: '800', fontSize: 15, color: colors.text }}>{kpis.taxaConversao}%</Text>
              <Text style={{ fontSize: 11.5, color: colors.textSubtle, fontWeight: '600' }}>Conversão</Text>
            </View>
          </View>
        </CVCard>
      </View>

      {/* kanban columns */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingHorizontal: 20, paddingBottom: 120 }}
      >
        {etapas.map((e) => {
          const items = deals.filter((d) => d.etapa === e.id);
          const val = items.reduce((s, d) => s + d.valor, 0);
          return (
            <View key={e.id} style={{ width: 270 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12, paddingHorizontal: 2 }}>
                <View style={{ width: 10, height: 10, borderRadius: 99, backgroundColor: e.cor }} />
                <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text }}>{e.nome}</Text>
                <View
                  style={{
                    marginLeft: 'auto',
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingVertical: 2,
                    paddingHorizontal: 9,
                    borderRadius: 99,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '800', color: colors.textSubtle }}>{items.length}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.textMuted, marginBottom: 10, paddingHorizontal: 2 }}>
                {fmtBRL(val)}
              </Text>
              <View style={{ gap: 11 }}>
                {items.map((d) => (
                  <DealCard key={d.id} deal={d} stageColor={e.cor} onMove={() => setSheet(d)} />
                ))}
                {items.length === 0 && (
                  <View
                    style={{
                      borderWidth: 2,
                      borderStyle: 'dashed',
                      borderColor: colors.borderStrong,
                      borderRadius: radii.lg,
                      paddingVertical: 22,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: colors.textSubtle, fontSize: 13, fontWeight: '600' }}>Sem negócios aqui</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Move sheet */}
      <Modal visible={!!sheet} transparent animationType="fade" onRequestClose={() => setSheet(null)}>
        <Pressable onPress={() => setSheet(null)} style={{ flex: 1, backgroundColor: 'rgba(10,12,24,0.45)', justifyContent: 'flex-end' }}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              paddingTop: 10,
              paddingHorizontal: 20,
              paddingBottom: 28 + insets.bottom,
            }}
          >
            <View style={{ width: 40, height: 5, borderRadius: 99, backgroundColor: colors.borderStrong, alignSelf: 'center', marginBottom: 16 }} />
            <Text style={{ fontWeight: '800', fontSize: 17, marginBottom: 2, color: colors.text }}>{sheet?.titulo}</Text>
            <Text style={{ fontSize: 13.5, color: colors.textMuted, marginBottom: 16 }}>Mover para a etapa…</Text>
            <View style={{ gap: 8 }}>
              {etapas.map((e) => {
                const on = e.id === sheet?.etapa;
                return (
                  <Pressable
                    key={e.id}
                    disabled={on}
                    onPress={() => sheet && move(sheet.id, e.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderRadius: radii.md,
                      borderWidth: 1.5,
                      borderColor: on ? e.cor : colors.border,
                      backgroundColor: on ? alpha(e.cor, 0.12) : colors.surface,
                    }}
                  >
                    <View style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: e.cor }} />
                    <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text, flex: 1 }}>{e.nome}</Text>
                    {on ? <Badge color={e.cor}>Atual</Badge> : <Icon name="chevR" size={18} color={colors.textSubtle} />}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
