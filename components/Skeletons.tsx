/* CONVERSO Mobile — skeletons de carregamento que espelham o layout de cada
   tela, evitando "pulos" enquanto os dados reais chegam do crm-api. */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { CVCard, Skeleton } from './ui';
import { colors, radii } from '@/theme/tokens';

const arr = (n: number) => Array.from({ length: n });

/* Cabeçalho neutro (mesmo espaçamento do MobileTop). */
function TopSkel({ rightSquare }: { rightSquare?: boolean }) {
  return (
    <View style={{ paddingTop: 8, paddingBottom: 14, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Skeleton w={120} h={13} />
        <Skeleton w={180} h={26} style={{ marginTop: 6 }} />
      </View>
      {rightSquare && <Skeleton w={44} h={44} r={14} />}
    </View>
  );
}

export function DashboardSkeleton({ top }: { top: number }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: top, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <TopSkel rightSquare />
      <View style={{ paddingHorizontal: 20, gap: 16 }}>
        <Skeleton w="100%" h={172} r={radii.xl} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {arr(4).map((_, i) => (
            <View key={i} style={{ width: '47.5%', flexGrow: 1 }}>
              <CVCard pad={15}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Skeleton w={30} h={30} r={9} />
                  <View>
                    <Skeleton w={60} h={15} />
                    <Skeleton w={70} h={11} style={{ marginTop: 5 }} />
                  </View>
                </View>
              </CVCard>
            </View>
          ))}
        </View>
        <Skeleton w={150} h={17} style={{ marginTop: 4 }} />
        <View style={{ gap: 10 }}>
          {arr(2).map((_, i) => (
            <CVCard key={i} pad={13}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                <Skeleton w={44} h={36} />
                <View style={{ flex: 1 }}>
                  <Skeleton w="70%" h={14} />
                  <Skeleton w="40%" h={12} style={{ marginTop: 5 }} />
                </View>
                <Skeleton w={70} h={22} r={99} />
              </View>
            </CVCard>
          ))}
        </View>
        <Skeleton w="100%" h={150} r={radii.lg} />
      </View>
    </ScrollView>
  );
}

export function ServicosSkeleton({ top }: { top: number }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: top, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <TopSkel rightSquare />
      <View style={{ paddingHorizontal: 20 }}>
        <Skeleton w="100%" h={52} r={radii.md} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 14 }}>
        {arr(4).map((_, i) => (
          <Skeleton key={i} w={84} h={34} r={99} />
        ))}
      </View>
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        {arr(5).map((_, i) => (
          <CVCard key={i} pad={15}>
            <View style={{ flexDirection: 'row', gap: 13, alignItems: 'flex-start' }}>
              <Skeleton w={46} h={46} r={13} />
              <View style={{ flex: 1 }}>
                <Skeleton w="70%" h={15} />
                <Skeleton w="50%" h={12} style={{ marginTop: 6 }} />
                <View style={{ flexDirection: 'row', gap: 14, marginTop: 11 }}>
                  <Skeleton w={80} h={16} />
                  <Skeleton w={50} h={13} />
                </View>
              </View>
            </View>
          </CVCard>
        ))}
      </View>
    </ScrollView>
  );
}

export function FunilSkeleton({ top }: { top: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: top }}>
      <TopSkel />
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 14 }}>
        {arr(2).map((_, i) => (
          <CVCard key={i} pad={13} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Skeleton w={34} h={34} r={10} />
              <View>
                <Skeleton w={70} h={15} />
                <Skeleton w={60} h={11} style={{ marginTop: 5 }} />
              </View>
            </View>
          </CVCard>
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingHorizontal: 20, paddingBottom: 120 }}
      >
        {arr(3).map((_, col) => (
          <View key={col} style={{ width: 270 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <Skeleton w={10} h={10} r={99} />
              <Skeleton w={90} h={15} />
            </View>
            <Skeleton w={70} h={12} style={{ marginBottom: 10 }} />
            <View style={{ gap: 11 }}>
              {arr(2 + col).map((_, i) => (
                <CVCard key={i} pad={14}>
                  <Skeleton w="85%" h={14} />
                  <Skeleton w="50%" h={12} style={{ marginTop: 6 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 13 }}>
                    <Skeleton w={80} h={28} r={99} />
                    <Skeleton w={56} h={15} />
                  </View>
                </CVCard>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function AgendaSkeleton({ top }: { top: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: top }}>
      <TopSkel rightSquare />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20 }}>
          <CVCard pad={16}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Skeleton w={34} h={34} r={10} />
              <Skeleton w={120} h={16} />
              <Skeleton w={34} h={34} r={10} />
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {arr(7).map((_, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                  <Skeleton w={18} h={10} />
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {arr(35).map((_, i) => (
                <View key={i} style={{ width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Skeleton w={24} h={24} r={11} />
                </View>
              ))}
            </View>
          </CVCard>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 14 }}>
          <Skeleton w={120} h={17} />
          {arr(3).map((_, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 14 }}>
              <Skeleton w={36} h={14} />
              <CVCard pad={14} style={{ flex: 1, borderLeftWidth: 3, borderLeftColor: colors.border }}>
                <Skeleton w="80%" h={14} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 11 }}>
                  <Skeleton w={26} h={26} r={99} />
                  <Skeleton w={120} h={12} />
                </View>
              </CVCard>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
