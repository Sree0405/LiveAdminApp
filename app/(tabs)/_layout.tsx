import { Tabs } from 'expo-router';
import React from 'react';
import { useApp } from '~/context/AppContext';
import { AnimatedTabBar } from '~/components/AnimatedTabBar';
import { IconSymbol } from '@/components/ui/icon-symbol';

const TAB_ICONS: Record<string, 'square.grid.2x2.fill' | 'folder.fill' | 'plus.circle.fill' | 'doc.text.fill' | 'chart.bar.fill' | 'gearshape.fill'> = {
  index: 'square.grid.2x2.fill',
  records: 'folder.fill',
  add: 'plus.circle.fill',
  expenses: 'doc.text.fill',
  analytics: 'chart.bar.fill',
  settings: 'gearshape.fill',
};

function TabIcon({ name, color, size = 24 }: { name: string; color: string; size?: number }) {
  return <IconSymbol size={size} name={TAB_ICONS[name] ?? 'circle'} color={color} />;
}

export default function TabLayout() {
  const { theme } = useApp();

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarIconStyle: { marginBottom: 0 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => <TabIcon name="index" color={color} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color }) => <TabIcon name="records" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <TabIcon name="add" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <TabIcon name="expenses" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <TabIcon name="analytics" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
