import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setEmail('');
    setPassword('');
    setPasswordError('');
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 6;

    console.log(hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars, isValidLength)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !isValidLength || !hasSpecialChars) {
      console.log('aqui')
      setPasswordError('A senha deve ter pelo menos 6 caracteres, incluindo letras maiúsculas, minúsculas e números.');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validatePassword(password)) return;

    try {
      await AuthService.register({ email, password });
      setActiveTab(1);
    } catch {
      alert('Erro ao registrar. Tente novamente.');
    }
  };

  const handleLogin = async () => {
    if (!validatePassword(password)) return;

    try {
      const tokens = await AuthService.login({ email, password });
      if (tokens) {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer login. Tente novamente.');
    }
  };

  useEffect(() => {
    validatePassword(password);
  }, [password])

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center">
          Autenticação
        </Typography>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Registro" />
          <Tab label="Login" />
        </Tabs>
        {activeTab === 0 && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={!!passwordError}>
              Registrar
            </Button>
          </Box>
        )}
        {activeTab === 1 && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              label="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={!!passwordError}>
              Login
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AuthPage;
