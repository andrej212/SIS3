import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import ProgramsPage from '../Pages/ProgramsPage';
import ProgramDetailPage from '../Pages/ProgramDetailPage';
import BlogPage from '../Pages/BlogPage';
import BlogDetailPage from '../Pages/BlogDetailPage';
import MembersPage from '../Pages/MembersPage';
import ForumPage from '../Pages/ForumPage';
import ForumThreadPage from '../Pages/ForumThreadPage';
import './App.css';

function ProtectedRoute({ children }) {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
}

function StaffRoute({ children }) {
    const { token, user } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    if (user?.role !== 'admin' && user?.role !== 'employee') return <Navigate to="/programs" replace />;
    return children;
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
            <Route path="/programs/:id" element={
                <ProtectedRoute>
                    <ProgramDetailPage />
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
                <StaffRoute>
                    <MembersPage />
                </StaffRoute>
            } />
            <Route path="/forum" element={
                <ProtectedRoute>
                    <ForumPage />
                </ProtectedRoute>
            } />
            <Route path="/forum/:id" element={
                <ProtectedRoute>
                    <ForumThreadPage />
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
