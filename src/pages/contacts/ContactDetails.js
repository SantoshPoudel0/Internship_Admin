import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Spinner, Alert, Badge, Row, Col, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, currentUser } = useContext(AuthContext);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchContact = async () => {
      try {
        const { data } = await api.get(`/api/contacts/${id}`);
        if (!data) {
          setError('Message not found');
          setLoading(false);
          return;
        }
        setContact(data);
        
        // Auto-update from 'new' to 'read' when viewing
        if (data.status === 'new') {
          try {
            const response = await api.put(`/api/contacts/${id}`, { status: 'read' });
            if (response.data) {
              setContact(prevContact => ({ ...prevContact, status: 'read' }));
            }
          } catch (updateErr) {
            console.error('Error updating status:', updateErr);
          }
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Message not found');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch contact details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, api, currentUser, navigate]);

  const updateStatus = async (status) => {
    try {
      const response = await api.put(`/api/contacts/${id}`, { status });
      if (response.data) {
        setContact(prevContact => ({ ...prevContact, status }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };
  
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };
  
  const handleDelete = async () => {
    try {
      await api.delete(`/api/contacts/${id}`);
      handleCloseDeleteModal();
      navigate('/contacts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
      handleCloseDeleteModal();
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

  if (error) {
    return (
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Message Details</h2>
          <Button variant="outline-secondary" onClick={() => navigate('/contacts')}>
            Back to Messages
          </Button>
        </div>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!contact) {
    return (
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Message Details</h2>
          <Button variant="outline-secondary" onClick={() => navigate('/contacts')}>
            Back to Messages
          </Button>
        </div>
        <Alert variant="danger">Message not found</Alert>
      </Container>
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
            <h5 className="mb-0">{contact.subject || 'No Subject'}</h5>
            <small className="text-muted">From: {contact.name || 'Unknown'} ({contact.email || 'No Email'})</small>
          </div>
          <div>
            {getStatusBadge(contact.status)}
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text className="p-3 bg-light rounded">{contact.message || 'No message content'}</Card.Text>
          <hr />
          <Row className="mt-3">
            <Col md={6}>
              <Card.Subtitle className="mb-2 text-muted">Date Received</Card.Subtitle>
              <Card.Text>
                {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : 'Unknown date'}
              </Card.Text>
            </Col>
            <Col md={3}>
              <Card.Subtitle className="mb-2 text-muted">Status</Card.Subtitle>
              <Card.Text>{getStatusBadge(contact.status)}</Card.Text>
            </Col>
            <Col md={3}>
              <Card.Subtitle className="mb-2 text-muted">Phone</Card.Subtitle>
              <Card.Text>{contact.phone || 'Not provided'}</Card.Text>
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
        <Button variant="danger" onClick={handleShowDeleteModal}>
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this message?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ContactDetails; 