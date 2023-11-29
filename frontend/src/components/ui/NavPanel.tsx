import React from 'react';
import { Link } from 'react-router-dom';
import styles from 'styles/components/ui/NavPanel.module.css';

const NavPanel = ({ open, toggleOpen }: any) => {
  return (
    open && (
      <div className={styles['nav-panel']}>
        <Link to='/' onClick={toggleOpen}>
          Questions
        </Link>
        <Link to='/lists' onClick={toggleOpen}>
          Lists
        </Link>
        <Link to='/my-lists' onClick={toggleOpen}>
          My Lists
        </Link>
      </div>
    )
  );
};

export default NavPanel;
