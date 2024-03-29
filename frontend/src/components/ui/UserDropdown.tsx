import React, { useRef, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import LogoutButton from 'src/components/ui/LogoutButton';
import useAuth from 'src/hooks/useAuth';
import styles from 'styles/components/ui/UserDropdown.module.css';

const UserDropdown = () => {
  const { auth } = useAuth();

  const [open, setOpen] = useState<boolean>(false);
  const userDropdown = useRef<HTMLDivElement>(null);

  const toggleState = () => setOpen(!open);

  const clickOutside = (e: MouseEvent) => {
    if (
      open &&
      userDropdown.current &&
      !userDropdown.current.contains(e.target as HTMLDivElement)
    ) {
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
        <span data-testid='username'>{auth?.username}</span>
        <AiOutlineUser color='white' size={30} />
      </div>
      {open && (
        <div className={styles['user-dropdown__container']}>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
