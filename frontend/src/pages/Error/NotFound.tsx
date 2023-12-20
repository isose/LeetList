import React from 'react';
import Error from 'src/pages/Error/Error';

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
