import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Mosque, PrayerTimeReport, Testimonial, MosqueCommitteeApproval } from '@models/Mosque';
import { Location } from '@models/Mosque';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
      timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for adding auth token
    this.api.interceptors.request.use(
      async config => {
        // Add auth token if available
        // const token = await getAuthToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response interceptor for handling errors
    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Fetch nearby mosques based on location
   */
  async getNearbyMosques(location: Location, radius: number = 10): Promise<Mosque[]> {
    const response = await this.api.get('/mosques/nearby', {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        radius,
      },
    });
    return response.data;
  }

  /**
   * Get mosque details by ID
   */
  async getMosqueById(mosqueId: string): Promise<Mosque> {
    const response = await this.api.get(`/mosques/${mosqueId}`);
    return response.data;
  }

  /**
   * Submit a prayer time report
   */
  async submitPrayerTimeReport(report: Omit<PrayerTimeReport, 'id'>): Promise<PrayerTimeReport> {
    const response = await this.api.post('/prayer-times/report', report);
    return response.data;
  }

  /**
   * Get validated prayer times for a mosque
   */
  async getValidatedPrayerTimes(mosqueId: string): Promise<any> {
    const response = await this.api.get(`/prayer-times/${mosqueId}/validated`);
    return response.data;
  }

  /**
   * Submit a testimonial for a mosque
   */
  async submitTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'likes'>): Promise<Testimonial> {
    const response = await this.api.post('/testimonials', testimonial);
    return response.data;
  }

  /**
   * Get testimonials for a mosque
   */
  async getTestimonials(mosqueId: string): Promise<Testimonial[]> {
    const response = await this.api.get(`/testimonials/${mosqueId}`);
    return response.data;
  }

  /**
   * Update crowd density for a mosque
   */
  async updateCrowdDensity(mosqueId: string, userId: string): Promise<void> {
    await this.api.post(`/mosques/${mosqueId}/crowd-density`, { userId });
  }

  /**
   * Get crowd density for a mosque
   */
  async getCrowdDensity(mosqueId: string): Promise<any> {
    const response = await this.api.get(`/mosques/${mosqueId}/crowd-density`);
    return response.data;
  }

  /**
   * Submit mosque committee approval
   */
  async submitCommitteeApproval(approval: MosqueCommitteeApproval): Promise<void> {
    await this.api.post('/committee/approval', approval);
  }

  /**
   * Search mosques by name or location
   */
  async searchMosques(query: string): Promise<Mosque[]> {
    const response = await this.api.get('/mosques/search', {
      params: { q: query },
    });
    return response.data;
  }

  /**
   * Get historical prayer times for a mosque
   */
  async getHistoricalPrayerTimes(mosqueId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const response = await this.api.get(`/prayer-times/${mosqueId}/historical`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  }
}

export default new ApiService();
