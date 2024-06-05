import './index.css';
import '../../components/drag-and-drop';
import Drag from '../../components/drag-and-drop';
import Menu from '../../components/menu';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import React, { useState } from 'react';
import axios from 'axios'

export default function(){
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
  
  const [productFile, setProductFile] = useState(null);
  const [anvisaFile, setAnvisaFile] = useState(null);
  
  const [fileSelectedAlert, setFileSelectedAlert] = useState(false);
  const [uploadErrorAlert, setUploadErrorAlert] = useState(false);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');

  const handleProductFileUpload = (file) => {
    setProductFile(file);
  };

  const handleAnvisaFileUpload = (file) => {
    setAnvisaFile(file);
  };

  const uploadPdfProduct = async () => {
    try {
      const formDataProduct = new FormData();
      formDataProduct.set('pdf', productFile);
      const response = await axios.post(`${baseApiUrl}/api/upload/product/`, formDataProduct, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error setting session:', error);
      throw error;
    }
  };

  const uploadPdfQuestions = async (source_id) => {
    try {
      const formDataAnvisa = new FormData();
      formDataAnvisa.set('pdf', anvisaFile);
      formDataAnvisa.set('product', productName);
      formDataAnvisa.set('description', productDescription);
      formDataAnvisa.set('source_id', source_id);
      const response = await axios.post(`${baseApiUrl}/api/upload/question/`, formDataAnvisa, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob'
      });
      downloadFile(response.data)
      return response.data;
    } catch (error) {
      console.error('Error setting session:', error);
      throw error;
    }
  };

  const downloadFile = (file) => {
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'penis.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productFile || !anvisaFile) {
      setFileSelectedAlert(true);
      return;
    } else {
      setFileSelectedAlert(false);
    }
    try {
      const responseProduct = await uploadPdfProduct()
      const responseAnvisa = await uploadPdfQuestions(await responseProduct.source_id)
      setUploadSuccessAlert(true);
      return [responseProduct, responseAnvisa];
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadErrorAlert(true);
    }
  };

  return(
    <div className='home'>
      <Menu />
      <form className='drag-page' onSubmit={handleSubmit}>
        <div className='produto'>
          <h2>Produto a ser analisado</h2>
          <div className='forms'>
            <TextField 
              id="outlined-basic" 
              label="Nome do produto" 
              variant="outlined" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <TextField 
              id="outlined-basic" 
              label="Descrição do produto" 
              variant="outlined" 
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <Drag onFileUpload={ handleProductFileUpload } />
        </div>
        <div className='anvisa'>
          <h2>Formulário da anvisa</h2>
          <Drag onFileUpload={ handleAnvisaFileUpload } />
        </div>
        <div className="button">
          <Button type="submit" variant='contained' >Preencher formulário</Button>
        </div>
        <div className='alerts'>
          {fileSelectedAlert && (
            <Alert severity="error" onClose={() => setFileSelectedAlert(false)}>
                Por favor, selecione um arquivo primeiro.
            </Alert>
          )}
          {uploadErrorAlert && (
            <Alert severity="error" onClose={() => setUploadErrorAlert(false)}>
                Erro ao enviar o arquivo.
            </Alert>
          )}
          {uploadSuccessAlert && (
            <Alert severity="success" onClose={() => setUploadSuccessAlert(false)}>
                Arquivo enviado com sucesso.
            </Alert>
          )}
        </div>
      </form>
    </div>
  )
}