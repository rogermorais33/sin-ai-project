import './index.css';
import '../../components/drag-and-drop';
import Drag from '../../components/drag-and-drop';
import Menu from '../../components/menu';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';

export default function(){
    return(
        <div className='home'>
            <Menu></Menu>
            <div className='drag-page'>
                <div className='produto'>
                    <h2>Produto a ser analisado</h2>
                    <div className='forms'>
                    <TextField id="outlined-basic" label="Nome do produto" variant="outlined" />
                    <TextField id="outlined-basic" label="Descrição do produto" variant="outlined" />
                    </div>
                    <Drag></Drag>
                </div>
                <div className='anvisa'>
                    <h2>Formulário da anvisa</h2>
                    <Drag></Drag>
                </div>
                <div className="button">
                <Button variant='contained' disabled >Preencher formulário</Button>
                </div>
               
            </div>
        </div>
    )
}