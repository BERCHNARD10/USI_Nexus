// protectedroute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Authentication logic here
  const isAuthenticated = true; // Placeholder for authentication check

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
  );
};

export default PrivateRoute;
