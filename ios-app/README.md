# TowOps Mobile iOS App

A native iOS app for the TowOps Professional dispatch system, built with React Native and TypeScript.

## 🚛 Features

### Driver App
- **Real-time Dispatch Requests**: Receive and respond to tow requests
- **GPS Tracking**: Live location updates and navigation
- **Request Management**: Accept, reject, and complete assignments
- **Status Updates**: Update availability and job status
- **Push Notifications**: Instant alerts for new requests

### Customer App
- **Service Requests**: Create tow service requests
- **Live Tracking**: Track driver location and ETA
- **Request History**: View past service requests
- **Emergency Requests**: Priority-based emergency towing

## 🛠️ Technology Stack

- **React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **React Navigation**: Navigation between screens
- **React Native Maps**: GPS tracking and maps
- **React Native Push Notifications**: Real-time alerts
- **AsyncStorage**: Local data persistence
- **Axios**: API communication

## 📱 App Structure

```
ios-app/
├── src/
│   ├── components/          # Reusable components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation setup
│   ├── services/           # API services
│   ├── store/              # State management
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
└── package.json            # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Install dependencies**
```bash
cd ios-app
npm install
```

2. **iOS Setup**
```bash
cd ios
pod install
cd ..
```

3. **Start Metro bundler**
```bash
npm start
```

4. **Run on iOS**
```bash
npm run ios
```

5. **Run on Android**
```bash
npm run android
```

## 📱 Screens

### Driver Screens
- **Login**: Driver authentication
- **Dashboard**: Current assignments and status
- **Request Details**: View dispatch request details
- **Navigation**: GPS navigation to customer
- **Status Update**: Update job progress
- **Profile**: Driver profile and settings

### Customer Screens
- **Login**: Customer authentication
- **Request Service**: Create tow request
- **Track Request**: Live tracking with driver location
- **Request History**: Past service requests
- **Profile**: Customer profile and settings

## 🔧 API Integration

The app integrates with the TowOps Professional backend:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Dispatch**: `/api/dispatch/request`, `/api/dispatch/response`
- **Tracking**: `/api/live-tracking`
- **Notifications**: `/api/dispatch/notifications`

## 📲 Push Notifications

- **Driver Notifications**: New dispatch requests, status updates
- **Customer Notifications**: Driver assigned, ETA updates, completion
- **Emergency Alerts**: High-priority request notifications

## 🎨 UI/UX Features

- **Professional Design**: Clean, modern interface
- **Dark/Light Mode**: User preference support
- **Responsive Layout**: Optimized for all screen sizes
- **Accessibility**: VoiceOver and accessibility support
- **Offline Support**: Works without internet connection

## 🔐 Security

- **JWT Authentication**: Secure token-based auth
- **Biometric Login**: Touch ID / Face ID support
- **Data Encryption**: Secure local storage
- **API Security**: HTTPS communication

## 📊 Analytics

- **Usage Tracking**: App usage analytics
- **Performance Monitoring**: Crash reporting
- **User Behavior**: Feature usage insights

## 🚀 Deployment

### iOS App Store
1. Build release version
2. Archive in Xcode
3. Upload to App Store Connect
4. Submit for review

### Android Play Store
1. Generate signed APK
2. Upload to Google Play Console
3. Submit for review

## 🎯 Production Ready

- ✅ **Authentication System**: Complete login/logout
- ✅ **API Integration**: All backend endpoints
- ✅ **GPS Tracking**: Real-time location updates
- ✅ **Push Notifications**: Instant alerts
- ✅ **Offline Support**: Works without internet
- ✅ **Professional UI**: Modern, clean design
- ✅ **Cross-Platform**: iOS and Android support

## 📞 Support

- **Documentation**: See README files
- **Issues**: GitHub Issues
- **Contact**: support@towops.com

---

**🚛 TowOps Mobile - Professional Dispatch on Mobile!** ✨
