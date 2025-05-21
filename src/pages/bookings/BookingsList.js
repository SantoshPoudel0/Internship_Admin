import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Dropdown, Modal, Overlay, Popover } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // For status update confirmation
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [pendingBookingId, setPendingBookingId] = useState(null);
  // For popover
  const [popoverBookingId, setPopoverBookingId] = useState(null);
  const popoverTargetRefs = useRef({});
  // For delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState(null);

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

  const handleDeleteRequest = (id) => {
    setDeleteBookingId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteBookingId) return;
    try {
      await axios.delete(`${API_URL}/api/bookings/${deleteBookingId}`);
      setBookings(bookings.filter(booking => booking._id !== deleteBookingId));
      setShowModal(false);
      showSuccess('Booking deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    } finally {
      setShowDeleteModal(false);
      setDeleteBookingId(null);
    }
  };
  
  // Show custom modal for status update
  const handleStatusChangeRequest = (id, status) => {
    setPendingBookingId(id);
    setPendingStatus(status);
    setShowStatusModal(true);
    setPopoverBookingId(null); // Close popover
  };

  // Actually update status after confirmation
  const handleStatusChangeConfirm = async () => {
    if (!pendingBookingId || !pendingStatus) return;
    try {
      const { data } = await axios.put(`${API_URL}/api/bookings/${pendingBookingId}`, { status: pendingStatus });
      setBookings(bookings.map(booking => 
        booking._id === pendingBookingId ? { ...booking, status: data.status } : booking
      ));
      if (selectedBooking && selectedBooking._id === pendingBookingId) {
        setSelectedBooking({ ...selectedBooking, status: data.status });
      }
      showSuccess('Booking status updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setShowStatusModal(false);
      setPendingBookingId(null);
      setPendingStatus(null);
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

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  // Helper for status label
  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Show success message and auto-hide
  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
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

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {/* Blur wrapper start - now includes both table and booking details modal */}
      <div className={showStatusModal || showModal ? 'blurred-bg' : ''}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Training</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No bookings found</td>
              </tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  <td>{booking.trainingTitle}</td>
                  <td>{booking.name}</td>
                  <td>
                    <div>{getStatusBadge(booking.status)}</div>
                    <div className="mt-2">
                      <Button
                        ref={el => (popoverTargetRefs.current[booking._id] = el)}
                        variant="info"
                        size="sm"
                        onClick={() => setPopoverBookingId(booking._id)}
                      >
                        Update Status
                      </Button>
                      <Overlay
                        show={popoverBookingId === booking._id}
                        target={popoverTargetRefs.current[booking._id]}
                        placement="bottom"
                        containerPadding={20}
                        rootClose
                        onHide={() => setPopoverBookingId(null)}
                      >
                        <Popover id={`popover-status-${booking._id}`}>
                          <Popover.Header as="h3">Update Status</Popover.Header>
                          <Popover.Body>
                            <Button
                              variant="warning"
                              size="sm"
                              className="w-100 mb-2"
                              onClick={() => handleStatusChangeRequest(booking._id, 'pending')}
                            >
                              Pending
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              className="w-100 mb-2"
                              onClick={() => handleStatusChangeRequest(booking._id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="w-100"
                              onClick={() => handleStatusChangeRequest(booking._id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </Popover.Body>
                        </Popover>
                      </Overlay>
                    </div>
                  </td>
                  <td>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleView(booking)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDeleteRequest(booking._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Modal for booking details - now inside blurred-bg wrapper */}
        <Modal show={showModal} onHide={handleCloseModal} centered backdrop={false}>
          <Modal.Header closeButton>
            <Modal.Title>Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBooking && (
              <>
                <p><strong>Date:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
                <p><strong>Training:</strong> {selectedBooking.trainingTitle}</p>
                <p><strong>Name:</strong> {selectedBooking.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${selectedBooking.email}`}>{selectedBooking.email}</a></p>
                <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                {selectedBooking.message && <p><strong>Message:</strong> {selectedBooking.message}</p>}
                <div className="mb-3">
                  <strong>Status:</strong> {getStatusBadge(selectedBooking.status)}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* Blur wrapper end */}

      {/* Status update confirmation modal - outside blurred-bg wrapper */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingStatus && (
            <p>Are you sure you want to change the status to <strong>{getStatusLabel(pendingStatus)}</strong>?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusChangeConfirm}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete confirmation modal - outside blurred-bg wrapper */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this booking?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingsList; 