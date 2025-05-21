import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/bookings`);
        setBookings(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`${API_URL}/api/bookings/${id}`);
        setBookings(bookings.filter(booking => booking._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete booking');
      }
    }
  };
  
  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/bookings/${id}`, { status });
      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, status: data.status } : booking
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking status');
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="warning" text="dark">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Training Bookings</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Training</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No bookings found</td>
            </tr>
          ) : (
            bookings.map(booking => (
              <tr key={booking._id}>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td>{booking.trainingTitle}</td>
                <td>{booking.name}</td>
                <td>
                  <a href={`mailto:${booking.email}`}>{booking.email}</a>
                </td>
                <td>{booking.phone}</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>
                  <Dropdown className="d-inline me-2">
                    <Dropdown.Toggle variant="info" size="sm" id={`status-dropdown-${booking._id}`}>
                      Update Status
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleStatusChange(booking._id, 'pending')}>
                        Pending
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusChange(booking._id, 'confirmed')}>
                        Confirm
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusChange(booking._id, 'cancelled')}>
                        Cancel
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(booking._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default BookingsList; 