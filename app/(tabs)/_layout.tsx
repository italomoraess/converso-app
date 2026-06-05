/* CONVERSO Mobile — bottom Tabs with a central + FAB and a "Criar novo" sheet.
   Mirrors the tab bar + FAB from mobile/app.jsx. */
import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Tabs, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '@/components/Icon';
import { colors, radii, alpha } from '@/theme/tokens';
import { shadow } from '@/components/ui';

const TAB_META: Record<string, { icon: IconName; label: string }> = {
  dashboard: { icon: 'home', label: 'Início' },
  servicos: { icon: 'briefcase', label: 'Serviços' },
  funil: { icon: 'funnel', label: 'Funil' },
  agenda: { icon: 'calendar', label: 'Agenda' },
};

// Order in the bar, with the FAB injected in the middle.
const LEFT = ['dashboard', 'servicos'];
const RIGHT = ['funil', 'agenda'];

// Minimal shape of the props expo-router / react-navigation passes to a custom tabBar.
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

function CustomTabBar({ state, navigation, openFab }: TabBarProps & { openFab: () => void }) {
  const insets = useSafeAreaInsets();
  const routeByName = Object.fromEntries(state.routes.map((r, i) => [r.name, { route: r, index: i }]));

  const renderTab = (name: string) => {
    const entry = routeByName[name];
    if (!entry) return null;
    const meta = TAB_META[name];
    const on = state.index === entry.index;
    return (
      <Pressable
        key={name}
        onPress={() => navigation.navigate(entry.route.name)}
        style={{ flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4 }}
      >
        <Icon name={meta.icon} size={24} stroke={on ? 2.5 : 2} color={on ? colors.primary : colors.textSubtle} />
        <Text style={{ fontSize: 10.5, fontWeight: on ? '800' : '600', color: on ? colors.primary : colors.textSubtle }}>
          {meta.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 10,
        paddingHorizontal: 18,
        paddingBottom: 14 + insets.bottom,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {LEFT.map(renderTab)}

      <View style={{ width: 56, alignItems: 'center' }}>
        <Pressable
          onPress={openFab}
          style={({ pressed }) => ({
            width: 56,
            height: 56,
            borderRadius: 19,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -22,
            transform: [{ scale: pressed ? 0.92 : 1 }],
            ...shadow.primary,
          })}
        >
          <Icon name="plus" size={28} stroke={2.4} color="#fff" />
        </Pressable>
      </View>

      {RIGHT.map(renderTab)}
    </View>
  );
}

function QuickAction({
  icon,
  color,
  title,
  sub,
  onPress,
}: {
  icon: IconName;
  color: string;
  title: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radii.lg,
        backgroundColor: colors.surface,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 13,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(color, 0.16),
        }}
      >
        <Icon name={icon} size={22} stroke={2.2} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 15.5, color: colors.text }}>{title}</Text>
        <Text style={{ fontSize: 13, color: colors.textSubtle, fontWeight: '500' }}>{sub}</Text>
      </View>
      <Icon name="chevR" size={20} color={colors.textSubtle} />
    </Pressable>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const [fab, setFab] = useState(false);

  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} openFab={() => setFab(true)} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      >
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="servicos" />
        <Tabs.Screen name="funil" />
        <Tabs.Screen name="agenda" />
        {/* Perfil is reachable via the avatar; hidden from the bar */}
        <Tabs.Screen name="perfil" options={{ href: null }} />
      </Tabs>

      <Modal visible={fab} transparent animationType="fade" onRequestClose={() => setFab(false)}>
        <Pressable
          onPress={() => setFab(false)}
          style={{ flex: 1, backgroundColor: 'rgba(10,12,24,0.5)', justifyContent: 'flex-end' }}
        >
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
            <View style={{ width: 40, height: 5, borderRadius: 99, backgroundColor: colors.borderStrong, alignSelf: 'center', marginBottom: 18 }} />
            <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 16, color: colors.text }}>Criar novo</Text>
            <View style={{ gap: 10 }}>
              <QuickAction
                icon="briefcase"
                color={colors.primary}
                title="Serviço"
                sub="Adicione ao catálogo"
                onPress={() => {
                  setFab(false);
                  router.push('/servico-form');
                }}
              />
              <QuickAction
                icon="calendar"
                color={colors.stageContato}
                title="Agendamento"
                sub="Reserve um horário"
                onPress={() => {
                  setFab(false);
                  router.push('/(tabs)/agenda');
                }}
              />
              <QuickAction
                icon="funnel"
                color={colors.stageNego}
                title="Negócio"
                sub="Novo card no funil"
                onPress={() => {
                  setFab(false);
                  router.push('/(tabs)/funil');
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
