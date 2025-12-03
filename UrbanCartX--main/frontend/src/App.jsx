// src/App.jsx
import React from "react";
import "./App.css";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Nav from "./components/Nav";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Collections from "./pages/Collections";
import Product from "./pages/Product";
import { useContext } from "react";
import { UserDataContext } from "./context/UserContext";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Ai from "./components/Ai";
import BecomeaSeller from "./pages/BecomeaSeller";

function App() {
  const location = useLocation();
  let {userData} = useContext(UserDataContext);

  // Sirf login & register page par navbar hide karna hai
  const hideNav =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNav && <Nav />}
      <Ai />

      <Routes>
         <Route path="/login" 
         element={
         userData ? (<Navigate to={location.state?.from || "/"}/>) : (<Login />)} />
        <Route path="/register" element=
        {userData ? (<Navigate to={location.state?.from || "/"}/>) : (<Registration />)} />
        <Route path="/" element=
        {userData ? <Home/> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />   
        <Route path="/collections" element=
        {userData ? <Collections /> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />
        <Route path="/product" element={userData ? <Product /> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />
        <Route path="/about" element={userData ? <About /> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />
        <Route path="/contact" element={userData ? <Contact /> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />
        <Route path="/productdetail/:id" element={userData ? <ProductDetails /> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />
        <Route path="/cart" element={userData ? <Cart /> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />
        <Route path="/checkout" element={userData ? <Checkout /> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />
        <Route path="/order-success" element={userData ? <OrderSuccess /> : <Navigate to="/login" state ={{ from: location.pathname }} /> } />
        <Route path="/orders" element={userData ? <Orders /> : <Navigate to="/login" state={{ from: location.pathname }} />} />
        <Route path="/orders/:id" element={userData ? <OrderDetails /> : <Navigate to="/login" state={{ from: location.pathname }} />} />
        <Route path="/become-seller" element={userData ? <BecomeaSeller /> : <Navigate to="/login" state={{ from: location.pathname }} />} />
      </Routes>
    </>
  );
}

export default App;
