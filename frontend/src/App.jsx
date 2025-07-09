// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import ProtectedRoute from './components/protectedRoute';
import Dashboard from './components/DashboardPage';
import Login from './components/login';
import Register from './components/register';
import ThreatInstancesTable from './components/ThreatInstancesTable';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
              <ThreatInstancesTable/>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;