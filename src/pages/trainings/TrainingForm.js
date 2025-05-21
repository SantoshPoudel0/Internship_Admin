import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Spinner, Row, Col, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const TrainingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [training, setTraining] = useState({
    title: '',
    description: '',
    duration: '',
    price: 0,
    discount: 0,
    featured: false,
    order: 0
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchTraining = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API_URL}/api/trainings/${id}`);
          setTraining(data);
          
          // Set image preview if available
          if (data.imageUrl && data.imageUrl !== 'default-training.jpg') {
            setImagePreview(`${API_URL}/uploads/${data.imageUrl}`);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch training details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchTraining();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTraining({
      ...training,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
      // Create form data to handle file upload
      const formData = new FormData();
      
      // Add training data to form
      Object.keys(training).forEach(key => {
        formData.append(key, training[key]);
      });
      
      // Add image if selected
      if (image) {
        formData.append('image', image);
      }
      
      if (isEditMode) {
        await axios.put(`${API_URL}/api/trainings/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${API_URL}/api/trainings`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      navigate('/trainings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save training');
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
      <h2 className="mb-4">{isEditMode ? 'Edit Training' : 'Add New Training'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter training title"
                value={training.title}
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
                placeholder="Enter training description"
                value={training.description}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    placeholder="e.g. 2.5 months, 3 months"
                    value={training.duration}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a duration.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="image">
                  <Form.Label>Training Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Upload an image for this training (recommended size: 300x200px)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            {imagePreview && (
              <div className="mb-3">
                <p>Image Preview:</p>
                <Image 
                  src={imagePreview} 
                  alt="Training preview" 
                  style={{ maxWidth: '200px', maxHeight: '150px' }} 
                  thumbnail 
                />
              </div>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price (Rs)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    min="0"
                    step="1"
                    value={training.price}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid price.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="discount">
                  <Form.Label>Discount (Rs)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    min="0"
                    step="1"
                    value={training.discount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="order">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                name="order"
                value={training.order}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="featured">
              <Form.Check
                type="checkbox"
                name="featured"
                label="Featured Training"
                checked={training.featured}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Training'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/trainings')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TrainingForm; 