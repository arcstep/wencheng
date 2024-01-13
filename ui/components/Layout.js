// components/Layout.js
import React from 'react';
import Link from 'next/link';
import styles from './Layout.module.css'

const Layout = ({ children, title }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <Link href="/">
          <h1>{title}</h1>
        </Link>
        <nav>
          {/* Your toolbar here */}
        </nav>
      </div>
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
};

export default Layout;