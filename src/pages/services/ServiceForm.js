import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [service, setService] = useState({
    title: '',
    description: '',
    featured: false,
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchService = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API_URL}/api/services/${id}`);
          setService(data);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch service details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchService();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setService({
      ...service,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setLoading(true);
    
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/api/services/${id}`, service);
      } else {
        await axios.post(`${API_URL}/api/services`, service);
      }
      navigate('/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
      setLoading(false);
    }
  };
  
  if (loading && isEditMode) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  
  return (
    <Container>
      <h2 className="mb-4">{isEditMode ? 'Edit Service' : 'Add New Service'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter service title"
                value={service.title}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a title.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={4}
                placeholder="Enter service description"
                value={service.description}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="order">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                name="order"
                value={service.order}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="featured">
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured Service"
                checked={service.featured}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Service'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/services')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ServiceForm; 