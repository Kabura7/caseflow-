
import { BrowserRouter,  Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/authpage/Login";
import { SignUp } from "./pages/authpage/SignUp";
import { Layout } from "./pages/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ForgotPasswordPage } from "./pages/authpage/ForgotPassword";
import { PublicRoute } from "./components/PublicRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LawyerDashboard } from "./pages/dashboard/lawyer/LawyerDashboard";
import { ClientDashboard } from "./pages/dashboard/client/ClientDashboard";
import { ReportCasePage } from "./pages/dashboard/client/ReportCasePage";
import { ActiveCasesPage } from "./pages/dashboard/client/ActiveCasesPage";
import { FindLawyerPage } from "./pages/dashboard/client/FindLawyerPage";
import { AvailableCasesPage } from "./pages/dashboard/lawyer/AvailableCasesPage";
import { AssignedCasesPage } from "./pages/dashboard/lawyer/AssignedCasePage";
import { CalendarPage } from "./pages/dashboard/lawyer/CalendarPage";

const queryClient = new QueryClient();

// Component to handle catch-all routes
const NotFoundRedirect = () => {
  const { isAuthenticated, userRoles } = useAuth();
  if (isAuthenticated && userRoles.length > 0) {
    // If authenticated, redirect to their dashboard
    const defaultRoute = userRoles.includes("lawyer") ? "/lawyer" : "/client";
    return <Navigate to={defaultRoute} replace />;
  }
  // If not authenticated, redirect to signup
  return <Navigate to="/signup" replace />;
};

export function App() {
  return <QueryClientProvider client={queryClient}>
    <BrowserRouter>
          <AuthProvider>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/services" element={<PublicRoute><Services /></PublicRoute>} />
              <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
            </Route>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

            {/* protected routes */}
            <Route
              path="/client"
              element={
                <ProtectedRoute allowedRoles={["client"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<ReportCasePage />} />
              <Route path="cases" element={<ActiveCasesPage />} />
              <Route path="report" element={<ReportCasePage />} />
              <Route path="find-lawyer" element={<FindLawyerPage />} />
            </Route>
            <Route
              path="/lawyer"
              element={
                <ProtectedRoute allowedRoles={["lawyer"]}>
                  <LawyerDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AvailableCasesPage />} />
              <Route path="available-case" element={<AvailableCasesPage />} />
              <Route path="assigned-case" element={<AssignedCasesPage />} />
              <Route path="calendar" element={<CalendarPage />} />
            </Route>

            <Route path="*" element={<NotFoundRedirect/>}/>
          </Routes>
        </AuthProvider>
    </BrowserRouter>;
  </QueryClientProvider>
}