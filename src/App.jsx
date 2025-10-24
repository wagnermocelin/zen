import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContextAPI';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Workouts from './pages/Workouts';
import Measurements from './pages/Measurements';
import Schedules from './pages/Schedules';
import Diets from './pages/Diets';
import Payments from './pages/Payments';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentWorkouts from './pages/student/StudentWorkouts';
import StudentMeasurements from './pages/student/StudentMeasurements';
import StudentSchedule from './pages/student/StudentSchedule';
import StudentDiet from './pages/student/StudentDiet';
import StudentPayments from './pages/student/StudentPayments';
import Admin from './pages/Admin';

// Protected Route Component
const ProtectedRoute = ({ children, requireTrainer = false, requireStudent = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireTrainer && user.role !== 'trainer' && user.role !== 'professional') {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (requireStudent && user.role !== 'student') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'trainer' || user.role === 'professional' ? '/dashboard' : '/student/dashboard'} replace /> : <Login />} />
      
      {/* Trainer Routes */}
      <Route path="/dashboard" element={<ProtectedRoute requireTrainer><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute requireTrainer><Layout><Students /></Layout></ProtectedRoute>} />
      <Route path="/workouts" element={<ProtectedRoute requireTrainer><Layout><Workouts /></Layout></ProtectedRoute>} />
      <Route path="/measurements" element={<ProtectedRoute requireTrainer><Layout><Measurements /></Layout></ProtectedRoute>} />
      <Route path="/schedules" element={<ProtectedRoute requireTrainer><Layout><Schedules /></Layout></ProtectedRoute>} />
      <Route path="/diets" element={<ProtectedRoute requireTrainer><Layout><Diets /></Layout></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute requireTrainer><Layout><Payments /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireTrainer><Layout><Admin /></Layout></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute requireStudent><Layout><StudentDashboard /></Layout></ProtectedRoute>} />
      <Route path="/student/workouts" element={<ProtectedRoute requireStudent><Layout><StudentWorkouts /></Layout></ProtectedRoute>} />
      <Route path="/student/measurements" element={<ProtectedRoute requireStudent><Layout><StudentMeasurements /></Layout></ProtectedRoute>} />
      <Route path="/student/schedule" element={<ProtectedRoute requireStudent><Layout><StudentSchedule /></Layout></ProtectedRoute>} />
      <Route path="/student/diet" element={<ProtectedRoute requireStudent><Layout><StudentDiet /></Layout></ProtectedRoute>} />
      <Route path="/student/payments" element={<ProtectedRoute requireStudent><Layout><StudentPayments /></Layout></ProtectedRoute>} />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
