import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const MenuItemsList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'Coffee', 'Tea', etc.
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/menu-items`);
        // Sort by display order
        const sortedItems = data.sort((a, b) => a.displayOrder - b.displayOrder);
        setMenuItems(sortedItems);
      } catch (err) {
        setError('Failed to load menu items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`${API_URL}/api/menu-items/${id}`);
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete menu item');
      }
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/menu-items/${id}`, { 
        available: !currentStatus 
      });
      
      setMenuItems(menuItems.map(item => 
        item._id === id ? { ...item, available: data.available } : item
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update menu item');
    }
  };

  const handleImageError = (itemId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const getImageUrl = (item) => {
    if (imageLoadErrors[item._id]) {
      return `/images/menu/${item.category.toLowerCase()}.png`;
    }
    return item.imageUrl && item.imageUrl !== 'default-menu-item.jpg'
      ? `${API_URL}/uploads/${item.imageUrl}`
      : `/images/menu/${item.category.toLowerCase()}.png`;
  };

  const getStatusBadge = (available) => {
    return available ? 
      <Badge bg="success">Available</Badge> : 
      <Badge bg="danger">Unavailable</Badge>;
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'Coffee': 'brown',
      'Tea': 'green',
      'Pastry': 'orange',
      'Dessert': 'purple',
      'Snack': 'blue',
      'Other': 'secondary'
    };
    
    return (
      <Badge style={{ backgroundColor: colors[category] || '#6c757d' }}>
        {category}
      </Badge>
    );
  };

  const filteredMenuItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

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
        <h2>Menu Items</h2>
        <Link to="/menu-items/new" className="btn btn-primary">
          Add New Item
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Filter by Category</h5>
            <div>
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline-primary'} 
                className="me-2"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'Coffee' ? 'primary' : 'outline-primary'} 
                className="me-2"
                onClick={() => setFilter('Coffee')}
              >
                Coffee
              </Button>
              <Button 
                variant={filter === 'Tea' ? 'primary' : 'outline-primary'} 
                className="me-2"
                onClick={() => setFilter('Tea')}
              >
                Tea
              </Button>
              <Button 
                variant={filter === 'Pastry' ? 'primary' : 'outline-primary'} 
                className="me-2"
                onClick={() => setFilter('Pastry')}
              >
                Pastry
              </Button>
              <Button 
                variant={filter === 'Dessert' ? 'primary' : 'outline-primary'} 
                className="me-2"
                onClick={() => setFilter('Dessert')}
              >
                Dessert
              </Button>
              <Button 
                variant={filter === 'Snack' ? 'primary' : 'outline-primary'} 
                onClick={() => setFilter('Snack')}
              >
                Snack
              </Button>
            </div>
          </div>
        </Card.Header>
      </Card>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Display Order</th>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMenuItems.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No menu items found</td>
            </tr>
          ) : (
            filteredMenuItems.map(item => (
              <tr key={item._id}>
                <td>{item.displayOrder}</td>
                <td>
                  <img 
                    src={getImageUrl(item)}
                    alt={item.name}
                    onError={() => handleImageError(item._id)}
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'cover',
                      backgroundColor: '#f8f9fa'
                    }}
                    loading="lazy"
                  />
                </td>
                <td>{item.name}</td>
                <td>Rs. {item.price}</td>
                <td>{getCategoryBadge(item.category)}</td>
                <td>{getStatusBadge(item.available)}</td>
                <td>
                  <Link to={`/menu-items/edit/${item._id}`} className="btn btn-sm btn-info me-2">
                    Edit
                  </Link>
                  <Button 
                    variant={item.available ? "warning" : "success"} 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleToggleAvailability(item._id, item.available)}
                  >
                    {item.available ? 'Mark Unavailable' : 'Mark Available'}
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(item._id)}
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

export default MenuItemsList; 