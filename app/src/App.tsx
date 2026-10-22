import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Search from './pages/Search';
import StoreDetail from './pages/StoreDetail';
import StoreList from './pages/StoreList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="buscar" element={<Search />} />
          <Route path="restaurantes" element={<StoreList />} />
          <Route path="tiendas" element={<StoreList />} />
          <Route path="tiendas/:tipo" element={<StoreList />} />
          <Route path="tienda/:slug" element={<StoreDetail />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="mis-pedidos" element={<Orders />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
