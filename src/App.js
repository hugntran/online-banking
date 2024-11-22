import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Login from './pages/user/Login';
import CustomerDetails from './pages/user/CustomerDetails';
import ManageCheckBooks from './pages/user/ManageCheckBooks';
import AccountsPage from './pages/accounts/AccountsPage';
import './styles/MainContent.css'; 

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <NavigationBar />}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user/customer-details" element={<CustomerDetails />} />
          <Route path="/user/manage-checkBooks" element={<ManageCheckBooks />} />
          <Route path="/accounts/:userId" element={<AccountsPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router basename="/online-banking">
      <AppContent />
    </Router>
  );
}

export default App;
