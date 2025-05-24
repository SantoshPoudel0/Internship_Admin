import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faComments,
  faEnvelope,
  faUsers,
  faBell,
  faCalendarCheck,
  faUtensils,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../utils/constants';

const Dashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      trainings: 0,
      reviews: 0,
      pendingReviews: 0,
      contacts: 0,
      newContacts: 0,
      users: 0,
      bookings: 0,
      pendingBookings: 0,
      menuItems: 0,
      featuredMenuItems: 0
    },
    recentContacts: [],
    recentReviews: [],
    recentBookings: [],
    recentMenuItems: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const { api, currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/api/admin/dashboard');
        setStats(data);
      } catch (err) {
        console.error('Dashboard error:', err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, api, navigate, logout]);

  const handleImageError = (itemId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  const getImageUrl = (item) => {
    if (imageLoadErrors[item._id]) {
      return `/images/menu/${item.category.toLowerCase()}.png`;
    }
    return item.imageUrl && item.imageUrl !== 'default-menu-item.jpg'
      ? `${API_URL}/uploads/${item.imageUrl}`
      : `/images/menu/${item.category.toLowerCase()}.png`;
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
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  const { counts, recentContacts, recentReviews, recentBookings, recentMenuItems } = stats;

  return (
    <Container fluid>
      <h2 className="mb-4">Dashboard</h2>

      <Row className="mb-4">
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
          <Link to="/bookings" className="text-decoration-none">
            <Card className="card-stats bg-light text-warning">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faCalendarCheck} className="dashboard-icon" />
                <div>
                  <h3>{counts.bookings}</h3>
                  <p className="mb-0 text-muted">Bookings</p>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={4} lg={2} className="mb-3">
          <Link to="/bookings" className="text-decoration-none">
            <Card className="card-stats bg-light text-danger">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faBell} className="dashboard-icon" />
                <div>
                  <h3>{counts.pendingBookings}</h3>
                  <p className="mb-0 text-muted">Pending Bookings</p>
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
        <Col md={4} lg={2} className="mb-3">
          <Link to="/menu-items" className="text-decoration-none">
            <Card className="card-stats bg-light text-primary">
              <Card.Body className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUtensils} className="dashboard-icon" />
                <div>
                  <h3>{counts.menuItems}</h3>
                  <p className="mb-0 text-muted">Menu Items</p>
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
              <h5 className="mb-0">Recent Bookings</h5>
            </Card.Header>
            <Card.Body>
              {recentBookings.length === 0 ? (
                <p className="text-center text-muted">No recent bookings</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Training</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <Link to={`/bookings/${booking._id}`}>{booking.name}</Link>
                        </td>
                        <td>{booking.trainingTitle}</td>
                        <td>
                          <span className={`badge bg-${
                            booking.status === 'pending' ? 'warning' : 
                            booking.status === 'confirmed' ? 'success' : 'danger'
                          }`}>
                            {booking.status}
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
      
      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Recent Menu Items</h5>
            </Card.Header>
            <Card.Body>
              {recentMenuItems.length === 0 ? (
                <p className="text-center text-muted">No menu items added recently</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMenuItems.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <img 
                            src={getImageUrl(item)}
                            alt={item.name}
                            onError={() => handleImageError(item._id)}
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              objectFit: 'cover',
                              backgroundColor: '#f8f9fa'
                            }}
                            loading="lazy"
                          />
                        </td>
                        <td>
                          <Link to={`/menu-items/edit/${item._id}`}>{item.name}</Link>
                        </td>
                        <td>Rs. {item.price}</td>
                        <td>{item.category}</td>
                        <td>
                          <span className={`badge bg-${item.available ? 'success' : 'danger'}`}>
                            {item.available ? 'Available' : 'Unavailable'}
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