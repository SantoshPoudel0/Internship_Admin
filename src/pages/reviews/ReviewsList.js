import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Get all reviews including unapproved ones
        const { data } = await axios.get(`${API_URL}/api/reviews/admin/all`);
        setReviews(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleApprove = async (id, currentStatus) => {
    try {
      await axios.put(`${API_URL}/api/reviews/${id}`, { approved: !currentStatus });
      setReviews(reviews.map(review => 
        review._id === id ? { ...review, approved: !currentStatus } : review
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
    }
  };

  const handleFeature = async (id, currentStatus) => {
    try {
      await axios.put(`${API_URL}/api/reviews/${id}`, { featured: !currentStatus });
      setReviews(reviews.map(review => 
        review._id === id ? { ...review, featured: !currentStatus } : review
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${API_URL}/api/reviews/${id}`);
        setReviews(reviews.filter(review => review._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  const filteredReviews = showAllReviews 
    ? reviews 
    : reviews.filter(review => !review.approved);

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
        <h2>Reviews</h2>
        <div>
          <Button 
            variant={showAllReviews ? 'outline-primary' : 'primary'} 
            className="me-2"
            onClick={() => setShowAllReviews(false)}
          >
            Show Pending
          </Button>
          <Button 
            variant={showAllReviews ? 'primary' : 'outline-primary'}
            onClick={() => setShowAllReviews(true)}
          >
            Show All
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No reviews found</td>
            </tr>
          ) : (
            filteredReviews.map(review => (
              <tr key={review._id}>
                <td>{review.user.name}</td>
                <td>
                  {Array(5).fill().map((_, i) => (
                    <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#e4e5e9' }}>★</span>
                  ))}
                </td>
                <td>{review.text.substring(0, 50)}...</td>
                <td>
                  <Badge bg={review.approved ? "success" : "danger"} className="me-1">
                    {review.approved ? "Approved" : "Pending"}
                  </Badge>
                  {review.featured && <Badge bg="info">Featured</Badge>}
                </td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/reviews/${review._id}`} className="btn btn-sm btn-info me-1">View</Link>
                  <Button 
                    variant={review.approved ? "outline-success" : "success"} 
                    size="sm" 
                    className="me-1"
                    onClick={() => handleApprove(review._id, review.approved)}
                  >
                    {review.approved ? "Unapprove" : "Approve"}
                  </Button>
                  <Button 
                    variant={review.featured ? "outline-warning" : "warning"} 
                    size="sm" 
                    className="me-1"
                    onClick={() => handleFeature(review._id, review.featured)}
                  >
                    {review.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(review._id)}
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

export default ReviewsList; 