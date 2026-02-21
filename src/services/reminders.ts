import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getDb } from '../database/init';
import type { RecordRow } from '../database/types';
import type { ReminderConfig } from '../database/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'LifeAdmin Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function parseReminderConfig(json: string): ReminderConfig {
  try {
    const o = JSON.parse(json);
    return {
      enabled: !!o.enabled,
      daysBefore: Array.isArray(o.daysBefore) ? o.daysBefore : [30, 7, 3, 1, 0],
      dailyReminder: !!o.dailyReminder,
    };
  } catch {
    return { enabled: true, daysBefore: [30, 7, 3, 1, 0], dailyReminder: false };
  }
}

export async function scheduleRecordReminders(record: RecordRow): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const config = parseReminderConfig(record.reminder_config);
  if (!config.enabled) return;

  const due = new Date(record.due_date);
  const dueTime = new Date(due);
  dueTime.setHours(9, 0, 0, 0);

  for (const days of config.daysBefore) {
    const notifyAt = new Date(dueTime);
    notifyAt.setDate(notifyAt.getDate() - days);
    if (notifyAt.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'LifeAdmin Pro',
          body: `"${record.title}" due in ${days === 0 ? 'today' : `${days} days`}`,
          data: { recordId: record.id },
        },
        trigger: { date: notifyAt, channelId: 'default' },
      });
    }
  }

  if (config.dailyReminder) {
    const dayBefore = new Date(dueTime);
    dayBefore.setDate(dayBefore.getDate() - 1);
    if (dayBefore.getTime() > Date.now()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'LifeAdmin Pro',
          body: `"${record.title}" is due tomorrow`,
          data: { recordId: record.id },
        },
        trigger: { date: dayBefore, channelId: 'default', repeats: false },
      });
    }
  }
}

export async function rescheduleAllReminders(): Promise<void> {
  const db = await getDb();
  const rows = await db.getAllAsync<RecordRow>(
    "SELECT * FROM records WHERE status = 'active' AND due_date >= date('now') ORDER BY due_date ASC LIMIT 50"
  );
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const record of rows) {
    await scheduleRecordReminders(record);
  }
}
