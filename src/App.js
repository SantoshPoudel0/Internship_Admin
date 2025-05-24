import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TrainingsList from './pages/trainings/TrainingsList';
import TrainingForm from './pages/trainings/TrainingForm';
import BookingsList from './pages/bookings/BookingsList';
import ContactsList from './pages/contacts/ContactsList';
import ContactDetails from './pages/contacts/ContactDetails';
import UsersList from './pages/users/UsersList';
import UserForm from './pages/users/UserForm';
import MenuItemsList from './pages/menu/MenuItemsList';
import MenuItemForm from './pages/menu/MenuItemForm';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

function Layout() {
  return (
    <Container fluid className="p-0">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trainings" element={<TrainingsList />} />
          <Route path="/trainings/new" element={<TrainingForm />} />
          <Route path="/trainings/edit/:id" element={<TrainingForm />} />
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/contacts" element={<ContactsList />} />
          <Route path="/contacts/:id" element={<ContactDetails />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />
          <Route path="/menu-items" element={<MenuItemsList />} />
          <Route path="/menu-items/new" element={<MenuItemForm />} />
          <Route path="/menu-items/edit/:id" element={<MenuItemForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Container>
  );
}

export default App; 