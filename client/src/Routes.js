import { Routes as RouterRoutes, Route } from 'react-router-dom';
import HousingList from './pages/housing/HousingList';
import HousingDetail from './pages/housing/HousingDetail';
import HousingForm from './pages/housing/HousingForm';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Profile from './pages/user/Profile';
import PrivateRoute from './components/PrivateRoute';
import AboutUs from './components/AboutUs';
import Careers from './components/Careers';
import Team from './components/Team';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Help from './components/HelpCenter';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<HousingList />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/team" element={<Team />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/help" element={<Help />} />
      <Route
        path="/housing/create"
        element={
          <PrivateRoute>
            <HousingForm />
          </PrivateRoute>
        }
      />
      <Route path="/housings/:id" element={<HousingDetail />} />
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