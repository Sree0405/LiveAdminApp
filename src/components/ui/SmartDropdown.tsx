import React from 'react';
import { View, Text, Modal, Pressable, FlatList, StyleSheet } from 'react-native';
import { useApp } from '~/context/AppContext';

export type DropdownOption<T = string> = { value: T; label: string; icon?: React.ReactNode };

type SmartDropdownProps<T = string> = {
  visible: boolean;
  options: DropdownOption<T>[];
  selectedValue?: T;
  onSelect: (value: T) => void;
  onDismiss: () => void;
  title?: string;
};

export function SmartDropdown<T = string>({
  visible,
  options,
  selectedValue,
  onSelect,
  onDismiss,
  title = 'Select',
}: SmartDropdownProps<T>) {
  const { theme } = useApp();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => {
              const selected = item.value === selectedValue;
              return (
                <Pressable
                  style={[
                    styles.option,
                    { backgroundColor: selected ? theme.surfaceSecondary : 'transparent' },
                  ]}
                  onPress={() => { onSelect(item.value); onDismiss(); }}
                >
                  {item.icon}
                  <Text style={[styles.optionLabel, { color: theme.text }]}>{item.label}</Text>
                  {selected && <Text style={[styles.check, { color: theme.accent }]}>✓</Text>}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: 34,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, paddingHorizontal: 24 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  optionLabel: { flex: 1, fontSize: 17 },
  check: { fontSize: 17, fontWeight: '700' },
});
