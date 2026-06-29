import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import ProgramsPage from '../Pages/ProgramsPage';
import BlogPage from '../Pages/BlogPage';
import BlogDetailPage from '../Pages/BlogDetailPage';
import MembersPage from '../Pages/MembersPage';
import './App.css';

function ProtectedRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/programs" element={
                <ProtectedRoute>
                    <ProgramsPage />
                </ProtectedRoute>
            } />
            <Route path="/blogs" element={
                <ProtectedRoute>
                    <BlogPage />
                </ProtectedRoute>
            } />
            <Route path="/blogs/:id" element={
                <ProtectedRoute>
                    <BlogDetailPage />
                </ProtectedRoute>
            } />
            <Route path="/members" element={
                <ProtectedRoute>
                    <MembersPage />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
