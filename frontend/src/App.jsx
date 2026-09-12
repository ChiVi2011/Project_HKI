import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Intro from "./pages/intro";
import News from "./pages/news";
import NewsDetail from "./pages/news-detail";
import ProductList from "./pages/product-list";
import ProductDetail from "./pages/product-detail";
import CategoryShowcase from "./pages/category-showcase";
import Profile from "./pages/profile";
import AdminDashboard from "./pages/admin";
import Header from "./components/header";
import Footer from "./components/footer";
import ChatBox from "./components/chat-box";
import CartDrawer from "./components/cart-drawer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import ForgotPass from "./pages/forgot-passwork";
import Order from "./pages/Order-Items";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  const location = useLocation();
  const hiddenHearderRouter = [
    "/login",
    "/forgotPass",
    "/signup",
    "/SignUp",
    "/order",
    "/admin",
  ];
  const isHidden = hiddenHearderRouter.includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="container-fluid">
          {!isHidden && <Header />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<Intro />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/categories" element={<CategoryShowcase />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/forgotPass" element={<ForgotPass />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/order" element={<Order />} />
            </Route>
          </Routes>
          {!isHidden && <Footer />}
          {!isHidden && <ChatBox />}
          {!isHidden && <CartDrawer />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
