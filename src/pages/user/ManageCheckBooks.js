import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Table, Dropdown, DropdownButton, FormControl, Button } from 'react-bootstrap';
import { Typography, Box } from '@mui/material';
import { FaFilter } from 'react-icons/fa';

const ManageCheckBooks = () => {
    const [checkBooks, setCheckBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCheckBooks, setFilteredCheckBooks] = useState([]);
    const [expandedDetails, setExpandedDetails] = useState({});

    useEffect(() => {
        fetchCheckBooks();
    }, []);

    // Fetch CheckBooks from API
    const fetchCheckBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authorization token is missing');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                'https://demoapihistory-hsgagzgtcse4daby.japaneast-01.azurewebsites.net/api/CheckBook/list-checkbooks-for-admin?Page=1&PageSize=10',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data?.result?.data) {
                const enrichedData = response.data.result.data.map((checkBook) => ({
                    ...checkBook,
                    name: checkBook.name || 'No Name', // Add default value if name is missing
                    digitalSignature: checkBook.digitalSignature || 'No Signature', // Add default value for signature
                }));

                setCheckBooks(enrichedData);
                setFilteredCheckBooks(enrichedData);
            } else {
                setError('No checkbooks found or invalid data format');
            }
            setLoading(false);
        } catch (err) {
            setError('Error fetching checkbooks');
            setLoading(false);
            console.error('Error fetching checkbooks:', err);
        }
    };

    // Handle search
    const handleSearch = () => {
        const result = checkBooks.filter((checkBook) => {
            const matchesStatus = statusFilter ? checkBook.status === statusFilter : true;
            const matchesSearch = searchQuery
                ? checkBook.checkBookCode.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return matchesStatus && matchesSearch;
        });
        setFilteredCheckBooks(result);
    };

    const handleSearchQueryChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.trim() === '') {
            const result = checkBooks.filter((checkBook) => {
                const matchesStatus = statusFilter ? checkBook.status === statusFilter : true;
                return matchesStatus;
            });
            setFilteredCheckBooks(result);
        }
    };

    // Handle filter by status
    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        const result = checkBooks.filter((checkBook) => {
            const matchesStatus = status ? checkBook.status === status : true;
            const matchesSearch = searchQuery
                ? checkBook.checkBookCode.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return matchesStatus && matchesSearch;
        });
        setFilteredCheckBooks(result);
    };

    // Toggle Digital Signature
    const handleToggleDigitalSignature = (checkBookId) => {
        setExpandedDetails((prevState) => ({
            ...prevState,
            [checkBookId]: !prevState[checkBookId],
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='main-content' style={{ marginLeft: '43px' }}>
            <Container style={{ marginTop: '20px' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Checkbook List
                </Typography>
                <Box mt={3}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between" style={{ marginBottom: '20px' }}>
                                {/* Search */}
                                <FormControl
                                    type="text"
                                    placeholder="Search by CheckBook Code"
                                    value={searchQuery}
                                    onChange={handleSearchQueryChange}
                                    style={{ width: '80%' }}
                                />

                                {/* Search Button */}
                                <Button
                                    variant="outline-primary"
                                    onClick={handleSearch}
                                    style={{
                                        backgroundColor: '#1976d2',
                                        color: 'white',
                                        borderColor: '#1976d2',
                                    }}
                                >
                                    Search
                                </Button>

                                {/* Filter Dropdown */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FaFilter style={{ marginRight: '10px', cursor: 'pointer' }} />
                                    <DropdownButton
                                        variant="outline-secondary"
                                        id="status-filter-dropdown"
                                        title={statusFilter || 'Select Status'}
                                        onSelect={handleStatusFilterChange}
                                    >
                                        <Dropdown.Item eventKey="">All</Dropdown.Item>
                                        <Dropdown.Item eventKey="PENDING">Pending</Dropdown.Item>
                                        <Dropdown.Item eventKey="APPROVED">Approved</Dropdown.Item>
                                        <Dropdown.Item eventKey="SHIPPING">Shipping</Dropdown.Item>
                                        <Dropdown.Item eventKey="DELIVERED">Delivered</Dropdown.Item>
                                        <Dropdown.Item eventKey="WORKING">Working</Dropdown.Item>
                                        <Dropdown.Item eventKey="STOPPED">Stopped</Dropdown.Item>
                                        <Dropdown.Item eventKey="CLOSED">Closed</Dropdown.Item>
                                        <Dropdown.Item eventKey="CANCELED">Canceled</Dropdown.Item>
                                        <Dropdown.Item eventKey="LOCKED">Locked</Dropdown.Item>
                                        <Dropdown.Item eventKey="EXHAUSTED">Exhausted</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </div>

                            {/* Checkbooks Table */}
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center' }}>No</th>
                                        <th style={{ textAlign: 'center' }}>CheckBook Code</th>
                                        <th style={{ textAlign: 'center' }}>Name</th>
                                        <th style={{ textAlign: 'center' }}>Associated Account</th>
                                        <th style={{ textAlign: 'center' }}>Address</th>
                                        <th style={{ textAlign: 'center' }}>Expiry Date</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                        <th style={{ textAlign: 'center' }}>Digital Signature</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCheckBooks.length > 0 ? (
                                        filteredCheckBooks.map((checkBook, index) => (
                                            <tr key={checkBook.checkBookId}>
                                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                <td style={{ textAlign: 'center' }}>{checkBook.checkBookCode}</td>
                                                <td style={{ textAlign: 'center' }}>{checkBook.userName}</td>
                                                <td style={{ textAlign: 'center' }}>{checkBook.associatedAccountNumber}</td>
                                                <td style={{ textAlign: 'center' }}>{checkBook.deliveryAddress}</td>
                                                <td style={{ textAlign: 'center' }}>{new Date(checkBook.expiryDate).toLocaleDateString()}</td>
                                                <td style={{ textAlign: 'center' }}>{checkBook.status}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <Button
                                                        variant="link"
                                                        onClick={() => handleToggleDigitalSignature(checkBook.checkBookId)}
                                                    >
                                                        {expandedDetails[checkBook.checkBookId]
                                                            ? 'Hide Digital Signature'
                                                            : 'View Digital Signature'}
                                                    </Button>
                                                    {expandedDetails[checkBook.checkBookId] && (
                                                        <div>
                                                            <img
                                                                src={checkBook.digitalSignature}
                                                                alt="Digital Signature"
                                                                style={{ width: '100px', height: 'auto' }}
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">
                                                No checkbooks available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Box>
            </Container>
        </div>
    );
};

export default ManageCheckBooks;
