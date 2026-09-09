import { Navigate, Route, Routes } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "../provider/AuthProvider.jsx";
import { AppLayout } from "../layouts/AppLayout.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { OverviewPage } from "../pages/OverviewPage.jsx";
import { LeadsPage } from "../pages/LeadsPage.jsx";
import { RepliedPage } from "../pages/RepliedPage.jsx";
import { OrdersPage } from "../pages/OrdersPage.jsx";
import { CustomersPage } from "../pages/CustomersPage.jsx";
import { ProductsPage } from "../pages/ProductsPage.jsx";
import { ComplaintsPage } from "../pages/ComplaintsPage.jsx";
import { SettingsPage } from "../pages/SettingsPage.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/replied" element={<RepliedPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
