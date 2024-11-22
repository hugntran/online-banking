import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import {
  FaClipboardList,
  FaSignOutAlt,
  FaSearch
} from 'react-icons/fa';
import logo from '../img/ibankinglg.png'; 
import userIcon from '../img/admin-icn.png'; 
import '../styles/Navbar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('https://demoapihistory-hsgagzgtcse4daby.japaneast-01.azurewebsites.net/api/User/get-detail-User', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });

        const data = await response.json();
        if (response.ok && data && data.name) {
          setUsername(data.name);
        } else {
          setUsername('Hello World');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUsername('Hello World');
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Navbar variant="dark" className="custom-sidebar">
      <div className="brand-link d-flex align-items-center mb-3">
        <img
          src={logo}
          alt="Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8, width: '40px', height: '40px', marginRight: '10px' }}
        />
        <span className="brand-text font-weight-light">Online Banking</span>
      </div>

      <hr className="divider" />

      <div className="brand-link d-flex align-items-center mb-3">
        <img
          src={userIcon}
          alt="User"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8, width: '35px', height: '35px', marginRight: '10px' }}
        />
        <span className="brand-text font-weight-light">
          {username || 'Hello World'}
        </span>
      </div>

      <hr className="divider" />

      <Nav className="flex-column">

      <Nav.Link as={Link} to="/user/manage-checkBooks">
          <FaClipboardList style={{ marginRight: '8px' }} /> Manage CheckBooks
        </Nav.Link>

        <Nav.Link as={Link} to="/user/customer-details">
          <FaSearch style={{ marginRight: '8px' }} /> Customer Details
        </Nav.Link>

       <Nav.Link onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: '8px' }} /> Log Out
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
