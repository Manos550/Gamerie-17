import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import AuthForm from './components/auth/AuthForm';
import ResetPassword from './components/auth/ResetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserProfile from './components/profile/UserProfile';
import NewsFeed from './components/feed/NewsFeed';
import TeamsList from './components/teams/TeamsList';
import TeamCreate from './components/teams/TeamCreate';
import TeamProfile from './components/teams/TeamProfile';
import GamePage from './components/games/GamePage';
import NotificationsPage from './components/notifications/NotificationsPage';
import UsersList from './components/users/UsersList';
import GamesList from './components/games/GamesList';
import Calendar from './components/calendar/Calendar';
import TournamentsList from './components/tournaments/TournamentsList';
import GameSearch from './components/search/GameSearch';
import AdminDashboard from './components/moderation/AdminDashboard';
import LandingPage from './components/landing/LandingPage';
import LeaderboardPage from './components/leaderboard/LeaderboardPage';
import { isFirebaseInitialized } from './lib/firebase';
import { initializeAuth } from './lib/auth';
import { useAuthStore } from './lib/store';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Firebase Authentication listener only if Firebase is initialized
if (isFirebaseInitialized) {
  initializeAuth();
}

const queryClient = new QueryClient();

export default function App() {
  const { user } = useAuthStore();

  if (!isFirebaseInitialized) {
    return (
      <div className="min-h-screen bg-gaming-dark text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gaming-card p-8 rounded-lg border border-gaming-neon/20 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Welcome to Gamerie</h1>
          <p className="text-gray-400 mb-6">
            The application is running in demo mode. To enable full functionality, please configure Firebase credentials in your environment variables.
          </p>
          <div className="bg-gaming-dark/50 p-4 rounded-lg text-left">
            <p className="text-sm text-gaming-neon mb-2">Required Environment Variables:</p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>VITE_FIREBASE_API_KEY</li>
              <li>VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>VITE_FIREBASE_PROJECT_ID</li>
              <li>VITE_FIREBASE_STORAGE_BUCKET</li>
              <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>VITE_FIREBASE_APP_ID</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gaming-dark">
          {/* Only show header and sidebar if not on landing page */}
          {user && (
            <>
              <Header />
              <Sidebar />
            </>
          )}
          
          <main className={user ? "pl-[70px] pt-16" : ""}>
            <div className="max-w-[1600px] mx-auto px-6 py-8">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/feed" />} />
                <Route path="/login" element={<AuthForm mode="login" />} />
                <Route path="/register" element={<AuthForm mode="register" />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected routes */}
                <Route path="/feed" element={<ProtectedRoute><NewsFeed /></ProtectedRoute>} />
                <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/teams" element={<ProtectedRoute><TeamsList /></ProtectedRoute>} />
                <Route path="/teams/create" element={<ProtectedRoute><TeamCreate /></ProtectedRoute>} />
                <Route path="/teams/:teamId" element={<ProtectedRoute><TeamProfile /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
                <Route path="/games" element={<ProtectedRoute><GamesList /></ProtectedRoute>} />
                <Route path="/games/:gameId" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/tournaments" element={<ProtectedRoute><TournamentsList /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><GameSearch /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />

                {/* Redirect all other routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}