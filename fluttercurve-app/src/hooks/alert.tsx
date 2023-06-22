import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type AlertType = 'success' | 'error';

interface AlertProps {
  type: AlertType;
  message: string;
  dismiss: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, dismiss }) => {
  useEffect(() => {
    const timer = setTimeout(dismiss, 3000);

    return () => clearTimeout(timer);
  }, [dismiss]);

  const getColor = (): string => {
    switch (type) {
      case 'success':
        return '#4CAF50'; // Green
      case 'error':
        return '#F44336'; // Red
      default:
        return '#607D8B'; // Gray
    }
  };

  const alertStyle = {
    backgroundColor: getColor(),
    color: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    position: 'fixed',
    // New properties for top center positioning and fixed width
    top: 0,
    left: 0,
    right: 0,
    margin: '0 auto',
    width: '300px', // Adjust the width as per your requirement
  };
  

  return (
    <motion.div
      style={{
        ...alertStyle,
        backgroundColor: getColor(),
        color: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        position: 'fixed',
        // New properties for top-middle positioning
        top: 0,
        left: 0,
        right: 0,
        margin: '0 auto',
        width: 'fit-content', // Adjust the width as per your requirement
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {message}
    </motion.div>
  );
};

const useAlert = () => {
  const [alert, setAlert] = useState<null | { type: AlertType; message: string }>(
    null
  );

  const showAlert = (type: AlertType, message: string) => {
    if(typeof message !== "string" && type == "error") message = "Something Went Wrong"
    if(typeof message !== "string" && type == "success") message = "OK"
    setAlert({ type, message });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return {
    AlertComponent: alert ? (
      <Alert type={alert.type} message={alert.message} dismiss={hideAlert} />
    ) : null,
    showAlert,
    hideAlert,
  };
};

export default useAlert;