# SheBuilds - Community Support Platform

A comprehensive community management platform that empowers residential communities with AI-driven support and seamless issue management. Built with modern web technologies, SheBuilds provides a professional solution for managing community issues, announcements, events, and resident communication.

## 🌟 Features

### For Residents
- **Issue Reporting**: Easy-to-use interface for reporting maintenance, security, and other community issues
- **Issue Tracking**: Real-time status updates and progress tracking for submitted issues
- **Community Hub**: Access to announcements, events, and community updates
- **Profile Management**: Personal settings, notification preferences, and account management
- **Mobile Responsive**: Works seamlessly on all devices

### For Administrators
- **Dashboard Analytics**: Comprehensive insights into community issues and performance metrics
- **Issue Management**: Advanced filtering, status updates, and assignment capabilities
- **Resident Management**: Complete resident database with status tracking and communication tools
- **Announcement System**: Create and manage community-wide announcements
- **Event Management**: Organize and track community events
- **Reporting**: Generate detailed reports and analytics

### Core Features
- **Real-time Notifications**: Instant updates for issue status changes and announcements
- **Multi-role Authentication**: Secure login system for residents and administrators
- **Advanced Analytics**: Data-driven insights for community improvement
- **Responsive Design**: Modern, accessible interface that works on all devices
- **Security**: Enterprise-grade security with JWT authentication

## 🚀 Technology Stack

### Frontend
- **Next.js 13+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Modern state management
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure

```
SheBulds/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── issueController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Issue.js
│   │   │   ├── Notification.js
│   │   │   ├── Announcement.js
│   │   │   └── Event.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── issueRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── readme
├── frontend/
│   ├── components/
│   │   └── Navbar.tsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── dashboard.tsx
│   │   │   ├── analytics.tsx
│   │   │   ├── residents.tsx
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── resident/
│   │   │   ├── dashboard.tsx
│   │   │   ├── community.tsx
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── profile.tsx
│   │   ├── about.tsx
│   │   ├── contact.tsx
│   │   └── index.tsx
│   ├── utils/
│   │   └── api.ts
│   ├── styles/
│   │   └── globals.css
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/shebuilds
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🎯 Key Features Explained

### 1. Issue Management System
- **Residents** can report issues with categories (maintenance, security, noise, etc.)
- **Admins** can update status, assign tasks, and add notes
- **Real-time tracking** of issue progress
- **Priority levels** (low, medium, high, urgent)

### 2. Analytics Dashboard
- **Issue statistics** and trends
- **Category breakdown** charts
- **Monthly trends** visualization
- **Performance metrics** (resolution rate, response time)
- **Top residents** by issue count

### 3. Community Features
- **Announcements**: Admin-created community updates
- **Events**: Community event management with RSVP
- **Member Directory**: Resident profiles and communication
- **Notifications**: Real-time updates and alerts

### 4. Resident Management
- **Complete resident database** with status tracking
- **Search and filter** capabilities
- **Status management** (active, inactive, suspended)
- **Communication tools** for admins

### 5. Profile & Settings
- **Personal information** management
- **Notification preferences** (email, push, SMS)
- **Security settings** (password change, account deletion)
- **Theme and language** preferences

## 🔐 Authentication & Security

### User Roles
- **Resident**: Can report issues, view announcements, participate in events
- **Admin**: Full access to all features including analytics and resident management

### Security Features
- **JWT-based authentication** with secure token storage
- **Password hashing** using bcryptjs
- **Role-based access control** (RBAC)
- **Input validation** and sanitization
- **CORS protection** for API endpoints

## 📊 Database Models

### User Model
- Basic information (name, email, password)
- Role-based access (resident/admin)
- Account status and preferences

### Issue Model
- Issue details (title, description, category)
- Status tracking (pending, in-progress, resolved, rejected)
- Priority levels and assignment
- Admin notes and resolution tracking

### Notification Model
- Real-time notifications for users
- Different types (issue updates, announcements, events)
- Priority levels and expiration dates

### Announcement Model
- Community-wide announcements
- Target audience filtering
- Attachment support and read tracking

### Event Model
- Community event management
- RSVP functionality
- Recurring event support

## 🎨 UI/UX Features

### Design System
- **Consistent color scheme** (Indigo primary, Orange for admin)
- **Modern typography** with clear hierarchy
- **Responsive grid system** for all screen sizes
- **Interactive elements** with hover states and transitions

### User Experience
- **Intuitive navigation** with role-based menus
- **Loading states** and error handling
- **Form validation** with helpful error messages
- **Accessibility features** (ARIA labels, keyboard navigation)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (local or cloud)
2. Configure environment variables
3. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting service
3. Configure environment variables for production

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Issues
- `GET /api/issues` - Get all issues (admin)
- `POST /api/issues` - Create new issue (resident)
- `GET /api/issues/my-issues` - Get user's issues (resident)
- `PUT /api/issues/:id` - Update issue status (admin)
- `GET /api/issues/stats` - Get issue statistics (admin)

### Health Check
- `GET /api/health` - Server status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: hello@shebuilds.com
- Phone: +1 (555) 123-4567
- Documentation: [Link to documentation]

## 🎉 Acknowledgments

- Built with Next.js and Express.js
- Styled with Tailwind CSS
- Icons from Heroicons
- Community-driven development approach

---

**SheBuilds** - Empowering communities through technology and innovation. 