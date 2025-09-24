

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import ExpensePage from './pages/ExpensePage';
import { SettingsProvider } from './context/SettingsContext';
import SettlementsPage from './pages/SettlementsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/ui';

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#051027]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <SettingsProvider>
      <HashRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <Layout><GroupsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups/:groupId/expenses/new"
            element={
              <ProtectedRoute>
                <Layout><ExpensePage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses/:expenseId/edit"
            element={
              <ProtectedRoute>
                <Layout><ExpensePage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settlements"
            element={
              <ProtectedRoute>
                <Layout><SettlementsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout><ProfilePage /></Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </SettingsProvider>
  );
};

export default App;