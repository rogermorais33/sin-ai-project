import './index.css';
import React from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SendIcon from '@mui/icons-material/Send';
import UserChat from '../../components/user-chat';
import { useState } from 'react';

export default function Chat() {
  const [components, setComponents] = useState([]);
  const [message, setMessage] = useState('');

  const addComponent = () => {
    if (message.trim() !== '') {  
      setComponents([...components, { message }]);
      setMessage('');
      
    }
  };

  return (
    <div className='chat'>
      <div className='menu'>
        ola
      </div>
      <div className='chat-area'>
      {components.map((component, index) => (
          <UserChat key={index} message={component.message} />
        ))}
      </div>
      <div className='chat-input'>
        <div className='input-area'>
          <input 
            type='text' 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Solicite a analise do produto'
          />
          <div className='icons'>
            <div className='icon'>
              <FileUploadIcon fill='313131' fontSize='medium'></FileUploadIcon>
            </div>
            <div className='icon'>
              <SendIcon fill='313131' fontSize='medium' onClick={addComponent}></SendIcon>
            </div>
          </div>
        </div>
        <span className='text-small'>
          Sin-AI pode cometer erros. Considere verificar informações importantes.
        </span>
      </div>
    </div>
  )
}
