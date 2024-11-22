import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Alert 
} from '@mui/material';

function AccountsPage() {
  const { userId } = useParams(); 
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token'); // save token from localStorage
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        // userId -> (int)
        const userIdInt = parseInt(userId, 10);
        if (isNaN(userIdInt)) {
          setError('Invalid userId');
          setLoading(false);
          return;
        }

        // API
        const response = await fetch(
          `https://demoapihistory-hsgagzgtcse4daby.japaneast-01.azurewebsites.net/api/Account/list-user-accounts?userId=${userIdInt}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAccounts(data.result?.data || []); 
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.message || 'Failed to fetch accounts');
        }
      } catch (err) {
        console.error('Fetch Error:', err); 
        setError('An error occurred while fetching accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [userId]); 

  return (
    <Container maxWidth="md" style={{ paddingLeft: "140px", marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Accounts for User ID: {userId}
      </Typography>

      {loading && <CircularProgress style={{ display: 'block', margin: '20px auto' }} />}
      {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}

      {accounts.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Number</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Is Default</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.accountNumber}>
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell>{account.balance}</TableCell>
                  <TableCell>{account.status}</TableCell>
                  <TableCell>{account.isDefault ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && <Typography variant="body1" style={{ marginTop: '20px' }}>No accounts found for this user.</Typography>
      )}
    </Container>
  );
}

export default AccountsPage;
