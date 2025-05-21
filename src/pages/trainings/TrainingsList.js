import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const TrainingsList = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/trainings`);
        setTrainings(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch trainings');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this training?')) {
      try {
        await axios.delete(`${API_URL}/api/trainings/${id}`);
        setTrainings(trainings.filter(training => training._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete training');
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
        <h2>Trainings</h2>
        <Link to="/trainings/new">
          <Button variant="primary">Add New Training</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainings.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No trainings found</td>
            </tr>
          ) : (
            trainings.map(training => (
              <tr key={training._id}>
                <td>
                  {training.imageUrl && training.imageUrl !== 'default-training.jpg' ? (
                    <Image 
                      src={`${API_URL}/uploads/${training.imageUrl}`}
                      alt={training.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      thumbnail
                    />
                  ) : (
                    <div className="text-center text-muted">No image</div>
                  )}
                </td>
                <td>{training.title}</td>
                <td>{training.duration}</td>
                <td>Rs. {training.price} {training.discount > 0 && <span className="text-danger">(-Rs. {training.discount})</span>}</td>
                <td>{training.featured ? 'Yes' : 'No'}</td>
                <td>
                  <Link to={`/trainings/edit/${training._id}`} className="btn btn-sm btn-info me-2">Edit</Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(training._id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default TrainingsList; 