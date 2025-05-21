import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ServicesList from './pages/services/ServicesList';
import ServiceForm from './pages/services/ServiceForm';
import TrainingsList from './pages/trainings/TrainingsList';
import TrainingForm from './pages/trainings/TrainingForm';
import BookingsList from './pages/bookings/BookingsList';
import ReviewsList from './pages/reviews/ReviewsList';
import ReviewDetails from './pages/reviews/ReviewDetails';
import ContactsList from './pages/contacts/ContactsList';
import ContactDetails from './pages/contacts/ContactDetails';
import UsersList from './pages/users/UsersList';
import UserForm from './pages/users/UserForm';
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
    <Container fluid>
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10} className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/services" element={<ServicesList />} />
            <Route path="/services/new" element={<ServiceForm />} />
            <Route path="/services/edit/:id" element={<ServiceForm />} />
            <Route path="/trainings" element={<TrainingsList />} />
            <Route path="/trainings/new" element={<TrainingForm />} />
            <Route path="/trainings/edit/:id" element={<TrainingForm />} />
            <Route path="/bookings" element={<BookingsList />} />
            <Route path="/reviews" element={<ReviewsList />} />
            <Route path="/reviews/:id" element={<ReviewDetails />} />
            <Route path="/contacts" element={<ContactsList />} />
            <Route path="/contacts/:id" element={<ContactDetails />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default App; 