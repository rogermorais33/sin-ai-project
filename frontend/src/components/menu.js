import { Button } from '@mui/material';
import './menu.css';

export default function Menu(){
    return(
    <div className='menu'>
        <span>SIN-AI</span>
        <div className='buttons'>
            <Button variant='outlined'>Cadastrar</Button>
            <Button variant='contained'>Entrar</Button>
        </div>
    </div>
    );
};

