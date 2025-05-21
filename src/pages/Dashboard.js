import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faGraduationCap,
  faComments,
  faEnvelope,
  faUsers,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '../utils/constants';

const Dashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      services: 0,
      trainings: 0,
      reviews: 0,
      pendingReviews: 0,
      contacts: 0,
      newContacts: 0,
      users: 0
    },
    recentContacts: [],
    recentReviews: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/admin/dashboard`);
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  const { counts, recentContacts, recentReviews } = stats;

  return (
    <Container fluid>
      <h2 className="mb-4">Dashboard</h2>

      <Row className="mb-4">
        <Col md={4} lg={2} className="mb-3">
          <Link to="/services" className="text-decoration-none">
            <Card className="card-stats bg-light text-primary">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faServer} className="dashboard-icon" />
                <div>
                  <h3>{counts.services}</h3>
                  <p className="mb-0 text-muted">Services</p>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4} lg={2} className="mb-3">
          <Link to="/trainings" className="text-decoration-none">
            <Card className="card-stats bg-light text-success">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faGraduationCap} className="dashboard-icon" />
                <div>
                  <h3>{counts.trainings}</h3>
                  <p className="mb-0 text-muted">Trainings</p>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4} lg={2} className="mb-3">
          <Link to="/reviews" className="text-decoration-none">
            <Card className="card-stats bg-light text-warning">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faComments} className="dashboard-icon" />
                <div>
                  <h3>{counts.reviews}</h3>
                  <p className="mb-0 text-muted">Reviews</p>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4} lg={2} className="mb-3">
          <Link to="/reviews" className="text-decoration-none">
            <Card className="card-stats bg-light text-danger">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBell} className="dashboard-icon" />
                <div>
                  <h3>{counts.pendingReviews}</h3>
                  <p className="mb-0 text-muted">Pending Reviews</p>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4} lg={2} className="mb-3">
          <Link to="/contacts" className="text-decoration-none">
            <Card className="card-stats bg-light text-info">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faEnvelope} className="dashboard-icon" />
                <div>
                  <h3>{counts.newContacts}</h3>
                  <p className="mb-0 text-muted">New Messages</p>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4} lg={2} className="mb-3">
          <Link to="/users" className="text-decoration-none">
            <Card className="card-stats bg-light text-secondary">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUsers} className="dashboard-icon" />
                <div>
                  <h3>{counts.users}</h3>
                  <p className="mb-0 text-muted">Users</p>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Recent Messages</h5>
            </Card.Header>
            <Card.Body>
              {recentContacts.length === 0 ? (
                <p className="text-center text-muted">No recent messages</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>
                          <Link to={`/contacts/${contact._id}`}>{contact.name}</Link>
                        </td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>
                          <span className={`badge bg-${contact.status === 'new' ? 'danger' : contact.status === 'read' ? 'warning' : 'success'}`}>
                            {contact.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Recent Reviews</h5>
            </Card.Header>
            <Card.Body>
              {recentReviews.length === 0 ? (
                <p className="text-center text-muted">No recent reviews</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Rating</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReviews.map((review) => (
                      <tr key={review._id}>
                        <td>
                          <Link to={`/reviews/${review._id}`}>{review.user.name}</Link>
                        </td>
                        <td>
                          {Array(5).fill().map((_, i) => (
                            <span key={i} style={{ color: i < review.rating ? '#ffc107' : '#e4e5e9' }}>★</span>
                          ))}
                        </td>
                        <td>
                          <span className={`badge bg-${review.approved ? 'success' : 'danger'}`}>
                            {review.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 