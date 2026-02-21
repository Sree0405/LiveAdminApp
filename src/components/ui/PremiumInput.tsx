import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useApp } from '~/context/AppContext';

type PremiumInputProps = TextInputProps & {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function PremiumInput({
  label,
  error,
  value,
  onFocus,
  onBlur,
  containerStyle,
  leftIcon,
  rightIcon,
  ...rest
}: PremiumInputProps) {
  const { theme } = useApp();

  const [focused, setFocused] = useState(false);

  const anim = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    anim.value = withTiming(value || focused ? 1 : 0, {
      duration: 200,
    });
  }, [focused, value]);

  /* Label Animation */
  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -anim.value * 22 },
      { scale: 1 - anim.value * 0.15 },
    ],
  }));

  /* Border Color */
  const borderColor = error
    ? theme.error
    : focused
    ? theme.accent
    : theme.border;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View
        style={[
          styles.field,
          {
            borderColor,
            backgroundColor: theme.surfaceSecondary,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <View style={styles.inputBox}>
          {/* Floating Label */}
          <Animated.View
            style={[
              styles.labelBox,
              {
                backgroundColor: theme.surfaceSecondary,
              },
              labelStyle,
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: focused
                    ? theme.accent
                    : theme.textSecondary,
                },
              ]}
            >
              {label}
            </Text>
          </Animated.View>

          {/* Input */}
          <TextInput
            value={value}
            style={[
              styles.input,
              {
                color: theme.text,
              },
            ]}
            placeholderTextColor={theme.textTertiary}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />
        </View>

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {!!error && (
        <Text style={[styles.error, { color: theme.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 22,
  },

  field: {
    minHeight: 58,
    borderWidth: 1.5,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  inputBox: {
    flex: 1,
    justifyContent: 'center',
  },

  labelBox: {
    position: 'absolute',
    left: 0,
    top: 18,
    paddingHorizontal: 6,
    zIndex: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
  },

  input: {
    height: 48,
    fontSize: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },

  iconLeft: {
    marginRight: 10,
  },

  iconRight: {
    marginLeft: 10,
  },

  error: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
});