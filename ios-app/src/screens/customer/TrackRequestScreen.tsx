import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../services/AuthService';
import { dispatchService } from '../../services/DispatchService';

interface DispatchRequest {
  id: string;
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

interface Driver {
  id: string;
  name: string;
  phone: string;
  location: { lat: number; lng: number };
  rating: number;
  vehicleType: string;
}

export default function TrackRequestScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DispatchRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DispatchRequest | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      // In a real app, you'd get requests for the current customer
      const data = await dispatchService.getDriverRequests(user?.id || '');
      setRequests(data);
      
      if (data.length > 0) {
        setSelectedRequest(data[0]);
        if (data[0].assignedDriver) {
          // Load driver details
          // This would be a separate API call in production
        }
      }
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'assigned': return '#3b82f6';
      case 'accepted': return '#8b5cf6';
      case 'completed': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const callDriver = () => {
    if (driver?.phone) {
      Alert.alert(
        'Call Driver',
        `Call ${driver.name} at ${driver.phone}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => {
            // In a real app, you'd use Linking to make the call
            Alert.alert('Calling', `Calling ${driver.phone}...`);
          }}
        ]
      );
    }
  };

  const callCustomer = () => {
    if (selectedRequest?.customerPhone) {
      Alert.alert(
        'Call Customer',
        `Call ${selectedRequest.customerName} at ${selectedRequest.customerPhone}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call', onPress: () => {
            // In a real app, you'd use Linking to make the call
            Alert.alert('Calling', `Calling ${selectedRequest.customerPhone}...`);
          }}
        ]
      );
    }
  };

  if (requests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="my-location" size={64} color="#a0aec0" />
        <Text style={styles.emptyTitle}>No Active Requests</Text>
        <Text style={styles.emptySubtitle}>Create a new request to start tracking</Text>
        <TouchableOpacity style={styles.createRequestButton}>
          <Text style={styles.createRequestButtonText}>Create Request</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Track Your Request</Text>
          <Text style={styles.subtitle}>Real-time updates on your tow service</Text>
        </View>

        {selectedRequest && (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.priorityContainer}>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(selectedRequest.priority) },
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {selectedRequest.priority.toUpperCase()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(selectedRequest.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {selectedRequest.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.requestDetails}>
              <Text style={styles.requestId}>Request ID: {selectedRequest.id}</Text>
              <Text style={styles.customerName}>{selectedRequest.customerName}</Text>
              <Text style={styles.vehicleType}>Vehicle: {selectedRequest.vehicleType}</Text>
              <Text style={styles.description}>{selectedRequest.description}</Text>
              
              <View style={styles.locationInfo}>
                <Icon name="location-on" size={16} color="#4a5568" />
                <Text style={styles.locationText}>
                  {selectedRequest.location.address || 
                   `${selectedRequest.location.lat.toFixed(4)}, ${selectedRequest.location.lng.toFixed(4)}`}
                </Text>
              </View>

              {selectedRequest.destination && (
                <View style={styles.locationInfo}>
                  <Icon name="place" size={16} color="#4a5568" />
                  <Text style={styles.locationText}>
                    {selectedRequest.destination.address || 
                     `${selectedRequest.destination.lat.toFixed(4)}, ${selectedRequest.destination.lng.toFixed(4)}`}
                  </Text>
                </View>
              )}
            </View>

            {driver && (
              <View style={styles.driverInfo}>
                <Text style={styles.driverTitle}>Assigned Driver</Text>
                <View style={styles.driverDetails}>
                  <View style={styles.driverInfoLeft}>
                    <Text style={styles.driverName}>{driver.name}</Text>
                    <Text style={styles.driverPhone}>{driver.phone}</Text>
                    <Text style={styles.driverRating}>⭐ {driver.rating}</Text>
                  </View>
                  <View style={styles.driverActions}>
                    <TouchableOpacity style={styles.callButton} onPress={callDriver}>
                      <Icon name="phone" size={20} color="white" />
                      <Text style={styles.callButtonText}>Call Driver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={callCustomer}>
                <Icon name="phone" size={20} color="white" />
                <Text style={styles.actionButtonText}>Call Customer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="refresh" size={20} color="white" />
                <Text style={styles.actionButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: selectedRequest?.location.lat || 34.052235,
            longitude: selectedRequest?.location.lng || -118.243683,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {selectedRequest && (
            <Marker
              coordinate={{
                latitude: selectedRequest.location.lat,
                longitude: selectedRequest.location.lng,
              }}
              title="Pickup Location"
              description={selectedRequest.location.address}
            />
          )}

          {selectedRequest?.destination && (
            <Marker
              coordinate={{
                latitude: selectedRequest.destination.lat,
                longitude: selectedRequest.destination.lng,
              }}
              title="Destination"
              description={selectedRequest.destination.address}
            />
          )}

          {driver && (
            <Marker
              coordinate={{
                latitude: driver.location.lat,
                longitude: driver.location.lng,
              }}
              title="Driver Location"
              description={driver.name}
            />
          )}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    marginTop: 5,
  },
  requestCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  requestHeader: {
    marginBottom: 15,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  requestDetails: {
    marginBottom: 20,
  },
  requestId: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 5,
  },
  vehicleType: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#4a5568',
    marginLeft: 8,
  },
  driverInfo: {
    backgroundColor: '#f7fafc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  driverTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 10,
  },
  driverDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfoLeft: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  driverPhone: {
    fontSize: 14,
    color: '#4a5568',
    marginTop: 2,
  },
  driverRating: {
    fontSize: 14,
    color: '#4a5568',
    marginTop: 2,
  },
  driverActions: {
    marginLeft: 15,
  },
  callButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 300,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  map: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8fafc',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a5568',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    marginBottom: 30,
  },
  createRequestButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 15,
    paddingHorizontal: 30,
  },
  createRequestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
