import { Button } from '@mui/material';
import './drag-and-drop.css';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import React, { useState, useRef } from 'react';

export default function Drag({ onFileUpload }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  function selectFiles() {
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    setSelectedFile(event.target.files[0]);
    onFileUpload(event.target.files[0])

    const selectedFiles = event.target.files;
    if (selectedFiles.length === 0) return;
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].type !== 'application/pdf') continue;
      if (!files.some((e) => e.name === selectedFiles[i].name)) {
        setFiles((prevFiles) => [
          ...prevFiles,
          {
            name: selectedFiles[i].name,
            url: URL.createObjectURL(selectedFiles[i])
          }
        ]);
      }
    }
  }

  function onDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = 'copy';
  }

  function onDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = event.dataTransfer.files;
    for (let i = 0; i < droppedFiles.length; i++) {
      if (droppedFiles[i].type !== 'application/pdf') continue;
      if (!files.some((e) => e.name === droppedFiles[i].name)) {
        setFiles((prevFiles) => [
          ...prevFiles,
          {
            name: droppedFiles[i].name,
            url: URL.createObjectURL(droppedFiles[i])
          }
        ]);
      }
    }
  }

  function removeFile(fileName) {
    setFiles(files.filter((file) => file.name !== fileName));
  }

  return (
    <div className='dnd'>
      <div className='drag' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        {isDragging ? (
          <span className='select'>Solte o PDF aqui</span>
        ) : (
          <>
            <CloudUploadOutlinedIcon fill='313131' fontSize='large' />
            <div className='top'>
              <p className='underline'>Arraste e solte</p>&nbsp;para fazer upload
            </div>
            <p>ou</p>
            <Button variant='outlined' onClick={selectFiles}>
              Procurar arquivos
            </Button>
          </>
        )}
        <input name='file' type='file' className='file' multiple ref={fileInputRef} onChange={onFileSelect} />
      </div>
      <div className='container'>
        {files.map((file, index) => (
          <div className='file' key={index}>
            <img src='pdf.png'></img>
            <span>{file.name}</span>
            <span className='delete' onClick={() => removeFile(file.name)}>
              &times;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
