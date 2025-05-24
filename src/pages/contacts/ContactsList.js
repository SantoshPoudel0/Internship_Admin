import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ContactsList = () => {
  const { api, currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'read', 'responded'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchContacts = async () => {
      try {
        const { data } = await api.get('/api/contacts');
        setContacts(data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch contacts');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [api, currentUser, navigate, logout]);

  const handleDeleteRequest = (id) => {
    setDeleteContactId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteContactId) return;
    try {
      await api.delete(`/api/contacts/${deleteContactId}`);
      setContacts(contacts.filter(contact => contact._id !== deleteContactId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    } finally {
      setShowDeleteModal(false);
      setDeleteContactId(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/api/contacts/${id}`, { status });
      setContacts(contacts.map(contact => 
        contact._id === id ? { ...contact, status } : contact
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <Badge bg="danger">New</Badge>;
      case 'read':
        return <Badge bg="warning">Read</Badge>;
      case 'responded':
        return <Badge bg="success">Responded</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const filteredContacts = filter === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.status === filter);

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
        <h2>Contact Messages</h2>
        <div>
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'new' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => setFilter('new')}
          >
            New
          </Button>
          <Button 
            variant={filter === 'read' ? 'primary' : 'outline-primary'} 
            className="me-2"
            onClick={() => setFilter('read')}
          >
            Read
          </Button>
          <Button 
            variant={filter === 'responded' ? 'primary' : 'outline-primary'} 
            onClick={() => setFilter('responded')}
          >
            Responded
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No messages found</td>
            </tr>
          ) : (
            filteredContacts.map(contact => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.subject}</td>
                <td>{getStatusBadge(contact.status)}</td>
                <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/contacts/${contact._id}`} className="btn btn-sm btn-info me-1">View</Link>
                  {contact.status === 'new' && (
                    <Button 
                      variant="warning" 
                      size="sm" 
                      className="me-1"
                      onClick={() => handleStatusUpdate(contact._id, 'read')}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {(contact.status === 'new' || contact.status === 'read') && (
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="me-1"
                      onClick={() => handleStatusUpdate(contact._id, 'responded')}
                    >
                      Mark as Responded
                    </Button>
                  )}
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteRequest(contact._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this message?</p>
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

export default ContactsList; 