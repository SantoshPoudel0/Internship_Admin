import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faGraduationCap,
  faComments,
  faEnvelope,
  faUsers,
  faRightFromBracket,
  faCalendarCheck,
  faHome,
  faCalendar,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

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
      <div className="sidebar-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faGauge} className="me-2" />
          Dashboard
        </NavLink>
        <NavLink to="/trainings" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
          Trainings
        </NavLink>
        <NavLink to="/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
          Bookings
        </NavLink>
        <NavLink to="/contacts" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
          Contacts
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          Users
        </NavLink>
        <NavLink to="/menu-items" className={({ isActive }) => isActive ? 'active' : ''}>
          <FontAwesomeIcon icon={faUtensils} className="me-2" />
          Menu Items
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