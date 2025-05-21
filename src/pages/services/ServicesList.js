import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import useNotification from '../../components/useNotification';
import NotificationBanner from '../../components/NotificationBanner';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const { error, setError, success, setSuccess, showSuccess } = useNotification();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/services`);
        setServices(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [setError]);

  const handleDeleteRequest = (id) => {
    setDeleteServiceId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteServiceId) return;
    try {
      await axios.delete(`${API_URL}/api/services/${deleteServiceId}`);
      setServices(services.filter(service => service._id !== deleteServiceId));
      showSuccess('Service deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service');
    } finally {
      setShowDeleteModal(false);
      setDeleteServiceId(null);
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
        <h2>Services</h2>
        <Link to="/services/new">
          <Button variant="primary">Add New Service</Button>
        </Link>
      </div>

      <NotificationBanner error={error} success={success} setError={setError} setSuccess={setSuccess} />

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Featured</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No services found</td>
            </tr>
          ) : (
            services.map(service => (
              <tr key={service._id}>
                <td>{service.title}</td>
                <td>{service.description.substring(0, 100)}...</td>
                <td>{service.featured ? 'Yes' : 'No'}</td>
                <td>{service.order}</td>
                <td>
                  <Link to={`/services/edit/${service._id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteRequest(service._id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this service?</p>
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

export default ServicesList; 