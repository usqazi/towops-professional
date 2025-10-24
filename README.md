# 🚛 TowOps Professional - Uber-Style Dispatch System

A complete, production-ready dispatch management system with Uber-style driver assignment, real-time tracking, and professional UI/UX.

## ✨ Features

### 🎯 **Uber-Style Dispatch System**
- **Priority-Based Assignment**: Emergency, High, Medium, Low priorities
- **Intelligent Driver Matching**: Distance, rating, experience, and priority-based algorithm
- **Real-Time Notifications**: Instant driver alerts and status updates
- **Driver Acceptance System**: Accept/reject requests with automatic reassignment

### 📱 **Complete User Interfaces**
- **Customer Request Page**: Professional request form with priority selection
- **Request Tracking**: Real-time tracking with driver location and ETA
- **Dispatch Management**: Complete dispatcher dashboard with live queue
- **Driver Mobile App**: Uber-style mobile interface for drivers
- **Authentication System**: Secure login/logout with role-based access

### 🚀 **Advanced Features**
- **Live GPS Tracking**: Real-time driver location updates
- **Mobile-Friendly Design**: Responsive design for all devices
- **Professional UI/UX**: Modern, clean interface design
- **Shared Data Store**: Centralized data management
- **API Endpoints**: Complete REST API system

## 🛠️ **Technology Stack**

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Authentication**: Custom JWT-based system
- **Maps**: Leaflet.js integration
- **Styling**: CSS-in-JS with responsive design
- **Data Management**: In-memory store with cleanup

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/towops-professional.git
cd towops-professional
```

2. **Install dependencies**
```bash
cd apps/web
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 📱 **User Roles & Access**

### 👑 **Admin**
- Full system access
- User management
- System settings
- All features unlocked

### 📞 **Dispatcher**
- Dispatch management
- Live tracking
- Reports & analytics
- NSV QA system

### 🚛 **Driver**
- Mobile driver app
- Live tracking
- Assignment management
- Status updates

### 👤 **Customer**
- Service requests
- Request tracking
- History viewing
- Basic features

## 🎯 **Demo Credentials**

- **Admin**: admin@towops.com / password
- **Dispatcher**: dispatcher@towops.com / password
- **Driver**: driver@towops.com / password

## 📋 **API Endpoints**

### Dispatch System
- `POST /api/dispatch/request` - Create dispatch request
- `GET /api/dispatch/request` - Get dispatch requests
- `POST /api/dispatch/response` - Driver accept/reject/complete
- `GET /api/dispatch/response` - Get driver status
- `POST /api/dispatch/notifications` - Send notifications
- `GET /api/dispatch/notifications` - Get notifications

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Verify token
- `POST /api/auth/logout` - User logout

## 🎨 **Pages & Routes**

- `/` - Landing page (redirects based on auth)
- `/login` - User login
- `/dashboard` - Role-based dashboard
- `/request` - Customer request form
- `/track` - Request tracking
- `/dispatch-management` - Dispatcher dashboard
- `/driver-mobile` - Driver mobile app
- `/live-tracking` - Live GPS tracking
- `/reports` - Reports & analytics
- `/nsv` - NSV QA system

## 🔧 **Development**

### Project Structure
```
apps/web/
├── app/
│   ├── (routes)/          # Page routes
│   ├── api/               # API endpoints
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utilities and stores
└── public/                # Static assets
```

### Key Components
- `Header.tsx` - Professional header with auth
- `Footer.tsx` - Professional footer
- `MobileLayout.tsx` - Mobile-friendly layout
- `GPSTracker.tsx` - GPS tracking component
- `dispatch-store.ts` - Shared data management

## 🚀 **Production Deployment**

The system is production-ready and can be deployed to:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS**
- **Google Cloud**
- **Any Node.js hosting**

### Environment Variables
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## 📊 **System Architecture**

### Data Flow
1. **Customer** creates request via `/request`
2. **System** assigns best driver using Uber-style algorithm
3. **Driver** receives notification and accepts/rejects
4. **Customer** tracks request via `/track`
5. **Driver** completes service
6. **System** updates all parties in real-time

### Uber-Style Algorithm
```typescript
// Scoring factors
const distanceScore = Math.max(0, 100 - (distance * 10))
const ratingScore = driver.rating * 20
const priorityScore = driver.priority
const experienceScore = Math.min(50, driver.totalJobs / 4)
const recencyScore = Math.max(0, 50 - ((Date.now() - driver.lastActive) / 60000))

// Priority multiplier
const priorityMultiplier = {
  emergency: 2.0,
  high: 1.5,
  medium: 1.2,
  low: 1.0
}

// Final score
const totalScore = (
  distanceScore * 0.3 +
  ratingScore * 0.25 +
  priorityScore * 0.2 +
  experienceScore * 0.15 +
  recencyScore * 0.1
) * priorityMultiplier
```

## 🎯 **Features Implemented**

- ✅ **Priority-Based Dispatch**: Complete priority system
- ✅ **Uber-Style Matching**: Intelligent driver assignment
- ✅ **Real-Time Updates**: Live status tracking
- ✅ **Customer Interface**: Professional request form
- ✅ **Request Tracking**: Real-time tracking with maps
- ✅ **Driver Management**: Complete status system
- ✅ **Notification System**: Real-time alerts
- ✅ **Authentication**: Integrated user management
- ✅ **Mobile Ready**: Responsive design
- ✅ **Professional UI**: Modern, clean interface

## 📱 **Mobile App Ready**

The system is perfectly prepared for native app development:
- Responsive design
- Token-based authentication
- Role-based dashboards
- Mobile-optimized interface
- Real-time updates

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 **Acknowledgments**

- Built with Next.js and React
- Inspired by Uber's dispatch system
- Professional UI/UX design
- Mobile-first approach

## 📞 **Support**

For support and questions:
- Create an issue on GitHub
- Contact: support@towops.com

---

**🚛 TowOps Professional - Ready for Production!** ✨