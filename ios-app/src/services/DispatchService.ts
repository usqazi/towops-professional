import axios from 'axios';

const API_BASE_URL = 'https://your-domain.com/api'; // Replace with your deployed API URL

interface DispatchRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  location: { lat: number; lng: number; address?: string };
  destination?: { lat: number; lng: number; address?: string };
  priority: 'low' | 'medium' | 'high' | 'emergency';
  vehicleType: string;
  description: string;
  status: 'pending' | 'assigned' | 'accepted' | 'rejected' | 'completed';
  createdAt: number;
  assignedDriver?: string;
}

interface DriverResponse {
  success: boolean;
  message?: string;
  dispatchRequest?: DispatchRequest;
}

class DispatchService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async createRequest(requestData: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    location: { lat: number; lng: number };
    destination?: { lat: number; lng: number };
    priority: string;
    vehicleType: string;
    description: string;
  }): Promise<DriverResponse> {
    try {
      const response = await this.api.post('/dispatch/request', requestData);
      return response.data;
    } catch (error: any) {
      console.error('Create request error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create request',
      };
    }
  }

  async getDriverRequests(driverId: string): Promise<DispatchRequest[]> {
    try {
      const response = await this.api.get(`/dispatch/request?driverId=${driverId}`);
      return response.data.requests || [];
    } catch (error) {
      console.error('Get driver requests error:', error);
      return [];
    }
  }

  async respondToRequest(
    requestId: string,
    driverId: string,
    action: 'accept' | 'reject' | 'complete'
  ): Promise<boolean> {
    try {
      const response = await this.api.post('/dispatch/response', {
        requestId,
        driverId,
        action,
      });
      return response.data.success || false;
    } catch (error) {
      console.error('Respond to request error:', error);
      return false;
    }
  }

  async getRequestDetails(requestId: string): Promise<DispatchRequest | null> {
    try {
      const response = await this.api.get(`/dispatch/request?requestId=${requestId}`);
      return response.data.requests?.[0] || null;
    } catch (error) {
      console.error('Get request details error:', error);
      return null;
    }
  }

  async updateDriverLocation(
    driverId: string,
    location: { lat: number; lng: number }
  ): Promise<boolean> {
    try {
      const response = await this.api.post('/live-tracking', {
        driverId,
        location,
        timestamp: Date.now(),
      });
      return response.data.success || false;
    } catch (error) {
      console.error('Update location error:', error);
      return false;
    }
  }

  async getNotifications(driverId: string): Promise<any[]> {
    try {
      const response = await this.api.get(`/dispatch/notifications?driverId=${driverId}`);
      return response.data.notifications || [];
    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await this.api.post('/dispatch/notifications', {
        driverId: 'current', // Will be replaced with actual driver ID
        action: 'mark_read',
        data: { notificationId },
      });
      return response.data.success || false;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return false;
    }
  }
}

export const dispatchService = new DispatchService();
