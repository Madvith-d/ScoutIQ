# ScoutIQ Frontend

A modern, responsive React application for AI-powered resume analysis. Built with React, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

### Core Functionality
- **Resume Upload & Analysis**: Upload DOCX and TXT files for AI-powered analysis
- **Job Description Matching**: Compare resumes against job descriptions
- **Analysis History**: Track all previous analyses with detailed results
- **Real-time Feedback**: Get instant scores and improvement recommendations
- **User Authentication**: Secure Firebase-based authentication

### UI/UX Features
- **Modern Dashboard**: Clean, intuitive interface with tabbed navigation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support**: Built-in dark/light theme switching
- **Real-time Updates**: Live progress indicators and status updates
- **Toast Notifications**: User-friendly feedback for all actions

### Technical Features
- **Component Library**: Built with shadcn/ui for consistent design
- **Type Safety**: Full TypeScript support (can be enabled)
- **API Integration**: Centralized API service with error handling
- **Authentication**: Firebase Auth integration with token management
- **File Validation**: Client-side file type and size validation

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **React Toastify** - Toast notifications
- **Firebase** - Authentication and backend services

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ScoutIQ/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── textarea.jsx
│   │       ├── badge.jsx
│   │       ├── progress.jsx
│   │       └── tabs.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx   # Main dashboard
│   │   ├── LandingPage.jsx     # Landing page
│   │   ├── LoginPage.jsx       # Login form
│   │   ├── SignUpPage.jsx      # Sign up form
│   │   └── HomePage.jsx        # Home page
│   ├── services/
│   │   └── api.js             # API service layer
│   ├── lib/
│   │   └── utils.js           # Utility functions
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # App entry point
│   ├── index.css              # Global styles
│   └── firebase.js            # Firebase configuration
├── public/                    # Static assets
├── package.json
├── tailwind.config.js         # Tailwind configuration
└── vite.config.js            # Vite configuration
```

## 🎨 Design System

The application uses a comprehensive design system built on shadcn/ui:

### Colors
- **Primary**: Blue (#3B82F6) - Main brand color
- **Secondary**: Gray (#6B7280) - Supporting elements
- **Success**: Green (#10B981) - Positive actions
- **Warning**: Yellow (#F59E0B) - Caution states
- **Error**: Red (#EF4444) - Error states

### Components
- **Cards**: Content containers with shadows and borders
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Inputs**: Form controls with focus states
- **Badges**: Status indicators and labels
- **Progress**: Loading and progress indicators
- **Tabs**: Content organization

## 🔧 Configuration

### Tailwind CSS
The Tailwind configuration includes:
- Custom color palette
- Dark mode support
- Custom animations
- Responsive breakpoints
- Component-specific utilities

### shadcn/ui
All components are configured with:
- Consistent styling
- Accessibility features
- Dark mode compatibility
- Responsive design
- TypeScript support (optional)

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔐 Authentication

Firebase Authentication is used for:
- Email/password sign up and login
- Token-based API authentication
- Automatic token refresh
- Secure logout functionality

## 📊 API Integration

The API service layer provides:
- Centralized API calls
- Automatic authentication
- Error handling
- Request/response interceptors
- Timeout management

### Available Endpoints
- `POST /api/resume/analyze` - Upload and analyze resume
- `GET /api/resume/history` - Get analysis history
- `GET /api/resume/:id` - Get specific analysis
- `GET /api/auth/verify` - Verify authentication token

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_FIREBASE_API_KEY=your_production_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_domain
VITE_FIREBASE_PROJECT_ID=your_production_project_id
```

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration included
- Prettier formatting (recommended)
- Component-based architecture
- Consistent naming conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

Built with ❤️ using modern web technologies
