import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import NewProduct from "./pages/NewProduct";
import Orders from "./pages/Orders";
import NewOrder from "./pages/NewOrder";
import OrderDetails from "./pages/OrderDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<NewProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<NewOrder />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}