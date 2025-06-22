
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./hooks/use-cart";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/layout/Layout";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import StorePage from "./pages/StorePage";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AdminPage from "./pages/AdminPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RequireAuth from "./components/auth/RequireAuth";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AuthPage from "./components/auth/AuthPage";

const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index/>} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/account" element={
                <RequireAuth>
                  <AccountPage />
                </RequireAuth>
              } />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Layout>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
