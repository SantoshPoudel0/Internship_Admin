import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/contact/${id}`);
        setContact(data);

        // Auto-update from 'new' to 'read' when viewing
        if (data.status === 'new') {
          updateStatus('read');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch contact details');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/contact/${id}`, { status });
      setContact({ ...contact, status: data.status });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`${API_URL}/api/contact/${id}`);
        navigate('/contacts');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete message');
      }
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!contact) {
    return (
      <Alert variant="danger">
        Message not found
      </Alert>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Message Details</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/contacts')}>
          Back to Messages
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">{contact.subject}</h5>
            <small className="text-muted">From: {contact.name} ({contact.email})</small>
          </div>
          <div>
            {getStatusBadge(contact.status)}
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text className="p-3 bg-light rounded">{contact.message}</Card.Text>
          <hr />
          <Row className="mt-3">
            <Col>
              <Card.Subtitle className="mb-2 text-muted">Date Received</Card.Subtitle>
              <Card.Text>{new Date(contact.createdAt).toLocaleString()}</Card.Text>
            </Col>
            <Col>
              <Card.Subtitle className="mb-2 text-muted">Status</Card.Subtitle>
              <Card.Text>{getStatusBadge(contact.status)}</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="d-flex gap-2">
        {contact.status !== 'responded' && (
          <Button
            variant="success"
            onClick={() => updateStatus('responded')}
          >
            Mark as Responded
          </Button>
        )}
        {contact.status === 'responded' && (
          <Button
            variant="warning"
            onClick={() => updateStatus('read')}
          >
            Mark as Unresponded
          </Button>
        )}
        <Button 
          variant="outline-primary"
          href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Reply via Email
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Container>
  );
};

export default ContactDetails; 