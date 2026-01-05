import { format, parseISO, differenceInMinutes } from 'date-fns';
import { PrayerTimes } from '@models/Mosque';

class PrayerTimeService {
  /**
   * Get the current prayer based on the time
   */
  getCurrentPrayer(prayerTimes: PrayerTimes): string | null {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');

    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];

    for (let i = 0; i < prayers.length; i++) {
      const currentPrayer = prayers[i];
      const nextPrayer = prayers[i + 1];

      if (currentTime >= currentPrayer.time && (!nextPrayer || currentTime < nextPrayer.time)) {
        return currentPrayer.name;
      }
    }

    // If after Isha, current prayer is Isha
    if (currentTime >= prayerTimes.isha) {
      return 'Isha';
    }

    // If before Fajr, previous prayer was Isha
    return 'Isha';
  }

  /**
   * Get the next prayer
   */
  getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: string } | null {
    const now = new Date();
    const currentTime = format(now, 'HH:mm');

    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr },
      { name: 'Dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', time: prayerTimes.asr },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', time: prayerTimes.isha },
    ];

    for (const prayer of prayers) {
      if (currentTime < prayer.time) {
        return prayer;
      }
    }

    // If all prayers have passed, next is Fajr tomorrow
    return { name: 'Fajr', time: prayerTimes.fajr };
  }

  /**
   * Calculate time remaining until next prayer in minutes
   */
  getTimeUntilNextPrayer(prayerTimes: PrayerTimes): number {
    const nextPrayer = this.getNextPrayer(prayerTimes);
    if (!nextPrayer) return 0;

    const now = new Date();
    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date(now);
    prayerTime.setHours(hours, minutes, 0, 0);

    // If prayer time is earlier in the day, it's tomorrow
    if (prayerTime < now) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }

    return differenceInMinutes(prayerTime, now);
  }

  /**
   * Validate prayer times based on crowd density
   */
  validatePrayerTimes(reports: any[], threshold: number = 50): PrayerTimes | null {
    if (reports.length < threshold) {
      return null;
    }

    // Group reports by prayer name
    const groupedReports: { [key: string]: string[] } = {};
    reports.forEach(report => {
      if (!groupedReports[report.prayerName]) {
        groupedReports[report.prayerName] = [];
      }
      groupedReports[report.prayerName].push(report.reportedTime);
    });

    // Find the most reported time for each prayer
    const validatedTimes: any = {};
    Object.keys(groupedReports).forEach(prayerName => {
      const times = groupedReports[prayerName];
      const timeCount: { [key: string]: number } = {};

      times.forEach(time => {
        timeCount[time] = (timeCount[time] || 0) + 1;
      });

      // Find the time with the most reports
      const mostReportedTime = Object.keys(timeCount).reduce((a, b) =>
        timeCount[a] > timeCount[b] ? a : b,
      );

      validatedTimes[prayerName.toLowerCase()] = mostReportedTime;
    });

    return {
      fajr: validatedTimes.fajr || '05:00',
      dhuhr: validatedTimes.dhuhr || '12:30',
      asr: validatedTimes.asr || '15:30',
      maghrib: validatedTimes.maghrib || '18:00',
      isha: validatedTimes.isha || '19:30',
      jumah: validatedTimes.jumah,
      lastUpdated: new Date(),
      validatedByCount: reports.length,
      isValidated: reports.length >= threshold,
    };
  }

  /**
   * Format prayer time for display
   */
  formatPrayerTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return format(date, 'h:mm a');
  }

  /**
   * Get the current season based on date
   */
  getCurrentSeason(): 'winter' | 'summer' | 'spring' | 'fall' {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }
}

export default new PrayerTimeService();
