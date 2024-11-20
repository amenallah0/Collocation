import { Routes as RouterRoutes, Route } from 'react-router-dom';
import HousingList from './pages/housing/HousingList';
import HousingDetail from './pages/housing/HousingDetail';
import HousingForm from './pages/housing/HousingForm';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Profile from './pages/user/Profile';
import PrivateRoute from './components/PrivateRoute';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<HousingList />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/housing/create"
        element={
          <PrivateRoute>
            <HousingForm />
          </PrivateRoute>
        }
      />
      <Route path="/housing/:id" element={<HousingDetail />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </RouterRoutes>
  );
};

export default Routes;