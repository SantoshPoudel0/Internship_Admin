import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faServer,
  faGraduationCap,
  faComments,
  faEnvelope,
  faUsers,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Nav className="sidebar d-flex flex-column">
      <div className="sidebar-header p-4 text-white text-center">
        <h3>Admin Panel</h3>
      </div>
      <div className="sidebar-menu flex-grow-1">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faGauge} className="me-2" />
          Dashboard
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faServer} className="me-2" />
          Services
        </NavLink>
        <NavLink to="/trainings" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
          Trainings
        </NavLink>
        <NavLink to="/reviews" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faComments} className="me-2" />
          Reviews
        </NavLink>
        <NavLink to="/contacts" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
          Contacts
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          Users
        </NavLink>
      </div>
      <div className="sidebar-footer p-3">
        <Button variant="outline-light" onClick={handleLogout} className="w-100">
          <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
          Logout
        </Button>
      </div>
    </Nav>
  );
};

export default Sidebar; 