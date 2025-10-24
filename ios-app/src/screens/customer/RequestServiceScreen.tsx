import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../services/AuthService';
import { dispatchService } from '../../services/DispatchService';

export default function RequestServiceScreen() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    location: '',
    destination: '',
    vehicleType: 'sedan',
    priority: 'medium',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.location || !formData.vehicleType) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      // Mock geocoding - in production, use a real geocoding service
      const mockGeocode = (address: string) => ({
        lat: 34.052235 + (Math.random() - 0.5) * 0.1,
        lng: -118.243683 + (Math.random() - 0.5) * 0.1,
        address: address,
      });

      const requestData = {
        customerId: user?.id || '',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        location: mockGeocode(formData.location),
        destination: formData.destination ? mockGeocode(formData.destination) : undefined,
        priority: formData.priority,
        vehicleType: formData.vehicleType,
        description: formData.description,
      };

      const result = await dispatchService.createRequest(requestData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Tow request submitted successfully!',
          [{ text: 'OK', onPress: () => {
            // Navigate to tracking screen
          }}]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to submit request');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'truck', label: 'Pickup Truck' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'heavy_duty', label: 'Heavy Duty (Bus/RV)' },
  ];

  const priorities = [
    { value: 'low', label: 'Low (Routine)', color: '#10b981' },
    { value: 'medium', label: 'Medium (Standard)', color: '#3b82f6' },
    { value: 'high', label: 'High (Urgent)', color: '#f59e0b' },
    { value: 'emergency', label: 'Emergency (Immediate)', color: '#ef4444' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Request Tow Service</Text>
          <Text style={styles.subtitle}>Fill out the form below to request a tow truck</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.customerName}
              onChangeText={(text) => setFormData({ ...formData, customerName: text })}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.customerPhone}
              onChangeText={(text) => setFormData({ ...formData, customerPhone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="e.g., 123 Main St, Anytown"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Destination (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.destination}
              onChangeText={(text) => setFormData({ ...formData, destination: text })}
              placeholder="Where do you want to go?"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type *</Text>
            <View style={styles.optionsContainer}>
              {vehicleTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.optionButton,
                    formData.vehicleType === type.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, vehicleType: type.value })}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      formData.vehicleType === type.value && styles.optionButtonTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority *</Text>
            <View style={styles.optionsContainer}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityButton,
                    formData.priority === priority.value && styles.priorityButtonSelected,
                    { borderColor: priority.color },
                  ]}
                  onPress={() => setFormData({ ...formData, priority: priority.value })}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      formData.priority === priority.value && { color: priority.color },
                    ]}
                  >
                    {priority.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="e.g., Flat tire, engine trouble, accident..."
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Icon name="send" size={20} color="white" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Request Tow Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 80,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#4a5568',
  },
  optionButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  priorityButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: '#f0f9ff',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
