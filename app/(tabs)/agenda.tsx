/* CONVERSO Mobile — Agenda: calendário indicativo + agendamentos + novo agendamento.
   Ported from mobile/agenda.jsx. */
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { MobileTop } from '@/components/MobileTop';
import { CVCard, CVButton, Badge, Avatar, EmptyState } from '@/components/ui';
import { colors, radii, alpha } from '@/theme/tokens';
import { agenda as seed, diasSemana, catColor, clienteById, clientes } from '@/lib/data';
import type { Evento } from '@/lib/data';

const YEAR = 2026;
const MONTH = 5; // junho (0-indexed)

export default function Agenda() {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<Evento[]>(seed);
  const [sel, setSel] = useState(4);
  const [novo, setNovo] = useState(false);

  const first = new Date(YEAR, MONTH, 1).getDay();
  const days = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const eventosDoDia = events
    .filter((a) => a.dia === sel)
    .sort((a, b) => a.hora.localeCompare(b.hora));
  const dotsFor = (d: number) => events.filter((a) => a.dia === d);

  const addEvent = (ev: Omit<Evento, 'id'>) => {
    setEvents((list) => [...list, { ...ev, id: 'a' + Date.now() }]);
    setNovo(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
      <MobileTop
        title="Agenda"
        sub="Junho de 2026"
        right={
          <Pressable
            onPress={() => setNovo(true)}
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

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <CVCard pad={16}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="chevL" size={18} color={colors.textMuted} />
              </View>
              <Text style={{ fontWeight: '800', fontSize: 16, color: colors.text }}>Junho 2026</Text>
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="chevR" size={18} color={colors.textMuted} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              {diasSemana.map((d) => (
                <Text key={d} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: colors.textSubtle }}>
                  {d}
                </Text>
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {cells.map((d, i) => {
                if (!d) return <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
                const isToday = d === 4;
                const isSel = d === sel;
                const evs = dotsFor(d);
                return (
                  <Pressable
                    key={i}
                    onPress={() => setSel(d)}
                    style={{
                      width: `${100 / 7}%`,
                      aspectRatio: 1,
                      borderRadius: 11,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 3,
                      backgroundColor: isSel ? colors.primary : isToday ? colors.primarySoft : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: isSel || isToday ? '800' : '600',
                        fontSize: 14,
                        color: isSel ? '#fff' : isToday ? colors.primary : colors.text,
                      }}
                    >
                      {d}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 2, height: 5 }}>
                      {evs.slice(0, 3).map((e, j) => (
                        <View
                          key={j}
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: 99,
                            backgroundColor: isSel ? 'rgba(255,255,255,0.9)' : catColor[e.tipo] || colors.primary,
                          }}
                        />
                      ))}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </CVCard>
        </View>

        {/* day agenda */}
        <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>
              {sel === 4 ? 'Hoje' : `${sel} de junho`}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSubtle, fontWeight: '600' }}>
              {eventosDoDia.length} {eventosDoDia.length === 1 ? 'compromisso' : 'compromissos'}
            </Text>
          </View>

          {eventosDoDia.length === 0 ? (
            <EmptyState icon="calendar" title="Dia livre" sub="Toque em + para agendar algo." />
          ) : (
            <View style={{ paddingLeft: 4 }}>
              {eventosDoDia.map((a, i) => {
                const cl = clienteById(a.cliente);
                const cc = catColor[a.tipo] || colors.primary;
                const last = i === eventosDoDia.length - 1;
                return (
                  <View key={a.id} style={{ flexDirection: 'row', gap: 14, marginBottom: last ? 0 : 14 }}>
                    <View style={{ alignItems: 'center', paddingTop: 2 }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text }}>{a.hora}</Text>
                      {!last && <View style={{ width: 2, flex: 1, backgroundColor: colors.border, marginTop: 6, minHeight: 30 }} />}
                    </View>
                    <CVCard pad={14} style={{ flex: 1, borderLeftWidth: 3, borderLeftColor: cc }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <Text style={{ fontWeight: '700', fontSize: 14.5, color: colors.text, flex: 1, lineHeight: 18 }}>{a.titulo}</Text>
                        <Badge color={a.status === 'confirmado' ? colors.money : colors.warn} dot>
                          {a.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 11 }}>
                        <Avatar ini={cl.ini} cor={cl.cor} size={26} />
                        <Text style={{ fontSize: 12.5, fontWeight: '600', color: colors.textMuted, flex: 1 }}>{cl.nome}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <Icon name="clock" size={13} color={colors.textSubtle} />
                          <Text style={{ fontSize: 12, color: colors.textSubtle, fontWeight: '600' }}>{a.dur}min</Text>
                        </View>
                      </View>
                    </CVCard>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {novo && <NovoAgendamentoSheet onClose={() => setNovo(false)} defaultDay={sel} onSave={addEvent} />}
    </View>
  );
}

function NovoAgendamentoSheet({
  onClose,
  onSave,
  defaultDay,
}: {
  onClose: () => void;
  onSave: (ev: Omit<Evento, 'id'>) => void;
  defaultDay: number;
}) {
  const insets = useSafeAreaInsets();
  const [cliente, setCliente] = useState('c1');
  const [tipo, setTipo] = useState('Consultoria');
  const [hora, setHora] = useState('10:00');
  const horas = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(10,12,24,0.45)', justifyContent: 'flex-end' }}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            paddingTop: 10,
            paddingHorizontal: 20,
            paddingBottom: 20 + insets.bottom,
            maxHeight: '82%',
          }}
        >
          <View style={{ width: 40, height: 5, borderRadius: 99, backgroundColor: colors.borderStrong, alignSelf: 'center', marginBottom: 16 }} />
          <Text style={{ fontWeight: '800', fontSize: 19, marginBottom: 18, color: colors.text }}>Novo agendamento</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            <View>
              <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginBottom: 8 }}>Cliente</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>
                {clientes.map((c) => {
                  const on = cliente === c.id;
                  return (
                    <Pressable key={c.id} onPress={() => setCliente(c.id)} style={{ alignItems: 'center', gap: 6, padding: 2 }}>
                      <Avatar ini={c.ini} cor={c.cor} size={46} ring={on} />
                      <Text style={{ fontSize: 11.5, fontWeight: on ? '800' : '600', color: on ? colors.text : colors.textSubtle }}>
                        {c.nome.split(' ')[0]}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View>
              <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginBottom: 8 }}>Tipo de serviço</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {Object.keys(catColor).map((c) => {
                  const on = tipo === c;
                  const cc = catColor[c];
                  return (
                    <Pressable
                      key={c}
                      onPress={() => setTipo(c)}
                      style={{
                        paddingVertical: 9,
                        paddingHorizontal: 14,
                        borderRadius: 99,
                        backgroundColor: on ? alpha(cc, 0.18) : colors.bg,
                        borderWidth: on ? 1.5 : 0,
                        borderColor: cc,
                      }}
                    >
                      <Text style={{ fontWeight: '700', fontSize: 13, color: on ? cc : colors.textMuted }}>{c}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginBottom: 8 }}>
                Horário · {defaultDay} de junho
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {horas.map((h) => (
                  <Pressable
                    key={h}
                    onPress={() => setHora(h)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: radii.md,
                      backgroundColor: hora === h ? colors.primary : colors.bg,
                    }}
                  >
                    <Text style={{ fontWeight: '700', fontSize: 13.5, color: hora === h ? '#fff' : colors.textMuted }}>{h}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <CVButton
              size="lg"
              full
              icon="calCheck"
              onPress={() =>
                onSave({
                  dia: defaultDay,
                  hora,
                  tipo,
                  cliente,
                  titulo: `${tipo} — ${clienteById(cliente).nome.split(' ')[0]}`,
                  dur: 60,
                  status: 'confirmado',
                })
              }
            >
              Confirmar agendamento
            </CVButton>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
