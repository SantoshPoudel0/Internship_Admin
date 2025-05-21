import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { AuthContext } from '../../context/AuthContext';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const isEditMode = Boolean(id);
  const isEditingSelf = currentUser._id === id;
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API_URL}/api/admin/users/${id}`);
          // Don't include password in form for editing
          setUser({ 
            name: data.name,
            email: data.email,
            password: '',
            isAdmin: data.isAdmin
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch user details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
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
    
    // Check if passwords match
    if (!isEditMode || (isEditMode && user.password)) {
      if (user.password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    setValidated(true);
    setLoading(true);
    
    try {
      if (isEditMode) {
        // Only include password if it's been changed
        const userData = { ...user };
        if (!userData.password) {
          delete userData.password;
        }
        await axios.put(`${API_URL}/api/admin/users/${id}`, userData);
      } else {
        await axios.post(`${API_URL}/api/admin/users`, user);
      }
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
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
      <h2 className="mb-4">{isEditMode ? 'Edit User' : 'Add New User'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={user.name}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a name.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={user.email}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>{isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                value={user.password}
                onChange={handleChange}
                required={!isEditMode}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isEditMode || (isEditMode && user.password)}
              />
              <Form.Control.Feedback type="invalid">
                Please confirm your password.
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="isAdmin">
              <Form.Check
                type="checkbox"
                name="isAdmin"
                label="Admin User"
                checked={user.isAdmin}
                onChange={handleChange}
                disabled={isEditingSelf} // Prevent removing own admin rights
              />
              {isEditingSelf && (
                <Form.Text className="text-muted">
                  You cannot remove your own admin rights.
                </Form.Text>
              )}
            </Form.Group>
            
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save User'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/users')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserForm; 