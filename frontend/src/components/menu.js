import { Button, Link, Typography, Box } from '@mui/material';
import './menu.css';

export default function Menu() {
  return (
    <div className='menu'>
      <Typography variant="h6" component="h2">
        <Box sx={{ fontWeight: 'bold' }}>
          <Link href="/" underline='none'>
            SIN-AI
          </Link>
        </Box>
      </Typography>
      <div className='buttons'>
        <Button variant='outlined'>
          <Link href="/register" variant="body2" underline='none'>
            Cadastrar
          </Link>
        </Button>
        <Button variant='contained'>
          <Link href="/login" variant="body2" color="inherit" underline='none'>
            Entrar
          </Link>
        </Button>
      </div>
    </div>
  );
}