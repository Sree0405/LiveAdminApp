import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '~/context/AppContext';

const AnimatedView = Animated.createAnimatedComponent(View);

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useApp();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: insets.bottom || 16,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        const icon = options.tabBarIcon?.({ focused: isFocused, color: isFocused ? theme.accent : theme.textSecondary, size: 24 });
        const label = options.title ?? route.name;
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
          >
            {isFocused && (
              <AnimatedView
                style={[
                  styles.indicator,
                  {
                    backgroundColor: theme.accent + '22',
                    borderRadius: 12,
                  },
                ]}
              />
            )}
            <View style={styles.iconWrap}>{icon}</View>
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? theme.accent : theme.textSecondary,
                  fontWeight: isFocused ? '600' : '500',
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 28,
  },
  iconWrap: { marginBottom: 2 },
  label: { fontSize: 11 },
});
