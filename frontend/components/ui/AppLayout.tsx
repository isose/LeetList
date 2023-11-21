import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../../styles/components/ui/AppLayout.module.css';
import Navbar from './Navbar';
import NavPanel from './NavPanel';

const AppLayout = () => {
  const [openNavPanel, setOpenNavPanel] = useState(false);

  const toggleNavPanel = () => {
    setOpenNavPanel(!openNavPanel);
  };

  return (
    <>
      <Navbar toggleNavPanel={toggleNavPanel} />
      <div className='main'>
        <div className={styles.content}>
          <NavPanel open={openNavPanel} toggleOpen={toggleNavPanel} />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AppLayout;
