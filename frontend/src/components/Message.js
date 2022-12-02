/**
 * Component that renders message for user
 * (the alerts on top for success or errors)
 */
import React from 'react'
import { Alert } from 'react-bootstrap';

const Message = ({ variant = "info", children }) => {
    return (
      <Alert variant={variant} style={{ fontSize: 20 }} >
        <strong>{children}</strong>
      </Alert>
    );
  };
export default Message