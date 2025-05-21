import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${API_URL}/api/services/${id}`);
        setServices(services.filter(service => service._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete service');
      }
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

      {error && <Alert variant="danger">{error}</Alert>}

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
                  <Button variant="danger" size="sm" onClick={() => handleDelete(service._id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ServicesList; 