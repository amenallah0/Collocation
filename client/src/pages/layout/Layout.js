import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Login from '../auth/Login';
import Register from '../auth/Register';
import HousingList from '../housing/HousingList';
import HousingDetail from '../housing/HousingDetail';
import HousingForm from '../housing/HousingForm';
import Profile from '../user/Profile';
import Messages from '../user/Messages';

const Layout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1">
        <Routes>
          <Route path="/" element={<HousingList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/housing/:id" element={<HousingDetail />} />
          <Route path="/create-listing" element={<HousingForm />} />
          <Route path="/edit-listing/:id" element={<HousingForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;