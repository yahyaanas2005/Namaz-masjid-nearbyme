import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  /**
   * Save data to AsyncStorage
   */
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }

  /**
   * Get data from AsyncStorage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  /**
   * Clear all data from AsyncStorage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  /**
   * Get all keys from AsyncStorage
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }

  /**
   * Save offline data for mosque
   */
  async saveOfflineMosqueData(mosqueId: string, data: any): Promise<void> {
    const key = `@offline_mosque_${mosqueId}`;
    await this.setItem(key, data);
  }

  /**
   * Get offline data for mosque
   */
  async getOfflineMosqueData(mosqueId: string): Promise<any | null> {
    const key = `@offline_mosque_${mosqueId}`;
    return await this.getItem(key);
  }

  /**
   * Cache nearby mosques for offline access
   */
  async cacheNearbyMosques(mosques: any[]): Promise<void> {
    await this.setItem('@cached_mosques', {
      mosques,
      cachedAt: new Date().toISOString(),
    });
  }

  /**
   * Get cached mosques
   */
  async getCachedMosques(): Promise<{ mosques: any[]; cachedAt: string } | null> {
    return await this.getItem('@cached_mosques');
  }
}

export default new StorageService();
