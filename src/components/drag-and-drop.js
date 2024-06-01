import { Button, Icon, SvgIcon } from '@mui/material';
import './drag-and-drop.css';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import React, {useState, useRef} from 'react';

export default function Drag() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState (false);
  const fileInputRef = useRef(null);

  function selectFiles(){
    fileInputRef.current.click();
  }
  return (
    <div className='dnd'>
      <div className='drag'>
        <CloudUploadOutlinedIcon fill='313131' fontSize='large'></CloudUploadOutlinedIcon>
        <div className='top'>
          <p className='underline'>Arraste e solte</p>&nbsp;para fazer upload
        </div>
        <p>ou</p>
        <Button variant='outlined' onClick={selectFiles}>
          Procurar arquivos
        </Button>
        <input name = "file" type = "file" className='file' multiple ref={fileInputRef} ></input>
      </div>
      <div className='container'>
        <div className='image'>
          <span className='delete'>&times;</span>
        </div>
        <img src='' alt=''></img>
      </div>
      <Button variant='contained'> Analisar Artigos</Button>
    </div>
  )
}