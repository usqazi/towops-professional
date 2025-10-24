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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../services/AuthService';
import { dispatchService } from '../../services/DispatchService';

interface DispatchRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  location: { lat: number; lng: number; address?: string };
  priority: 'low' | 'medium' | 'high' | 'emergency';
  vehicleType: string;
  description: string;
  status: 'pending' | 'assigned' | 'accepted' | 'rejected' | 'completed';
  createdAt: number;
}

export default function DriverDashboardScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DispatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await dispatchService.getDriverRequests(user?.id || '');
      setRequests(data);
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

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const success = await dispatchService.respondToRequest(requestId, user?.id || '', action);
      if (success) {
        Alert.alert('Success', `Request ${action}ed successfully`);
        loadRequests();
      } else {
        Alert.alert('Error', `Failed to ${action} request`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} request`);
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
        <Text style={styles.roleText}>Driver Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="assignment" size={24} color="#2563eb" />
          <Text style={styles.statNumber}>{requests.length}</Text>
          <Text style={styles.statLabel}>Active Requests</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>
            {requests.filter(r => r.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.requestsSection}>
        <Text style={styles.sectionTitle}>Dispatch Requests</Text>
        
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="assignment" size={48} color="#a0aec0" />
            <Text style={styles.emptyText}>No active requests</Text>
            <Text style={styles.emptySubtext}>You'll be notified when new requests arrive</Text>
          </View>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.priorityContainer}>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(request.priority) },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {request.priority.toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(request.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {request.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.requestContent}>
                <Text style={styles.customerName}>{request.customerName}</Text>
                <Text style={styles.customerPhone}>{request.customerPhone}</Text>
                <Text style={styles.vehicleType}>Vehicle: {request.vehicleType}</Text>
                <Text style={styles.description}>{request.description}</Text>
                <Text style={styles.location}>
                  📍 {request.location.address || `${request.location.lat.toFixed(4)}, ${request.location.lng.toFixed(4)}`}
                </Text>
              </View>

              {request.status === 'assigned' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleRequestAction(request.id, 'accept')}
                  >
                    <Icon name="check" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRequestAction(request.id, 'reject')}
                  >
                    <Icon name="close" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}

              {request.status === 'accepted' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.navigateButton]}
                    onPress={() => {
                      // Navigate to navigation screen
                    }}
                  >
                    <Icon name="navigation" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Navigate</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={() => {
                      // Complete request
                    }}
                  >
                    <Icon name="check-circle" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  roleText: {
    fontSize: 16,
    color: '#4a5568',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#4a5568',
    marginTop: 5,
  },
  requestsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5568',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#a0aec0',
    marginTop: 5,
    textAlign: 'center',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
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
  requestContent: {
    marginBottom: 15,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  customerPhone: {
    fontSize: 16,
    color: '#4a5568',
    marginTop: 5,
  },
  vehicleType: {
    fontSize: 14,
    color: '#4a5568',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#4a5568',
    marginTop: 10,
    fontStyle: 'italic',
  },
  location: {
    fontSize: 14,
    color: '#4a5568',
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 5,
  },
  acceptButton: {
    backgroundColor: '#10b981',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  navigateButton: {
    backgroundColor: '#3b82f6',
  },
  completeButton: {
    backgroundColor: '#8b5cf6',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
