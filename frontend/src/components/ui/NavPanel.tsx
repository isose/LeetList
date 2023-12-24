import React, { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import styles from 'styles/components/ui/NavPanel.module.css';

interface NavPanelProps {
  open: boolean;
  toggleOpen: MouseEventHandler;
}

const NavPanel = ({ open, toggleOpen }: NavPanelProps) => {
  return open ? (
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
  ) : (
    <></>
  );
};

export default NavPanel;
