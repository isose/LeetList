import Error from 'pages/Error/Error';
import React from 'react';

const NotFound = () => {
  return (
    <Error
      title={'404 Page Not Found'}
      message={'The page you are looking for does not exist or has been removed.'}
      buttonText={'Back to home'}
      path={'/'}
    />
  );
};

export default NotFound;
