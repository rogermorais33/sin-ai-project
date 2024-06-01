import React, { useState } from 'react';
import './user-chat.css';

const UserChat = ({message}) => {
    return(
    <div className='user-chat'>
        <span>{message}</span>
    </div>
    );
};

export default UserChat