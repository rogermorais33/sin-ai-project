import React, { useState } from 'react';
import { Alert, Button, TextField, Box, Card, CardContent, Typography, Grid, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL;

  const handleSignup = async () => {
    setMessage('');
    setValidationError('');

    if (!username || !password || !confirmPassword) {
      setValidationError('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Os campos de senha não coincidem.');
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
      const response = await axios.post(`${baseApiUrl}/api/register/`, userData, { withCredentials: true });

      if (response.status === 201) {
        setMessage('Cadastro feito com sucesso!');
        setSignupSuccess(true);
        navigate('/login');
      } else {
        throw new Error('Falha ao tentar cadastrar');
      }
    } catch (error) {
      setMessage('Falha no cadastro. Tente novamente.');
      setSignupSuccess(false);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Sign Up
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
              <TextField
                label="Confirmar Senha"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {validationError && (
                <Alert severity="error" style={{ marginTop: '1em' }}>{validationError}</Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSignup}
                style={{ marginTop: '1em' }}
              >
                Sign Up
              </Button>
              {message && (
                <Alert severity={signupSuccess ? 'success' : 'error'} style={{ marginTop: '1em' }}>{message}</Alert>
              )}
              <Typography variant="body2" style={{ marginTop: '1em', textAlign: 'center' }}>
                Já possui uma conta?{' '}
                <Link href="/login" variant="body2">
                  Entrar
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
