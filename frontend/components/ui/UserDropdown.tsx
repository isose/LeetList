import React, { useRef, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LogoutButton from './LogoutButton';

const UserDropdown = () => {
  const { auth } = useAuth();

  const [open, setOpen] = useState(false);
  const userDropdown = useRef<any>();

  const toggleState = () => setOpen(!open);

  const clickOutside = (e: any) => {
    if (open && userDropdown.current && !userDropdown.current.contains(e.target)) {
      setOpen(false);
    }
  };

  document.addEventListener('mousedown', clickOutside);

  return (
    <div className='user-dropdown' ref={userDropdown}>
      <div className='user-icon svg-container' onClick={() => toggleState()}>
        <span>{auth.username}</span>
        <AiOutlineUser color='white' size={30} />
      </div>
      {open && (
        <div className='user-dropdown-container'>
          <Link to='lists'>My Lists</Link>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
