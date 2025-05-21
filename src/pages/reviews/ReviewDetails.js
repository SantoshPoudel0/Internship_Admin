import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/reviews/${id}`);
        setReview(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch review');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const handleToggleApprove = async () => {
    try {
      const { data } = await axios.put(`${API_URL}/api/reviews/${id}`, {
        approved: !review.approved
      });
      setReview({ ...review, approved: data.approved });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
    }
  };

  const handleToggleFeature = async () => {
    try {
      const { data } = await axios.put(`${API_URL}/api/reviews/${id}`, {
        featured: !review.featured
      });
      setReview({ ...review, featured: data.featured });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${API_URL}/api/reviews/${id}`);
        navigate('/reviews');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete review');
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

  if (!review) {
    return (
      <Alert variant="danger">
        Review not found
      </Alert>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Review Details</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/reviews')}>
          Back to Reviews
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Card.Subtitle className="mb-2 text-muted">Name</Card.Subtitle>
              <Card.Text>{review.user.name}</Card.Text>
            </Col>
            <Col md={4}>
              <Card.Subtitle className="mb-2 text-muted">Rating</Card.Subtitle>
              <Card.Text>
                {Array(5).fill().map((_, i) => (
                  <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#e4e5e9', fontSize: '1.5rem' }}>★</span>
                ))}
              </Card.Text>
            </Col>
            <Col md={4}>
              <Card.Subtitle className="mb-2 text-muted">Status</Card.Subtitle>
              <Card.Text>
                <Badge bg={review.approved ? "success" : "danger"} className="me-2">
                  {review.approved ? "Approved" : "Pending"}
                </Badge>
                {review.featured && <Badge bg="info">Featured</Badge>}
              </Card.Text>
            </Col>
          </Row>
          <hr />
          <Row className="mt-3">
            <Col>
              <Card.Subtitle className="mb-2 text-muted">Review Text</Card.Subtitle>
              <Card.Text className="p-3 bg-light rounded">{review.text}</Card.Text>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Card.Subtitle className="mb-2 text-muted">Date Submitted</Card.Subtitle>
              <Card.Text>{new Date(review.createdAt).toLocaleString()}</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="d-flex gap-2">
        <Button
          variant={review.approved ? "outline-success" : "success"}
          onClick={handleToggleApprove}
        >
          {review.approved ? "Unapprove" : "Approve"}
        </Button>
        <Button
          variant={review.featured ? "outline-warning" : "warning"}
          onClick={handleToggleFeature}
        >
          {review.featured ? "Unfeature" : "Feature"}
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Container>
  );
};

export default ReviewDetails; 