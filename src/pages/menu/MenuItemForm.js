import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const MenuItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const initialState = {
    name: '',
    price: '',
    description: '',
    category: 'Coffee',
    imageUrl: '',
    available: true,
    displayOrder: 9999
  };
  
  const [menuItem, setMenuItem] = useState(initialState);
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchMenuItem = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API_URL}/api/menu-items/${id}`);
          setMenuItem(data);
          
          // Set image preview if available
          if (data.imageUrl && data.imageUrl !== 'default-menu-item.jpg') {
            setImagePreview(`${API_URL}/uploads/${data.imageUrl}`);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch menu item details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchMenuItem();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuItem({
      ...menuItem,
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
    setSubmitting(true);
    setError(null);
    
    try {
      // Create FormData object to handle file upload
      const formData = new FormData();
      formData.append('name', menuItem.name);
      formData.append('price', menuItem.price);
      formData.append('description', menuItem.description || '');
      formData.append('category', menuItem.category);
      formData.append('available', menuItem.available);
      formData.append('displayOrder', menuItem.displayOrder);
      
      if (image) {
        formData.append('image', image);
      }
      
      let response;
      if (isEditMode) {
        response = await axios.put(`${API_URL}/api/menu-items/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post(`${API_URL}/api/menu-items`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      navigate('/menu-items');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setSubmitting(false);
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
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/menu-items')}>
          Back to Menu Items
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={menuItem.name}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a name.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price (Rs.)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={menuItem.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="any"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid price.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={menuItem.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="Coffee">Coffee</option>
                        <option value="Tea">Tea</option>
                        <option value="Pastry">Pastry</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Snack">Snack</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={menuItem.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Available"
                        name="available"
                        checked={menuItem.available}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Display Order</Form.Label>
                      <Form.Control
                        type="number"
                        name="displayOrder"
                        value={menuItem.displayOrder}
                        onChange={handleChange}
                        min="0"
                        step="1"
                      />
                      <Form.Text className="text-muted">
                        Lower numbers will be displayed first
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <div className="d-flex flex-column align-items-center">
                    {imagePreview ? (
                      <div className="mb-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                        />
                      </div>
                    ) : (
                      <div className="mb-3 text-center p-4 bg-light">
                        <p className="text-muted">No image selected</p>
                      </div>
                    )}
                    
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Form.Text className="text-muted mt-1">
                      Recommended size: 500x500 pixels
                    </Form.Text>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-grid gap-2 mt-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Saving...</span>
                  </>
                ) : (
                  isEditMode ? 'Update Menu Item' : 'Add Menu Item'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MenuItemForm; 