// components/Layout.js
import React from 'react';
import '../styles/Layout.module.css'

const Layout = ({ children, title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <nav>
        {/* Your toolbar here */}
      </nav>
      <main className='container'>{children}</main>
    </div>
  );
};

export default Layout;