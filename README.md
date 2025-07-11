# StudAI Frontend - AI-Powered Quiz Generator

![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.0.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This repository contains the **frontend application** for the StudAI project, a modern React-based web application that provides an intuitive interface for AI-powered quiz generation and management. The frontend seamlessly integrates with the [StudAI Backend](https://github.com/jhonatademuner/studai) and the [StudAI Assistant](https://github.com/kenzokomati/studai-assistant) to deliver a complete learning experience.

## ✨ Key Features
- **AI Quiz Generation** - Create quizzes from topics, YouTube videos, or PDF documents
- **Interactive Quiz Experience** - Real-time quiz taking with hints and progress tracking
- **User Authentication** - Secure login/register with JWT token management
- **Progress Analytics** - Detailed results with performance insights and recommendations
- **Shareable Quizzes** - Generate shareable links for guest quiz participation
- **Responsive Design** - Modern UI built with Tailwind CSS and DaisyUI
- **Export Capabilities** - Download quiz results in various formats

## 🚀 Technology Stack
- **React 19.1.0** - Modern UI framework with hooks
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.0.0** - Fast build tool and development server
- **Axios** - HTTP client for API communication

## 📂 Project Structure
```plaintext
studai-frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.tsx       # Navigation header
│   │   └── Layout.tsx       # Page layout wrapper
│   ├── lib/                 # Utility libraries
│   │   └── axios.ts         # API client configuration
│   ├── pages/               # Application pages
│   │   ├── Auth.tsx         # Login/Register forms
│   │   ├── Home.tsx         # Quiz generation dashboard
│   │   ├── QuizPage.tsx     # Interactive quiz interface
│   │   ├── QuizResults.tsx  # Results and analytics
│   │   ├── QuizList.tsx     # Quiz management
│   │   ├── QuizDetails.tsx  # Quiz information
│   │   ├── Account.tsx      # User settings
│   │   └── LandingPage.tsx  # Public landing page
│   ├── types/               # TypeScript type definitions
│   │   ├── quiz.ts          # Quiz-related types
│   │   ├── login-request.ts # Authentication types
│   │   └── register-request.ts
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── Dockerfile               # Container configuration
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn package manager

### Local Setup

#### 1. Clone the repository:
```bash
git clone https://github.com/JP-76/studai-frontend
cd studai-frontend
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Configure environment variables:
Create a `.env` file in the project root:
```env
# Base URL for the backend API
VITE_API_URL=http://localhost:5000
```

#### 4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🌐 Application Features

### Quiz Generation
- **Topic-based quizzes** - Generate quizzes from any subject or topic
- **YouTube video quizzes** - Extract content from YouTube videos for quiz creation
- **PDF document processing** - Upload PDF files (up to 25 pages) for quiz generation
- **Customizable settings** - Configure question quantity and language preferences

### Quiz Experience
- **Interactive interface** - Real-time quiz taking with progress indicators
- **Hint system** - Access helpful hints during quiz completion
- **Time tracking** - Monitor completion time for performance analysis
- **Guest mode** - Share quizzes with non-registered users

### User Management
- **Secure authentication** - JWT-based login/register system
- **Profile management** - Update account settings and preferences
- **Session management** - Automatic token refresh and validation

### Analytics & Results
- **Performance insights** - Detailed scoring and time analysis
- **Progress tracking** - Historical attempt data and improvement trends
- **Export functionality** - Download results in CSV/XLSX formats
- **Recommendations** - Personalized study suggestions based on performance

## 🔧 Configuration

### Environment Variables
```env
# Backend API URL (required)
VITE_API_URL=http://localhost:5000
```

## 🐳 Docker Deployment

Build and run with Docker:
```bash
# Build the image
docker build -t studai-frontend .

# Run the container
docker run -p 3000:80 studai-frontend
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [StudAI Backend](https://github.com/jhoonatademuner/studai) - RESTful API service
- [StudAI Assistant](https://github.com/kenzokomati/studai-assistant) - AI microservice for quiz generation


