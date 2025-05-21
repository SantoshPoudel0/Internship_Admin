import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'read', 'responded'

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/contact`);
        setContacts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`${API_URL}/api/contact/${id}`);
        setContacts(contacts.filter(contact => contact._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete message');
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/contact/${id}`, { status });
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
                    onClick={() => handleDelete(contact._id)}
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

export default ContactsList; 