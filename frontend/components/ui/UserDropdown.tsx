import React, { useRef, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from '../../styles/components/ui/UserDropdown.module.css';
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
    <div ref={userDropdown}>
      <div
        className={`${styles['user-dropdown__user-icon']} svg-container`}
        onClick={() => toggleState()}
      >
        <span>{auth.username}</span>
        <AiOutlineUser color='white' size={30} />
      </div>
      {open && (
        <div className={styles['user-dropdown__container']}>
          <Link to='my-lists'>My Lists</Link>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
