import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const MenuItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api } = useContext(AuthContext);
  const isEditMode = Boolean(id);

  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    available: true,
    displayOrder: 1
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      fetchMenuItem();
    }
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/menu-items/${id}`);
      setMenuItem({
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        available: data.available,
        displayOrder: data.displayOrder
      });
      setPreviewImage(data.image);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', menuItem.name);
      formData.append('price', menuItem.price);
      formData.append('category', menuItem.category);
      formData.append('description', menuItem.description);
      formData.append('available', menuItem.available);
      formData.append('displayOrder', menuItem.displayOrder);
      
      if (image) {
        formData.append('image', image);
      }

      if (isEditMode) {
        await api.put(`/api/menu-items/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/api/menu-items', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      navigate('/menu-items');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Card>
        <Card.Header>
          <h2>{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={menuItem.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (Rs.)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={menuItem.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={menuItem.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Coffee">Coffee</option>
                <option value="Tea">Tea</option>
                <option value="Pastries">Pastries</option>
                <option value="Snacks">Snacks</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={menuItem.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!isEditMode}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    marginTop: '10px',
                    maxWidth: '200px',
                    maxHeight: '200px'
                  }}
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Order</Form.Label>
              <Form.Control
                type="number"
                name="displayOrder"
                value={menuItem.displayOrder}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                name="available"
                label="Available"
                checked={menuItem.available}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate('/menu-items')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MenuItemForm; 