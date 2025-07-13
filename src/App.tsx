// src/App.tsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store";
import { theme } from "./theme/theme";
import { useAppDispatch, useAppSelector } from "./hooks/useAuth";
import { loadUserFromStorage } from "./store/authSlice";

// Pages
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import FriendsPage from "./pages/FriendsPage";
import PortfolioPage from "./pages/PortfolioPage";
import SyndicatePage from "./pages/SyndicatePage";

// Components
import Layout from "./components/common/Layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Scroll and Zoom Reset Component
const ScrollAndZoomReset: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.zoom = "100%";
  }, [location.pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <ScrollAndZoomReset />
      <Routes>
        <Route
          path="/auth"
          element={
            !isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="syndicate" element={<SyndicatePage />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />}
        />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
