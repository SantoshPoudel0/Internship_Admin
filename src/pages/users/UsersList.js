import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api, currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/api/admin/users');
        setUsers(data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch users');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [api, currentUser, navigate, logout]);

  const handleDelete = async (id) => {
    // Prevent deleting self
    if (id === currentUser._id) {
      return setError("You cannot delete your own admin account");
    }

    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/api/admin/users/${id}`);
        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
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
        <h2>Users</h2>
        <Link to="/users/new">
          <Button variant="primary">Add New User</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No users found</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <Badge bg="danger">Admin</Badge>
                  ) : (
                    <Badge bg="info">User</Badge>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/users/edit/${user._id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                  {user._id === currentUser._id ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>You cannot delete your own admin account</Tooltip>}
                    >
                      <span>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          disabled
                          style={{ pointerEvents: 'none' }}
                        >
                          Current User
                        </Button>
                      </span>
                    </OverlayTrigger>
                  ) : (
                    user.isAdmin ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Admin users cannot be deleted</Tooltip>}
                      >
                        <span>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            disabled
                            style={{ pointerEvents: 'none' }}
                          >
                            Admin User
                          </Button>
                        </span>
                      </OverlayTrigger>
                    ) : (
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    )
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default UsersList; 