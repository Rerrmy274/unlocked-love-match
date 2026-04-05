import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignUpPage } from "@/pages/auth/SignUpPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { DiscoveryPage } from "@/pages/app/DiscoveryPage";
import { ChatPage } from "@/pages/app/ChatPage";
import { ProfilePage } from "@/pages/app/ProfilePage";
import { AdminPage } from "@/pages/app/AdminPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Spinner } from "@/components/ui/spinner";
import { AnimatePresence } from "framer-motion";

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="size-12 text-violet-600" />
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Unlocked Love</h2>
            <p className="text-violet-600 font-medium animate-pulse">Nairobi's Free Dating Revolution</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-violet-100 selection:text-violet-900 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20 overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/discovery" replace /> : <LoginPage />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/discovery" replace /> : <SignUpPage />} 
            />
            <Route 
              path="/forgot-password" 
              element={<ForgotPasswordPage />} 
            />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/discovery" element={<DiscoveryPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-center" expand={true} richColors closeButton />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;