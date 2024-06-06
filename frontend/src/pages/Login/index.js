import React, { useState } from 'react';
import { Alert, Button, TextField, Box, Card, CardContent, Typography, Grid, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL;

  const handleLogin = async () => {
    setMessage('');
    setValidationError('');

    if (!username || !password) {
      setValidationError('Nome e senha são campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setValidationError('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }

    try {
      const userData = {
        username,
        password,
      }
      const response = await axios.post(`${baseApiUrl}/api/login/`, userData, { withCredentials: true });
      if (response.status === 200) {
        setMessage('Login realizado com sucesso!');
        setLoginSuccess(true);
        navigate('/');
      } else {
        throw new Error('Falha no Login');
      }
    } catch (error) {
      setMessage('Falha no login. Tente novamente.');
      setLoginSuccess(false);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Login
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {validationError && (
                <Alert severity="error" style={{ marginTop: '1em' }}>{validationError}</Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLogin}
                style={{ marginTop: '1em' }}
              >
                Login
              </Button>
              {message && (
                <Alert severity={loginSuccess ? 'success' : 'error'} style={{ marginTop: '1em' }}>{message}</Alert>
              )}
              <Typography variant="body2" style={{ marginTop: '1em', textAlign: 'center' }}>
                Não possui uma conta?{' '}
                <Link href="/register" variant="body2">
                  Cadastrar
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}