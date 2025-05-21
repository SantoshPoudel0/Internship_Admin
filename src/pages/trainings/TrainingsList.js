import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Modal, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../utils/constants';
import useNotification from '../../components/useNotification';
import NotificationBanner from '../../components/NotificationBanner';

const TrainingsList = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTrainingId, setDeleteTrainingId] = useState(null);
  const { error, setError, success, setSuccess, showSuccess } = useNotification();

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
  }, [setError]);

  const handleDeleteRequest = (id) => {
    setDeleteTrainingId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTrainingId) return;
    try {
      await axios.delete(`${API_URL}/api/trainings/${deleteTrainingId}`);
      setTrainings(trainings.filter(training => training._id !== deleteTrainingId));
      showSuccess('Training deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete training');
    } finally {
      setShowDeleteModal(false);
      setDeleteTrainingId(null);
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

      <NotificationBanner error={error} success={success} setError={setError} setSuccess={setSuccess} />

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
                  <Button variant="danger" size="sm" onClick={() => handleDeleteRequest(training._id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this training?</p>
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

export default TrainingsList; 