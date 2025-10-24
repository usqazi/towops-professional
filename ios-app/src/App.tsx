import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DriverDashboardScreen from './src/screens/driver/DriverDashboardScreen';
import CustomerDashboardScreen from './src/screens/customer/CustomerDashboardScreen';
import RequestServiceScreen from './src/screens/customer/RequestServiceScreen';
import TrackRequestScreen from './src/screens/customer/TrackRequestScreen';
import DispatchRequestScreen from './src/screens/driver/DispatchRequestScreen';
import NavigationScreen from './src/screens/driver/NavigationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Services
import { AuthProvider, useAuth } from './src/services/AuthService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Driver Tab Navigator
function DriverTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Requests') {
            iconName = 'assignment';
          } else if (route.name === 'Navigation') {
            iconName = 'navigation';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DriverDashboardScreen} />
      <Tab.Screen name="Requests" component={DispatchRequestScreen} />
      <Tab.Screen name="Navigation" component={NavigationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Customer Tab Navigator
function CustomerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Request') {
            iconName = 'add-circle';
          } else if (route.name === 'Track') {
            iconName = 'my-location';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={CustomerDashboardScreen} />
      <Tab.Screen name="Request" component={RequestServiceScreen} />
      <Tab.Screen name="Track" component={TrackRequestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const { user, isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user?.role === 'driver' ? (
          <Stack.Screen name="DriverApp" component={DriverTabNavigator} />
        ) : (
          <Stack.Screen name="CustomerApp" component={CustomerTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
