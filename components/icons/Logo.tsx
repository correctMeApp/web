import React from 'react';

const Logo = ({ ...props }) => (
  <img src="/logo.png" alt="Logo" width="32" height="32" {...props} />
);

export default Logo;