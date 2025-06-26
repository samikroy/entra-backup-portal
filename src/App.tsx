
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Tenants from "./pages/Tenants";
import Backups from "./pages/Backups";
import Restore from "./pages/Restore";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TenantAdmin from "./pages/TenantAdmin";
import { MetricsProvider } from "./contexts/MetricsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <MetricsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tenants"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Tenants />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Backups />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restore"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Restore />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              /> */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TenantAdmin />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </MetricsProvider>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
