// components/Layout.js
import React from 'react';
import Link from 'next/link';
import styles from '../styles/Layout.module.css'

const Layout = ({ children, title }) => {
  return (
    <div>
        <Link href="/">
          <h1>{title}</h1>
        </Link>
      <nav>
        {/* Your toolbar here */}
      </nav>
      <main className={styles.container}>{children}</main>
    </div>
  );
};

export default Layout;