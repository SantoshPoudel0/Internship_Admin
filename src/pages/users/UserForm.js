import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import { AuthContext } from '../../context/AuthContext';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const isEditMode = Boolean(id);
  const isEditingSelf = currentUser && currentUser._id === id;
  
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [authLoading, currentUser, navigate]);
  
  useEffect(() => {
    if (isEditMode && currentUser) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          
          if (isEditingSelf) {
            setUser({
              _id: currentUser._id,
              name: currentUser.name,
              email: currentUser.email,
              password: '',
              isAdmin: currentUser.isAdmin
            });
          } else {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}/api/admin/users/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setUser({ 
              _id: data._id,
              name: data.name,
              email: data.email,
              password: '',
              isAdmin: data.isAdmin
            });
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch user details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    }
  }, [id, isEditMode, isEditingSelf, currentUser]);
  
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
    
    // Check if passwords match when password is being changed
    if (user.password && user.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setValidated(true);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // Prepare update data
      const userData = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      };

      // Only include password if it's been changed and not empty
      if (user.password && user.password.trim() !== '') {
        userData.password = user.password;
      }

      if (isEditMode) {
        const response = await axios.put(`${API_URL}/api/admin/users/${id}`, userData, config);
        
        // If editing self, update local storage with the response data
        if (isEditingSelf && response.data) {
          const updatedUser = {
            ...currentUser,
            ...response.data
          };
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }
      } else {
        await axios.post(`${API_URL}/api/admin/users`, userData, config);
      }
      
      navigate('/users');
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading || (loading && isEditMode)) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <Container fluid>
      <Card>
        <Card.Header>
          <h2>{isEditMode ? 'Edit User' : 'Add New User'}</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
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
                minLength={6}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password (minimum 6 characters).
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isEditMode || user.password !== ''}
                minLength={6}
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
                disabled={isEditingSelf}
              />
              {isEditingSelf && (
                <Form.Text className="text-muted">
                  You cannot remove your own admin rights.
                </Form.Text>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate('/users')}>
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

export default UserForm; 