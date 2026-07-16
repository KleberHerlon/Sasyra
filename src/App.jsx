import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';

// For now, we will use a simple routing setup without enforcing AuthContext.
// Later, this can be wrapped in a PrivateRoute if supabase token is missing.
export default function App() {
  return (
    <BrowserRouter basename="/Sasyra">
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Redirect root to login to ensure they see the restricted screen first */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
