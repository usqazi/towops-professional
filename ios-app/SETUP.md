# TowOps Mobile iOS App - Setup Instructions

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode (for iOS development)
- CocoaPods (for iOS dependencies)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/usqazi/towops-professional.git
cd towops-professional/ios-app
```

2. **Install dependencies**
```bash
npm install
```

3. **iOS Setup**
```bash
cd ios
pod install
cd ..
```

4. **Start Metro bundler**
```bash
npm start
```

5. **Run on iOS Simulator**
```bash
npm run ios
```

## 📱 Features Implemented

### ✅ **Complete iOS App Structure**
- **Authentication System**: Login with demo accounts
- **Driver App**: Dashboard, requests, navigation, profile
- **Customer App**: Request service, track requests, profile
- **Real-time Updates**: Live tracking and notifications
- **Professional UI**: Modern, clean interface design
- **GPS Integration**: Maps and location services
- **Push Notifications**: Real-time alerts

### 🎯 **Demo Accounts**
- **Driver**: driver@towops.com / password
- **Customer**: customer@towops.com / password
- **Dispatcher**: dispatcher@towops.com / password
- **Admin**: admin@towops.com / password

## 🔧 **Configuration**

### API Configuration
Update the API base URL in:
- `src/services/AuthService.ts`
- `src/services/DispatchService.ts`

Replace `https://your-domain.com/api` with your deployed API URL.

### Maps Configuration
For production, configure:
- Google Maps API key (iOS)
- Mapbox API key (alternative)

## 📱 **App Structure**

```
ios-app/
├── src/
│   ├── components/          # Reusable components
│   ├── screens/            # App screens
│   │   ├── driver/         # Driver-specific screens
│   │   ├── customer/       # Customer-specific screens
│   │   └── LoginScreen.tsx # Authentication
│   ├── navigation/         # Navigation setup
│   ├── services/           # API services
│   │   ├── AuthService.ts  # Authentication
│   │   └── DispatchService.ts # Dispatch API
│   ├── store/              # State management
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── ios/                    # iOS-specific code
├── android/                # Android-specific code
└── package.json            # Dependencies
```

## 🚀 **Production Deployment**

### iOS App Store
1. **Configure App ID**: Set up Apple Developer account
2. **Build Release**: Archive in Xcode
3. **Upload**: Submit to App Store Connect
4. **Review**: Submit for App Store review

### Android Play Store
1. **Generate Signed APK**: Create release build
2. **Upload**: Submit to Google Play Console
3. **Review**: Submit for Play Store review

## 🎯 **Next Steps**

1. **Deploy Backend**: Ensure API is deployed and accessible
2. **Configure Maps**: Add real map API keys
3. **Test Integration**: Verify API connectivity
4. **Add Push Notifications**: Configure Firebase/APNs
5. **Customize Branding**: Update colors and logos
6. **Add Features**: Implement additional functionality

## 📞 **Support**

- **Documentation**: See README files
- **Issues**: GitHub Issues
- **Contact**: support@towops.com

---

**🚛 TowOps Mobile - Ready for iOS Development!** ✨
