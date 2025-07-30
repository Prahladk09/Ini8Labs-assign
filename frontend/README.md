# Document Management Frontend

A modern React application for managing healthcare documents with authentication, file upload/download, and a clean user interface.

## 🚀 Features

### Authentication
- **User Registration**: Create new accounts with email validation
- **User Login**: Secure authentication with JWT tokens
- **Password Security**: Encrypted passwords with bcrypt
- **Session Management**: Persistent login state with Zustand

### Document Management
- **PDF Upload**: Drag & drop or click to upload PDF files
- **Progress Tracking**: Real-time upload progress indicators
- **File Validation**: Size limits (10MB) and type restrictions (PDF only)
- **Document Table**: Sortable table with latest documents first
- **Download & Delete**: Secure document operations
- **Patient Filtering**: Filter documents by patient ID

### User Interface
- **Modern Design**: Clean, responsive interface with SCSS styling
- **Mobile Responsive**: Works on all device sizes
- **Loading States**: Smooth loading indicators and animations
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Clear success notifications

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── documents/      # Document management components
│   └── layout/         # Layout components (Navbar, etc.)
├── pages/              # Page-level components
├── stores/             # Zustand state management
├── styles/             # SCSS stylesheets
├── services/           # API services (future)
├── hooks/              # Custom React hooks (future)
└── utils/              # Utility functions (future)
```

### State Management
- **Zustand**: Lightweight state management
- **Auth Store**: User authentication and session data
- **Document Store**: Document CRUD operations and UI state

### Styling
- **SCSS**: Advanced CSS with variables and mixins
- **Modular CSS**: Component-specific stylesheets
- **Responsive Design**: Mobile-first approach
- **Design System**: Consistent colors, spacing, and typography

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Zustand**: State management
- **SCSS**: Advanced styling
- **Vite**: Fast build tool
- **Material-UI Icons**: Icon library

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://127.0.0.1:8000
```

### Backend Connection
The frontend connects to the FastAPI backend running on port 8000. Make sure the backend is running before using the frontend.

## 🎨 Design System

### Colors
- **Primary**: #2196f3 (Blue)
- **Secondary**: #f50057 (Pink)
- **Success**: #4caf50 (Green)
- **Warning**: #ff9800 (Orange)
- **Error**: #f44336 (Red)

### Typography
- **Font Family**: Roboto, Helvetica, Arial
- **Font Sizes**: 12px, 14px, 16px, 18px, 20px, 24px

### Spacing
- **Base Unit**: 4px
- **Spacing Scale**: 4px, 8px, 16px, 24px, 32px, 48px

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Encryption**: bcrypt hashing
- **Input Validation**: Client and server-side validation
- **File Type Restrictions**: PDF files only
- **File Size Limits**: 10MB maximum

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Getting Started

1. **Start Backend**: Ensure the FastAPI backend is running on port 8000
2. **Start Frontend**: Run `npm run dev` to start the development server
3. **Access Application**: Open http://localhost:3000 in your browser
4. **Create Account**: Sign up with a new account or use existing credentials
5. **Upload Documents**: Use the upload button to add PDF documents
6. **Manage Documents**: View, download, and delete documents from the table

## 🔄 Development Workflow

1. **Component Development**: Create new components in the appropriate folder
2. **State Management**: Add new stores or update existing ones
3. **Styling**: Use SCSS variables and follow the design system
4. **Testing**: Test on different screen sizes and browsers
5. **Build**: Run `npm run build` to create production build

## 📝 API Endpoints

The frontend communicates with these backend endpoints:
- `POST /signup` - User registration
- `POST /login` - User authentication
- `GET /documents` - List documents
- `POST /documents/upload` - Upload document
- `GET /documents/{id}/download` - Download document
- `DELETE /documents/{id}` - Delete document

## 🎯 Future Enhancements

- [ ] Document search and filtering
- [ ] Bulk operations (upload, delete)
- [ ] Document preview
- [ ] User roles and permissions
- [ ] Audit logging
- [ ] Offline support
- [ ] PWA features
- [ ] Advanced analytics 