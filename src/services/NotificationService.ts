import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    this.createChannels();
  }

  createChannels() {
    PushNotification.createChannel(
      {
        channelId: 'prayer-times',
        channelName: 'Prayer Time Reminders',
        channelDescription: 'Notifications for upcoming prayer times',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`createChannel 'prayer-times' returned '${created}'`),
    );

    PushNotification.createChannel(
      {
        channelId: 'mosque-updates',
        channelName: 'Mosque Updates',
        channelDescription: 'Updates about nearby mosques',
        playSound: true,
        soundName: 'default',
        importance: 3,
        vibrate: true,
      },
      created => console.log(`createChannel 'mosque-updates' returned '${created}'`),
    );
  }

  /**
   * Schedule a prayer time reminder
   */
  schedulePrayerReminder(prayerName: string, time: string, minutesBefore: number = 15) {
    const [hours, minutes] = time.split(':').map(Number);
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes - minutesBefore, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (reminderDate < new Date()) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      channelId: 'prayer-times',
      title: `${prayerName} Prayer Time`,
      message: `${prayerName} prayer is in ${minutesBefore} minutes`,
      date: reminderDate,
      allowWhileIdle: true,
      repeatType: 'day',
    });
  }

  /**
   * Send local notification
   */
  sendLocalNotification(title: string, message: string, channelId: string = 'mosque-updates') {
    PushNotification.localNotification({
      channelId,
      title,
      message,
      playSound: true,
      soundName: 'default',
    });
  }

  /**
   * Cancel all scheduled notifications
   */
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      PushNotification.checkPermissions(permissions => {
        if (permissions.alert && permissions.badge && permissions.sound) {
          resolve(true);
        } else {
          PushNotification.requestPermissions()
            .then(() => resolve(true))
            .catch(() => resolve(false));
        }
      });
    });
  }
}

export default new NotificationService();
