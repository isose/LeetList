import Navbar from 'components/ui/Navbar';
import NavPanel from 'components/ui/NavPanel';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from 'styles/components/ui/AppLayout.module.css';

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
