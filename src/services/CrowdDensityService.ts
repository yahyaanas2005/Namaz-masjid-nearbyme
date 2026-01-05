import { CrowdDensity } from '@models/Mosque';

class CrowdDensityService {
  /**
   * Calculate crowd density score based on current and average attendance
   */
  calculateDensityScore(currentCount: number, averageCount: number): number {
    if (averageCount === 0) return 0;
    return Math.min((currentCount / averageCount) * 100, 100);
  }

  /**
   * Get crowd density level as a string
   */
  getDensityLevel(score: number): 'Low' | 'Medium' | 'High' | 'Very High' {
    if (score < 25) return 'Low';
    if (score < 50) return 'Medium';
    if (score < 75) return 'High';
    return 'Very High';
  }

  /**
   * Check if prayer time can be validated based on crowd density
   */
  canValidatePrayerTime(userCount: number, threshold: number = 50): boolean {
    return userCount >= threshold;
  }

  /**
   * Update crowd density when user checks in at mosque
   */
  updateCrowdDensity(
    currentDensity: CrowdDensity,
    prayerName: string,
  ): CrowdDensity {
    const updatedPeakHours = { ...currentDensity.peakHours };
    updatedPeakHours[prayerName] = (updatedPeakHours[prayerName] || 0) + 1;

    return {
      currentCount: currentDensity.currentCount + 1,
      averageCount: this.calculateNewAverage(
        currentDensity.averageCount,
        currentDensity.currentCount + 1,
      ),
      peakHours: updatedPeakHours,
      lastUpdated: new Date(),
    };
  }

  /**
   * Calculate new average attendance
   */
  private calculateNewAverage(oldAverage: number, newValue: number): number {
    // Using exponential moving average with alpha = 0.1
    const alpha = 0.1;
    return oldAverage + alpha * (newValue - oldAverage);
  }

  /**
   * Get recommended prayer time based on crowd reports
   */
  getRecommendedPrayerTime(reports: { time: string; count: number }[]): string | null {
    if (reports.length === 0) return null;

    // Find the time with the most reports
    const sortedReports = reports.sort((a, b) => b.count - a.count);
    return sortedReports[0].time;
  }

  /**
   * Analyze crowd density trends over time
   */
  analyzeTrends(historicalData: { date: Date; count: number }[]): {
    trend: 'increasing' | 'decreasing' | 'stable';
    averageGrowth: number;
  } {
    if (historicalData.length < 2) {
      return { trend: 'stable', averageGrowth: 0 };
    }

    const growthRates = [];
    for (let i = 1; i < historicalData.length; i++) {
      const prevCount = historicalData[i - 1].count;
      const currCount = historicalData[i].count;
      const growth = prevCount !== 0 ? ((currCount - prevCount) / prevCount) * 100 : 0;
      growthRates.push(growth);
    }

    const averageGrowth =
      growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;

    let trend: 'increasing' | 'decreasing' | 'stable';
    if (averageGrowth > 5) {
      trend = 'increasing';
    } else if (averageGrowth < -5) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }

    return { trend, averageGrowth };
  }
}

export default new CrowdDensityService();
