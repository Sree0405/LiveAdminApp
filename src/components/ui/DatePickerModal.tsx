import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '~/context/AppContext';
import { PrimaryButton } from './PrimaryButton';

type DatePickerModalProps = {
  visible: boolean;
  value: Date;
  onConfirm: (date: Date) => void;
  onDismiss: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: 'date' | 'datetime' | 'time';
};

export function DatePickerModal({
  visible,
  value,
  onConfirm,
  onDismiss,
  minimumDate,
  maximumDate,
  mode = 'date',
}: DatePickerModalProps) {
  const { theme } = useApp();
  const [innerDate, setInnerDate] = React.useState(value);

  React.useEffect(() => { setInnerDate(value); }, [value, visible]);

  if (!visible) return null;

  const handleChange = (_: unknown, d?: Date) => {
    if (d) setInnerDate(d);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          <Text style={[styles.title, { color: theme.text }]}>Select date</Text>
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={innerDate}
              mode={mode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              themeVariant={theme.background === '#09090B' ? 'dark' : 'light'}
            />
          </View>
          <View style={styles.actions}>
            <PrimaryButton title="Cancel" variant="outline" onPress={onDismiss} style={styles.btn} />
            <PrimaryButton title="Done" onPress={() => onConfirm(innerDate)} style={styles.btn} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    paddingHorizontal: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  pickerWrap: { alignItems: 'center', marginVertical: 8 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btn: { flex: 1 },
});
